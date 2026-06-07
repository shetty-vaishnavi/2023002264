import React from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
} from "@mui/material";

function PriorityNotifications() {
  const notifications = [
    {
      ID: "1",
      Type: "Placement",
      Message: "Visa Inc. hiring",
      Timestamp: "2026-06-06 16:30:16",
    },
    {
      ID: "2",
      Type: "Placement",
      Message: "PayPal Holdings Inc. hiring",
      Timestamp: "2026-06-06 15:30:01",
    },
    {
      ID: "3",
      Type: "Placement",
      Message: "Booking Holdings Inc. hiring",
      Timestamp: "2026-06-06 13:29:31",
    },
    {
      ID: "4",
      Type: "Result",
      Message: "project-review",
      Timestamp: "2026-06-07 03:58:31",
    },
    {
      ID: "5",
      Type: "Result",
      Message: "mid-sem",
      Timestamp: "2026-06-07 02:01:46",
    },
    {
      ID: "6",
      Type: "Event",
      Message: "tech-fest",
      Timestamp: "2026-06-06 12:00:00",
    },
  ];

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Priority Notifications
      </Typography>

      <Typography variant="h6" gutterBottom>
        Top Priority Notifications
      </Typography>

      {notifications.map((n, index) => (
        <Card key={n.ID} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">
              #{index + 1} {n.Type}
            </Typography>

            <Typography>
              <strong>Message:</strong> {n.Message}
            </Typography>

            <Typography>
              <strong>Timestamp:</strong> {n.Timestamp}
            </Typography>

            <Chip
              label={`Priority ${index + 1}`}
              color="primary"
              sx={{ mt: 2 }}
            />
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}

export default PriorityNotifications;