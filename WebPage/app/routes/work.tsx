import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

import WorkPageCustomer from "~/components/WorkPage/pages/CustomerPage";
import WorkPageWorker from "~/components/WorkPage/pages/WorkerPage";
import { getUser } from "~/session.server";

/* TODO: Change this to return the actual role of a user,
         when roles are implemented
*/
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  return user
    ? json({
        role: user.id
      })
    : null;
};

export default function WorkPage() {
  const user = useLoaderData<typeof loader>();
  const [worker, setWorker] = useState(true);

  useEffect(() => {
    console.log(user);
    if (user && user.role === "worker") {
      setWorker(true);
    }
  }, [user]);

  return (
    <div className="main m-10">
      {worker ? <WorkPageWorker /> : <WorkPageCustomer />}
    </div>
  );
}