import { LoaderFunctionArgs, json } from "@remix-run/node";
import React from "react";

import Header from "~/components/common/header/header";
import { getNoteListItems } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const noteListItems = await getNoteListItems({ userId });
  return json({ noteListItems });
};

const Dashboard = () => {
  const user = useUser();

  return (
    <div
      style={{
        display: "grid",
        gridTemplate: "auto 1fr auto / 10% 1fr auto",
        minHeight: "100vh"
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid #ccc",
          gridColumn: "1 / 4"
        }}
      >
        <Header
          title="My Website"
          profilePictureSrc="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
          profileLink={"/profile/" + user.id}
        />
      </header>
      {/* Navigation Sidebar */}
      <div
        style={{
          borderRight: "1px solid #000000",
          backgroundColor: "#bdbdbd",
          gridColumn: "1 / 2"
        }}
      >
        <nav>
          <p
            style={{
              color: "black",
              textAlign: "left",
              marginLeft: "20px",
              marginTop: "10px",
              fontWeight: "bold"
            }}
          >
            Navigation
          </p>
          {/* Your navigation links to question anchors go here */}
        </nav>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gridColumn: "2 / 3",
          gap: "20px",
          marginTop: "10px",
          marginBottom: "5px",
          marginRight: "10px"
        }}
      >
        {/* Box 1 */}
        <div
          style={{
            backgroundColor: "#ffcdd2",
            padding: "20px",
            paddingBottom: "10%",
            borderRadius: "5px",
            marginLeft: "10%"
          }}
        >
          {/* Box 1 content */}
          <p>Stats</p>
        </div>

        {/* Box 2 */}
        <div
          style={{
            backgroundColor: "#9575cd",
            padding: "20px",
            borderRadius: "5px"
          }}
        >
          {/* Box 2 content */}
          <p>Stats</p>
        </div>

        {/* Box 3 */}
        <div
          style={{
            backgroundColor: "#5c6bc0",
            padding: "20px",
            borderRadius: "5px"
          }}
        >
          {/* Box 3 content */}
          <p>Stats</p>
        </div>

        {/* Combined Box for 4th and 8th */}
        <div
          style={{
            gridColumn: "4 / 5",
            gridRow: "1 / 4",
            backgroundColor: "#aed581",
            padding: "20px",
            paddingBottom: "100%",
            borderRadius: "5px"
          }}
        >
          {/* Box 4 and 8 content */}
          <p>Stats</p>
        </div>

        {/* Combined Box for 5th, 6th, and 7th */}
        <div
          style={{
            gridColumn: "1 / 3",
            gridRow: "2 / 4",
            backgroundColor: "#dce775",
            padding: "20px",
            paddingTop: "10%",
            paddingRight: "144%",
            borderRadius: "5px",
            marginLeft: "5%"
          }}
        >
          {/* Box 5, 6, and 7 content */}
          <p>Stats</p>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          borderTop: "1px solid black",
          backgroundColor: "black",
          color: "white",
          gridColumn: "1 / 4"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "20px"
          }}
        >
          {/* Footer Section 1 */}
          <div
            style={{
              flex: 1,
              padding: "20px",
              backgroundColor: "#000000",
              textAlign: "left"
            }}
          >
            <a
              style={{
                color: "red",
                textAlign: "left",
                marginLeft: "20px",
                fontWeight: "bold"
              }}
              href="https://www.vectorstock.com/royalty-free-vector/jco-letter-logo-design-on-black-background-vector-41865826"
            >
              Logotipas
            </a>
            <p
              style={{
                color: "white",
                marginLeft: "20px",
                marginTop: "10px",
                maxWidth: "calc(100% - 20px)",
                wordWrap: "break-word"
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              facilisis ligula et massa sollicitudin tristique. Vestibulum non
              magna
            </p>
            <p
              style={{
                color: "white",
                textAlign: "left",
                marginLeft: "20px",
                marginTop: "10px",
                fontWeight: "bold"
              }}
            >
              We Accept
            </p>
          </div>

          {/* Footer Section 2 */}
          <div style={{ flex: 1, padding: "20px", backgroundColor: "#000000" }}>
            <p
              style={{
                color: "white",
                textAlign: "left",
                marginLeft: "20px",
                fontWeight: "bold"
              }}
            >
              Text
            </p>
            <p
              style={{
                color: "gray",
                textAlign: "left",
                marginLeft: "20px",
                marginTop: "10px"
              }}
            >
              Text
            </p>
            <p
              style={{
                color: "gray",
                textAlign: "left",
                marginLeft: "20px",
                marginTop: "10px"
              }}
            >
              Text
            </p>
            <p
              style={{
                color: "gray",
                textAlign: "left",
                marginLeft: "20px",
                marginTop: "10px"
              }}
            >
              Text
            </p>
            <p
              style={{
                color: "gray",
                textAlign: "left",
                marginLeft: "20px",
                marginTop: "10px"
              }}
            >
              Text
            </p>
            <p
              style={{
                color: "gray",
                textAlign: "left",
                marginLeft: "20px",
                marginTop: "10px"
              }}
            >
              Text
            </p>
          </div>

          {/* Footer Section 3 */}
          <div style={{ flex: 1, padding: "20px", backgroundColor: "#000000" }}>
            <p
              style={{
                color: "white",
                textAlign: "left",
                marginLeft: "20px",
                fontWeight: "bold"
              }}
            >
              Text
            </p>
            <p
              style={{
                color: "gray",
                textAlign: "left",
                marginLeft: "20px",
                marginTop: "10px"
              }}
            >
              Text
            </p>
            <p
              style={{
                color: "gray",
                textAlign: "left",
                marginLeft: "20px",
                marginTop: "10px"
              }}
            >
              Text
            </p>
            <p
              style={{
                color: "gray",
                textAlign: "left",
                marginLeft: "20px",
                marginTop: "10px"
              }}
            >
              Text
            </p>
            <p
              style={{
                color: "gray",
                textAlign: "left",
                marginLeft: "20px",
                marginTop: "10px"
              }}
            >
              Text
            </p>
            <p
              style={{
                color: "gray",
                textAlign: "left",
                marginLeft: "20px",
                marginTop: "10px"
              }}
            >
              Text
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
