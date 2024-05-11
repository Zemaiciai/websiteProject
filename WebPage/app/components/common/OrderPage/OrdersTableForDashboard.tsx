import { Order, OrderStatus } from "@prisma/client";
import OrderTableRowForDashboard from "./OrderTableRowForDashboard";
import OrdersTableHeaderForDashboard from "./OrdersTableHeaderForDashboard";

interface OrdersTableProps {
  orderCards?: Order[] | null;
  important?: boolean;
  title: string;
}

export default function OrdersTable({
  orderCards,
  important,
  title,
}: OrdersTableProps) {
  if (!orderCards || orderCards.length === 0) {
    return <span>Neturite užsakymų</span>;
  }

  const ONE_HOUR_IN_MS = 60 * 60 * 1000;

  let imporantCardsAmount = 0;

  let sortedOrderCards = [...orderCards]
    .filter((order) => {
      if (order.orderStatus === OrderStatus.REMOVED) {
        return false;
      }
      return true;
    })
    .reverse();

  if (!sortedOrderCards || sortedOrderCards.length === 0) {
    return <span>Neturite užsakymų</span>;
  }

  const recentOrders = sortedOrderCards.slice(0, 5); // Display only the five most recent orders

  return (
    <>
      {imporantCardsAmount === 0 && important ? (
        <span className="text-center">There are no important orders</span>
      ) : (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <div className="table-container flex flex-col h-full overflow-auto bg-custom-200">
            <div className="table-wrapper flex flex-col h-full overflow-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <OrdersTableHeaderForDashboard />
                <tbody>
                  {recentOrders.map((order, index) => (
                    <OrderTableRowForDashboard
                      key={index}
                      order={order}
                      createdBy={order["createdBy"]["userName"]}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
