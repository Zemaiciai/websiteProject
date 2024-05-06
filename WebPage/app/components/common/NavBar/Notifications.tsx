import { NotificationTypes } from "@prisma/client";
import { Form, useLocation } from "@remix-run/react";
import useHowLongAgo from "~/hooks/useHowLongAgo";
import { Notification } from "@prisma/client";
import { useTypedLoaderData } from "remix-typedjson";
import { loader } from "~/root";
import Arrow from "~/assets/icons/Arrow/Arrow";
import { useEffect, useState } from "react";

export default function Notifications() {
  const { allNotifications } = useTypedLoaderData<typeof loader>();

  const [hideSeen, setHideSeen] = useState<boolean>(() => {
    const storedHideSeen = localStorage.getItem("hideSeen");
    return storedHideSeen ? JSON.parse(storedHideSeen) : false;
  });

  useEffect(() => {
    localStorage.setItem("hideSeen", JSON.stringify(hideSeen));
  }, [hideSeen]);

  const location = useLocation();

  const handleFormSubmission = (form: HTMLFormElement | null) =>
    form && form.submit();
  const handleHideSeen = () => setHideSeen(!hideSeen);

  const seenNotifications = allNotifications?.filter(
    (n: Notification) => n.isSeen === true,
  );
  const notifications = allNotifications
    ?.filter((n: Notification) => !n.isSeen)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  /*
   * TODO: Redirect to the specific order that has been
   * assigned, accpeted, declined, changed status, completed, payed
   */
  const getNotificationLocation = (
    type: NotificationTypes,
    n: Notification,
  ) => {
    const redirectTo = {
      FRIEND_REQUEST: `/profile/${n.senderId}`,
      FRIEND_DECLINED: `/profile/${n.senderId}`,
      FRIEND_ACCEPTED: `/profile/${n.senderId}`,
      FRIEND_REMOVE: `/profile/${n.senderId}`,
      ORDER_ACCEPTED: "/orders",
      ORDER_ASSIGNED: "/orders",
      ORDER_COMPLETED: "/orders",
      ORDER_DECLINED: "/orders",
      ORDER_IN_PROGRESS: "/orders",
      ORDER_PAYED: "/orders",
    };
    return redirectTo[type] ?? "404";
  };

  const renderNotifications = (notifications: Notification[]) =>
    notifications?.map((n, index) => (
      <li
        key={n.id ?? index}
        className="group flex px-1 py-2 w-full justify-between items-center first:pt-2 hover:bg-gray-200"
      >
        <Form
          method="post"
          className="flex w-[400px] cursor-pointer"
          action="/notifications"
          onClick={(e) => handleFormSubmission(e.currentTarget)}
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
            value="true"
            hidden
            readOnly
          />
          <div className={`${n.isSeen && "opacity-50"} hover:opacity-100`}>
            {n.message}
            <span className="text-[#626f86] font-normal text-nowrap text-sm pl-1">
              {useHowLongAgo(new Date(n.createdAt))}
            </span>
          </div>
        </Form>
        <div className="flex items-center">
          <Form method="post" action="/notifications">
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
              className={`h-5 w-5 opacity-0 flex items-center justify-center border rounded-full border-custom-800 accent-custom-850 cursor-pointer group-hover:opacity-100 ${
                n.isSeen && "bg-custom-800"
              }`}
              type="submit"
            ></button>
          </Form>
        </div>
      </li>
    ));

  return (
    <div className="notifications flex flex-col absolute h-48 w-[33.75rem] right-0 top-7 bg-custom-200 drop-shadow-lg rounded p-4 overflow-auto font-bold">
      <span className="text-2xl">Pranešimai</span>
      <div className="flex items-center justify-center mt-4 mb-2">
        <span className="text-nowrap mr-2 text-sm">Nauji pranešimai</span>
        <hr className="flex justify-center border-2 w-full border-custom-850 rounded-2xl" />
      </div>
      {!notifications || notifications.length <= 0 ? (
        <span className="text-sm font-normal">Nėra naujų pranešimų!</span>
      ) : (
        <div>
          <ul className="flex flex-col overflow-auto">
            {renderNotifications(notifications)}
          </ul>
        </div>
      )}
      {allNotifications && allNotifications.some((n) => n.isSeen) && (
        <>
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
          <ul
            className={`relative z-0 origin-top ease-in duration-[1000ms] ${
              hideSeen ? "overflow-hidden" : "h-max"
            }`}
          >
            <div
              className={`bg-custom-200 z-50 h-full w-full absolute origin-bottom ease-in-out duration-200 ${
                !hideSeen && "scale-y-0"
              }`}
            ></div>
            {renderNotifications(allNotifications.filter((n) => n.isSeen))}
          </ul>
        </>
      )}
    </div>
  );
}
