import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { redirect } from "remix-typedjson";

import {
  updateNotificationStatus,
  updateNotificationStatusToRead,
} from "../models/notification.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const notificationId = String(formData.get("notificationId"));
  const location = String(formData.get("location"));
  const clickedOnNotification = String(formData.get("clickedOnNotification"));

  if (clickedOnNotification === "true") {
    await updateNotificationStatusToRead(notificationId);
    return redirect(location);
  }

  await updateNotificationStatus(notificationId);

  return redirect(location);
};

export const loader = async () => redirect("/");
