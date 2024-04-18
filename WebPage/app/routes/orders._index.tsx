import { useEffect, useState } from "react";

import { Link } from "@remix-run/react";
import OrdersTable from "~/components/common/OrderPage/OrdersTable";
import { requireUserId } from "~/session.server";
import { getOrdersByUserId } from "~/models/order.server";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { useUser } from "~/utils";
import { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const userOrders = await getOrdersByUserId(userId, true);

  return typedjson(userOrders);
};

export default function OrdersPage() {
  const user = useUser();
  const orders = useTypedLoaderData<typeof loader>();
  const [worker, setWorker] = useState(false);

  const [searchQueries, setSearchQueries] = useState<{ [key: string]: string }>(
    {
      mainTable: "",
      importantTable: "",
    },
  );

  useEffect(() => {
    if (user && user.role === "Darbuotojas") {
      setWorker(true);
    }
  }, [user]);

  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement>,
    tableName: string,
  ) => {
    setSearchQueries({
      ...searchQueries,
      [tableName]: event.target.value,
    });
  };

  return (
    <div className="flex h-full p-4 bg-custom-200">
      <div className="orders-table grow flex justify-center place-items-start">
        <div className="w-full">
          <OrdersTable
            orderCards={orders}
            handleSearch={(event) => handleSearch(event, "mainTable")}
            searchQuery={searchQueries.mainTable}
            title={`${worker ? "Darbų sąrašas" : "Jūsų užsakymų sąrašas"}`}
          />
        </div>
      </div>

      <div className="customer-and-orderer-options flex-grow flex justify-center place-items-start">
        <div className="flex flex-col w-full">
          <div
            className={`flex button justify-center mb-4 ${worker && "hidden"}`}
          >
            <Link
              className="flex justify-center px-4 py-3 w-3/4 
                  text-white bg-custom-900 hover:bg-custom-850 
                  transition duration-300 ease-in-out rounded"
              to={"new"}
            >
              Sukurti užsakymą
            </Link>
          </div>
          <OrdersTable
            orderCards={orders}
            handleSearch={(event) => handleSearch(event, "importantTable")}
            searchQuery={searchQueries.importantTable}
            important={true}
            title={"Priminimų sąrašas"}
          />
        </div>
      </div>
    </div>
  );
}
