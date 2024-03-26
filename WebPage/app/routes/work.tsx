import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

import WorkPageCustomer from "~/components/OrderPage/CustomerPage";
import WorkPageWorker from "~/components/OrderPage/WorkerPage";
import { getUser } from "~/session.server";

/* TODO: Change this to return the actual role of a user,
         when roles are implemented
*/
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  return json({
    role: user?.id,
    request: request.url,
  });
};

export default function WorkPage() {
  const user = useLoaderData<typeof loader>();
  const [worker, setWorker] = useState(true);

  console.log("!!!!!!!!!!!!!!!!!!!!!!\n" + user?.request);

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
