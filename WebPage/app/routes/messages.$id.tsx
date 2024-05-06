import { Message } from "@prisma/client";
import { LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Form, json, useLoaderData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

import { useParams } from "react-router-dom";
import {
  getMessagesByConversationId,
  sendMessage,
} from "~/models/messages.server";

import { requireUser } from "~/session.server";

export const meta: MetaFunction = () => [
  { title: "Žinutės peržiūra - Žemaičiai" },
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

  // Ref for the chatbox container
  const chatboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the chatbox when it is loaded or updated
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messageList]);

  return (
    <div className="flex flex-col h-full w-full bg-custom-200 m-4">
      {/* Display existing messages */}
      <div
        className="overflow-y-auto max-h-[750px] flex flex-col space-y-4 flex-grow p-2"
        ref={chatboxRef}
      >
        {messageList.messages.map((message) => (
          <div
            key={message.id}
            className={
              message.senderId === userUsingRN.id
                ? "flex flex-row-reverse"
                : "flex flex-row"
            }
          >
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0 ml-2 mr-2">
              {"Ž"}
            </div>
            <div
              className={
                message.senderId === userUsingRN.id
                  ? "relative ml-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl"
                  : "relative mr-3 text-sm bg-white py-2 px-4 shadow rounded-xl"
              }
              style={{ height: "auto" }} // Adjust the height dynamically
            >
              <div>
                <TextareaAutosize
                  defaultValue={message.text}
                  readOnly
                  disabled
                  style={{
                    resize: "none",
                    border: "none",
                    outline: "none",
                    background: "none",
                    overflow: "hidden",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form to send new message */}
      <Form method="post" className="mt-4">
        <input name="form-id" hidden defaultValue="sendingMessage" />
        <input name="whoSentMessage" hidden defaultValue={userUsingRN.id} />
        <input name="messageId" hidden defaultValue={messageId} />
        <div className="flex">
          <input
            type="text"
            name="messageContent"
            className="flex-grow border rounded-l-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
          />
          <button
            type="submit"
            className="flex items-center justify-center bg-custom-800 hover:bg-custom-850 rounded-r-xl text-white px-4 py-1"
          >
            Siųsti
          </button>
        </div>
      </Form>
    </div>
  );
};

export default GroupDetailPage;
