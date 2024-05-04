import { NotificationTypes } from "@prisma/client";
import { Link } from "@remix-run/react";
import useHowLongAgo from "~/hooks/useHowLongAgo";
import { Notification } from "@prisma/client";

interface NotificationsProps {
  notifications: Notification[] | null;
  handleNotificationsClick: () => void;
}

export default function Notifications({
  notifications,
  handleNotificationsClick,
}: NotificationsProps) {
  /*
   * TODO: Redirect to the specific order that has been
   * assigned, accpeted, declined, changed status, completed, payed
   */
  const handleNotificationClick = (
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
        redirectTo = "NĖRA ŽINTUĖS";
        break;
    }

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
      <hr className="border-2 mt-4 mb-2 w-full border-custom-850 rounded-2xl" />
      {!notifications || notifications.length <= 0 ? (
        <span>No notifications!</span>
      ) : (
        <div className="flex flex-col overflow-auto">
          {notifications.map((n, index) => (
            <div
              key={n.id ?? index}
              className="flex px-1 py-2 first:pt-2 hover:bg-gray-200"
            >
              <Link to={handleNotificationClick(n.notificationType, n)}>
                <div className="flex" onClick={handleNotificationsClick}>
                  {n.message}
                  <span className="text-[#626f86] font-normal text-sm pl-1">
                    {useHowLongAgo(new Date(n.createdAt))}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
