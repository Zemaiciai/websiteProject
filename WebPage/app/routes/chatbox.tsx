import { LoaderFunctionArgs, json } from "@remix-run/node";
import { getNoteListItems } from "~/models/note.server";
import { getUser, requireUserId } from "~/session.server";
import { MultiChatSocket, MultiChatWindow, useMultiChatLogic } from "react-chat-engine-advanced";

import { useUser } from "~/utils";
import { userInfo } from "os";

const chatBox = (props) => {
  const user = useUser();
  const chatProps = useMultiChatLogic(
    'e88a61b3-4e98-4475-ae39-73aa1919a7dd',
    user.firstName,
    user.lastName
  );
  return (
    <div style={{height: '100vh'}}>
      <MultiChatSocket {...chatProps} />
      <MultiChatWindow {...chatProps} style={{height: '100%'}} />
    </div>
  )
}

export default chatBox


