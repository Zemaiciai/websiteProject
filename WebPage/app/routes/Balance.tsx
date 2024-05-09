import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getMoneyLogsByUserId } from "~/models/userBalanceLog.server";
import { requireUser } from "~/session.server";

export const meta: MetaFunction = () => [{ title: "D.U.K. - Žemaičiai" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);
  const userBalanceLog = await getMoneyLogsByUserId(user.id);

  console.log(user.balance);
  return json({
    user,
    userBalanceLog,
  });
};

const FAQ = () => {
  const { user, userBalanceLog } = useLoaderData<typeof loader>();
  return (
    <div className="flex h-full bg-custom-100">
      <div className="w-full h-full flex flex-grow flex-col bg-custom-100 ">
        <div className="flex flex-col justify-between bg-custom-200 m-3 pl-8 pr-8 pt-4 pb-8">
          <div className="w-full  bg-white border border-gray-200 rounded-lg shadow mt-5">
            <div className="flex flex-col items-center pb-10">
              <h1 className="mb-1 text-2xl font-medium text-gray-900 pt-5">
                Balansas
              </h1>
              <span className="text-5xl text-green-500">{user?.balance}€</span>
            </div>
          </div>
          <div className="mt-5 text-left">
            <h1 className="font-bold text-2xl">Balanso pokyčiai:</h1>
          </div>
          <div>
            <div className="flex justify-between pb-5"></div>
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                  <tr>
                    <th scope="col" className="p-4">
                      Pervedimą atliko
                    </th>
                    <th scope="col" className="p-4">
                      Balanso pokyčio aprašymas
                    </th>
                    <th scope="col" className="p-4">
                      Balansas pasikeitė iš
                    </th>
                    <th scope="col" className="p-4">
                      Balansas pasikeitė į
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userBalanceLog.map((log) => (
                    <tr
                      key={log.id}
                      className="bg-white border-b  hover:bg-gray-50 "
                    >
                      <td className="px-6 py-4">{log.whoDidChanges}</td>
                      <td className="px-6 py-4">{log.description}</td>
                      <td className="px-6 py-4">{log.balanceFrom}</td>
                      <td className="px-6 py-4">{log.balanceTo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
