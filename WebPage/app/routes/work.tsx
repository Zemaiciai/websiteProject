import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";

import WorkPageCustomer from "~/components/OrderPage/CustomerPage";
import WorkPageWorker from "~/components/OrderPage/WorkerPage";
import { getUser } from "~/session.server";

/* TODO: Change this to return the actual role of a user,
         when roles are implemented
*/
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  return user
    ? json({
        role: user.id,
      })
    : null;
};

export default function WorkPage() {
  const user = useLoaderData<typeof loader>();
  const [worker, setWorker] = useState(true);

  useEffect(() => {
    if (user && user.role === "worker") {
      setWorker(true);
    }
  }, [user]);

  return (
    <div className="main">
      {worker ? <WorkPageWorker /> : <WorkPageCustomer />}
    </div>
  );
}
