import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

import { getUser } from "~/session.server";
import stylesheet from "~/tailwind.css";
import NavBar from "./components/common/NavBar/NavBar";
import { useEffect, useState } from "react";
import NavBarHeader from "./components/common/NavBar/NavBarHeader";
import { useOptionalUser } from "./utils";
import NewFooter from "./components/newFooter/NewFooter";
import { getUserNotifications } from "./models/notification.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);

  if (!user) {
    return typedjson({ user: null, allNotifications: null });
  }

  return typedjson({
    allNotifications: await getUserNotifications(user.id),
    user: user,
  });
};

export default function App() {
  const [headerTitle, setHeaderTitle] = useState("Loading...");
  const [showNavigation, setShowNavigation] = useState(false);

  const location = useLocation();

  const headerTitlesDictionary = {
    "/orders": "Užsakymų sąrašas",
    "/orders/new": "Sukurti užsakymą",
    "/dashboard": "Dashboard",
    "/messages": "žinutės",
    "/calender": "Kalendorius",
    "/FAQ": "Dažnai užduodami klausimai",
    "/groups": "Grupės",
    "/groups/new": "Sukurti grupę",
    "/questioner": "Užduoti klausimą",
    "/workerAds": "Reklamos",
    "/workerAds/new": "Sukurti reklamą",
  };

  useEffect(() => {
    setShowNavigation(true);

    switch (location.pathname) {
      case "/admin":
      case "/":
      case "/ban":
      case "/join":
      case "/login":
      case "/contractExpired":
        setShowNavigation(false);
        break;
    }
    if (location.pathname.startsWith("/profile")) {
      setHeaderTitle("Profilis");
      return;
    }
    if (location.pathname.match("/workerAds/[^new].+")) {
      setHeaderTitle("Reklama");
      return;
    }
    if (location.pathname.match("/groups/[^new].+")) {
      setHeaderTitle(`Grupė ${location.pathname.slice(8)}`);
      return;
    }

    if (headerTitlesDictionary[location.pathname] === undefined) {
      setHeaderTitle("ROOT.TSX REIKIA NUSTATYTI HEADER TITLE");
      return;
    }

    setHeaderTitle(headerTitlesDictionary[location.pathname]);
  }, [location.pathname]);

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        {showNavigation ? (
          <div className="flex h-screen w-screen bg-custom-100 overflow-auto">
            <div className="navbar-container">
              <NavBar
                title={"Žemaičiai"}
                redirectTo={"dashboard"}
                tabTitles={{
                  dashboard: "Titulinis",
                  orders: "Užsakymai",
                  messages: "Žinutės",
                  calender: "Kalendorius",
                  FAQ: "D.U.K",
                  groups: "Grupės",
                  questioner: "Klausimai",
                  workerAds: "Reklamos",
                }}
              />
            </div>
            <div className="flex w-full h-full flex-col bg-custom-100 overflow-auto">
              <NavBarHeader title={headerTitle} />
              <div className="flex flex-col justify-between h-full">
                <div className="grow w-full">
                  <Outlet />
                </div>
                <NewFooter />
              </div>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
