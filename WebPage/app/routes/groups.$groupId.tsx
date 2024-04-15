// GroupDetailPage.tsx
import React from "react";
import { useParams } from "react-router-dom"; // Make sure you're importing from react-router-dom

const GroupDetailPage = () => {
  // Get the group ID from the route parameters
  const { groupId } = useParams();

  // Render group details
  return (
    <div>
      <h1>Group Detail Page</h1>
      <p>Group ID: {groupId}</p>
    </div>
  );
};

export default GroupDetailPage;
