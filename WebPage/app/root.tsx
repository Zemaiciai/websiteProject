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

  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof localStorage == "undefined") return "";

    const storedActiveTabValue = localStorage.getItem("activeTab");
    return storedActiveTabValue ? JSON.parse(storedActiveTabValue) : "";
  });

  useEffect(() => {
    localStorage.setItem("activeTab", JSON.stringify(activeTab));
  }, [activeTab]);

  const location = useLocation();

  useEffect(() => {
    setShowNavigation(true);

    switch (location.pathname.toLocaleLowerCase()) {
      case "/admin":
      case "/":
      case "/ban":
      case "/join":
      case "/login":
      case "/contractExpired":
        setShowNavigation(false);
        break;
      case "/orders":
        setHeaderTitle("Užsakymų sąrašas");
        break;
      case "/dashboard":
        setHeaderTitle("Dashboard");
        break;
      case "/orders/new":
        setHeaderTitle("Užsakymo sukurimas");
        break;
      case "/calender":
        setHeaderTitle("Darbų Kalendorius");
        break;
      case "/faq":
        setHeaderTitle("Dažnai užduodami klausimai");
        break;
      case "/groups":
        setHeaderTitle("Grupės");
        break;
      case "/groups/new":
        setHeaderTitle("Sukurti grupę");
        break;
      case "/workerads":
        setHeaderTitle("Reklamos");
        break;
      case "/workerads/new":
        setHeaderTitle("Sukurti reklamą");
        break;
      case "/questioner":
        setHeaderTitle("Užduoti klausimą");
        break;
      default:
        setHeaderTitle("NĖRA HEADER PAVADINIMO ROOT.TSX FAILE");
        break;
    }

    if (location.pathname.startsWith("/profile")) {
      setHeaderTitle("Profilis");
    }

    if (
      location.pathname.match("/workerAds/[a-zA-Z0-9]+$") &&
      !location.pathname.endsWith("new")
    ) {
      setHeaderTitle("Reklama");
    }
  }, [location.pathname]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
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
                handleTabClick={handleTabClick}
                redirectTo={"dashboard"}
                activeTab={activeTab}
                tabTitles={{
                  orders: "Užsakymai",
                  dashboard: "Dashboard",
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
