import { Message } from "@prisma/client";
import { LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Form, json, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import {
  getMessagesByConversationId,
  sendMessage,
} from "~/models/messages.server";

import { requireUser } from "~/session.server";
export const meta: MetaFunction = () => [
  { title: "Reklamos peržiūra - Žemaičiai" },
];

export const action = async (actionArg) => {
  const formData = await actionArg.request.formData();
  const formid = formData.get("form-id");

  if (formid === "sendingMessage") {
    const whoSentMessage = formData.get("whoSentMessage");
    const messageContent = formData.get("messageContent");
    const messageId = formData.get("messageId");
    sendMessage(messageId, whoSentMessage, messageContent);
    return null;
  }
  return null;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userUsingRN = await requireUser(request);

  const url = request.url;
  const parts = url.split("/");
  const messageId = parts[parts.length - 1];

  const messageList = await getMessagesByConversationId(messageId);

  return json({ userUsingRN, messageId, messageList });
};

const GroupDetailPage = () => {
  const { addId } = useParams();
  const { userUsingRN, messageId, messageList } =
    useLoaderData<typeof loader>();

  return (
    <>
      {/* Display existing messages */}
      <div>
        {messageList.messages.map((message) => (
          <div
            key={message.id}
            className={
              message.senderId === userUsingRN.id ? "sent" : "received"
            }
          >
            <p>{message.text}</p>
            <p>Sent by: {message.senderId}</p>
          </div>
        ))}
      </div>

      {/* Form to send new message */}

      <Form method="post">
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full  px-3 mb-6 md:mb-0">
            <input name="form-id" hidden defaultValue="sendingMessage" />
            <input name="whoSentMessage" hidden defaultValue={userUsingRN.id} />
            <input name="messageId" hidden defaultValue={messageId} />
            <input type="text" name="messageContent" />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded bg-custom-800  px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
        >
          siusti!
        </button>
      </Form>
    </>
  );
};

export default GroupDetailPage;
