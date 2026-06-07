import React, { useState } from "react";

function AllNotifications() {
  const [filter, setFilter] = useState("All");

  const [notifications] = useState([
    {
      ID: "1",
      Type: "Placement",
      Message: "Visa Inc. hiring",
      Timestamp: "2026-06-06 16:30:16",
      viewed: false,
    },
    {
      ID: "2",
      Type: "Placement",
      Message: "PayPal Holdings Inc. hiring",
      Timestamp: "2026-06-06 15:30:01",
      viewed: true,
    },
    {
      ID: "3",
      Type: "Result",
      Message: "project-review",
      Timestamp: "2026-06-07 03:58:31",
      viewed: false,
    },
    {
      ID: "4",
      Type: "Result",
      Message: "mid-sem",
      Timestamp: "2026-06-07 02:01:46",
      viewed: true,
    },
    {
      ID: "5",
      Type: "Event",
      Message: "tech-fest",
      Timestamp: "2026-06-06 12:00:00",
      viewed: false,
    },
  ]);

  const filteredNotifications =
    filter === "All"
      ? notifications
      : notifications.filter((n) => n.Type === filter);

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Notifications</h1>

      <label>
        Filter:
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="All">All</option>
          <option value="Placement">Placement</option>
          <option value="Result">Result</option>
          <option value="Event">Event</option>
        </select>
      </label>

      <p>Total Notifications: {filteredNotifications.length}</p>

      {filteredNotifications.map((n) => (
        <div
          key={n.ID}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p><b>Type:</b> {n.Type}</p>
          <p><b>Message:</b> {n.Message}</p>
          <p><b>Timestamp:</b> {n.Timestamp}</p>

          <p>
            <b>Status:</b>{" "}
            {n.viewed ? "VIEWED" : "NEW"}
          </p>
        </div>
      ))}
    </div>
  );
}

export default AllNotifications;