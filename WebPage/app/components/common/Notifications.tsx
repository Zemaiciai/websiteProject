import { NotificationTypes } from "@prisma/client";
import { Form, Link, useLocation, useNavigate } from "@remix-run/react";
import useHowLongAgo from "~/hooks/useHowLongAgo";
import { Notification } from "@prisma/client";
import { useTypedLoaderData } from "remix-typedjson";
import { loader } from "~/root";
import Arrow from "~/assets/icons/Arrow/Arrow";
import { useState } from "react";

interface NotificationsProps {
  handleNotificationsClick: () => void;
}

export default function Notifications({
  handleNotificationsClick,
}: NotificationsProps) {
  const { allNotifications } = useTypedLoaderData<typeof loader>();
  const [hideSeen, setHideSeen] = useState(false);
  const location = useLocation();
  const handleFormSubmission = (form: HTMLFormElement | null) => {
    if (form) {
      form.submit();
    }
  };

  const handleHideSeen = () => {
    setHideSeen(!hideSeen);
  };

  if (allNotifications) {
    allNotifications[0].createdAt.setFullYear(new Date().getFullYear() + 1);
    allNotifications[1].createdAt.setMonth(new Date().getMonth() + 1);
    allNotifications[2].createdAt = new Date(
      new Date().setDate(new Date().getDate() + 1),
    );
    allNotifications[3].createdAt.setHours(new Date().getHours() + 1);
  }

  const seenNotifications = allNotifications?.filter(
    (n: Notification) => n.isSeen === true,
  );
  const notifications = allNotifications?.filter(
    (n: Notification) => n.isSeen === false,
  );

  /*
   * TODO: Redirect to the specific order that has been
   * assigned, accpeted, declined, changed status, completed, payed
   */
  const getNotificationLocation = (
    notificationType: NotificationTypes,
    notification: Notification,
  ) => {
    let redirectTo = "";

    switch (notificationType) {
      case NotificationTypes.FRIEND_REQUEST:
      case NotificationTypes.FRIEND_DECLINED:
      case NotificationTypes.FRIEND_ACCEPTED:
      case NotificationTypes.FRIEND_REMOVE:
        redirectTo = `/profile/${notification.senderId}`;
        break;
      case NotificationTypes.ORDER_ACCEPTED:
      case NotificationTypes.ORDER_ASSIGNED:
      case NotificationTypes.ORDER_COMPLETED:
      case NotificationTypes.ORDER_DECLINED:
      case NotificationTypes.ORDER_IN_PROGRESS:
      case NotificationTypes.ORDER_PAYED:
        redirectTo = "/orders";
        break;
      default:
        redirectTo = "404";
        break;
    }

    console.log(redirectTo);

    return redirectTo;
  };

  return (
    <div
      className="
      notifications flex flex-col
      absolute h-48 w-[33.75rem] right-0 top-7 
      bg-custom-200 drop-shadow-lg rounded p-4"
    >
      <span className="text-2xl">Pranešimai</span>

      {!notifications || notifications.length <= 0 ? (
        <span>Nėra naujų pranešimų!</span>
      ) : (
        <div>
          <div className="flex items-center justify-center mt-4 mb-2">
            <span className="text-nowrap mr-2 text-sm">Nauji pranešimai</span>
            <hr className="flex justify-center border-2 w-full border-custom-850 rounded-2xl" />
          </div>
          <ul className="flex flex-col overflow-auto">
            {notifications.map((n, index) => (
              <li
                key={n.id ?? index}
                className="group flex px-1 py-2 w-full justify-between items-center first:pt-2 hover:bg-gray-200"
              >
                <Form
                  method="post"
                  className="flex w-[400px] cursor-pointer"
                  action="/notifications"
                  onClick={(e) =>
                    handleFormSubmission(e.currentTarget as HTMLFormElement)
                  }
                >
                  <input
                    id={`notification-${index}`}
                    name="notificationId"
                    type="hidden"
                    value={n.id}
                    hidden
                    readOnly
                  />
                  <input
                    id={`location-${index}`}
                    name="location"
                    type="hidden"
                    value={getNotificationLocation(n.notificationType, n)}
                    hidden
                    readOnly
                  />
                  <input
                    id={`special-${index}`}
                    name="clickedOnNotification"
                    type="hidden"
                    value={"true"}
                    hidden
                    readOnly
                  />
                  <div
                    className={`${n.isSeen && "opacity-50"} hover:opacity-100`}
                  >
                    {n.message}
                    <span className="text-[#626f86] font-normal text-nowrap text-sm pl-1">
                      {useHowLongAgo(new Date(n.createdAt))}
                    </span>
                  </div>
                </Form>
                {n.isSeen && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-4 w-4 absolute right-[1.39rem] text-custom-800 group-hover:hidden"
                  >
                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                  </svg>
                )}
                <div className="flex items-center">
                  <Form method="post" name="form" action="/notifications">
                    <input
                      id={`notification-id-${index}`}
                      name="notificationId"
                      type="changeReadStatus"
                      value={n.id}
                      hidden
                      readOnly
                    />
                    <input
                      id={`location-${index}`}
                      name="location"
                      type="changeReadStatus"
                      value={location.pathname}
                      hidden
                      readOnly
                    />
                    <button
                      className={`h-5 w-5 opacity-0 flex items-center justify-center border rounded-full border-custom-800 accent-custom-850 cursor-pointer
                  group-hover:opacity-100 ${n.isSeen && "bg-custom-800"}`}
                      type="submit"
                    ></button>
                  </Form>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!seenNotifications || seenNotifications.length <= 0 ? null : (
        <div className="h-max">
          <div
            className="flex items-center justify-center mt-4 mb-2 cursor-pointer"
            onClick={handleHideSeen}
          >
            <Arrow
              className={`h-4 w-4 mr-2 flex items-center justify-center ${
                hideSeen && "-rotate-90"
              }`}
            />
            <span className="text-nowrap mr-2 text-sm">
              Perskaityti pranešimai
            </span>
            <hr className="flex justify-center border-2 w-full border-custom-850 rounded-2xl" />
          </div>
          <ul className="relative overflow-auto z-0">
            <div
              className={`bg-custom-200 z-50 h-full w-full absolute opacity-100 origin-bottom ease-in-out duration-200 ${
                !hideSeen && "scale-y-0 "
              }`}
            ></div>
            {seenNotifications.map((n, index) => (
              <li
                key={n.id ?? index}
                className="group flex px-1 py-2 w-full justify-between items-center first:pt-2 hover:bg-gray-200"
              >
                <Form
                  method="post"
                  className="flex w-[400px] cursor-pointer"
                  action="/notifications"
                  onClick={(e) =>
                    handleFormSubmission(e.currentTarget as HTMLFormElement)
                  }
                >
                  <input
                    id={`notification-${index}`}
                    name="notificationId"
                    type="hidden"
                    value={n.id}
                    hidden
                    readOnly
                  />
                  <input
                    id={`location-${index}`}
                    name="location"
                    type="hidden"
                    value={getNotificationLocation(n.notificationType, n)}
                    hidden
                    readOnly
                  />
                  <input
                    id={`special-${index}`}
                    name="clickedOnNotification"
                    type="hidden"
                    value={"true"}
                    hidden
                    readOnly
                  />
                  <div
                    className={`${n.isSeen && "opacity-50"} hover:opacity-100`}
                  >
                    {n.message}
                    <span className="text-[#626f86] font-normal text-nowrap text-sm pl-1">
                      {useHowLongAgo(new Date(n.createdAt))}
                    </span>
                  </div>
                </Form>
                {n.isSeen && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-4 w-4 absolute right-[1.39rem] text-custom-800 group-hover:hidden"
                  >
                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                  </svg>
                )}
                <div className="flex items-center">
                  <Form method="post" name="form" action="/notifications">
                    <input
                      id={`notification-id-${index}`}
                      name="notificationId"
                      type="changeReadStatus"
                      value={n.id}
                      hidden
                      readOnly
                    />
                    <input
                      id={`location-${index}`}
                      name="location"
                      type="changeReadStatus"
                      value={location.pathname}
                      hidden
                      readOnly
                    />
                    <button
                      className={`h-5 w-5 opacity-0 flex items-center justify-center border rounded-full border-custom-800 accent-custom-850 cursor-pointer
                  group-hover:opacity-100 ${n.isSeen && "bg-custom-800"}`}
                      type="submit"
                    ></button>
                  </Form>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
