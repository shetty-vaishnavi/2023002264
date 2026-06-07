# Stage 1

# Notification System REST API Design

## Overview

This document describes the REST API contract for a Notification System that allows users to receive, view, manage, and track notifications. The APIs are designed for frontend-backend communication and support real-time notification delivery.

## Core Actions Supported

1. Create Notification
2. Get All Notifications
3. Get Notification By ID
4. Mark Notification As Read
5. Delete Notification
6. Get Unread Notifications
7. Get Notification Count
8. Real-Time Notification Delivery

## Common Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

## 1. Create Notification

### Endpoint

```http
POST /api/v1/notifications
```

### Request Body

```json
{
  "userId": "2023002264",
  "title": "Assignment Reminder",
  "message": "Assignment submission deadline is tomorrow.",
  "type": "academic",
  "priority": "high"
}
```

### Response

```json
{
  "notificationId": "NTF001",
  "message": "Notification created successfully"
}
```

## 2. Get All Notifications

### Endpoint

```http
GET /api/v1/notifications
```

### Response

```json
[
  {
    "notificationId": "NTF001",
    "title": "Assignment Reminder",
    "message": "Assignment submission deadline is tomorrow.",
    "type": "academic",
    "isRead": false,
    "createdAt": "2026-06-07T10:00:00Z"
  }
]
```

## 3. Get Notification By ID

### Endpoint

```http
GET /api/v1/notifications/{notificationId}
```

### Response

```json
{
  "notificationId": "NTF001",
  "title": "Assignment Reminder",
  "message": "Assignment submission deadline is tomorrow.",
  "type": "academic",
  "isRead": false
}
```

## 4. Mark Notification As Read

### Endpoint

```http
PATCH /api/v1/notifications/{notificationId}/read
```

### Response

```json
{
  "message": "Notification marked as read"
}
```

## 5. Delete Notification

### Endpoint

```http
DELETE /api/v1/notifications/{notificationId}
```

### Response

```json
{
  "message": "Notification deleted successfully"
}
```

## 6. Get Unread Notifications

### Endpoint

```http
GET /api/v1/notifications/unread
```

### Response

```json
[
  {
    "notificationId": "NTF001",
    "title": "Assignment Reminder",
    "isRead": false
  }
]
```

## 7. Get Notification Count

### Endpoint

```http
GET /api/v1/notifications/count
```

### Response

```json
{
  "total": 20,
  "unread": 4
}
```

## Notification Filtering

### Endpoint

```http
GET /api/v1/notifications?type=academic&isRead=false
```

### Description

Returns notifications filtered by type and read status.

## Real-Time Notification Mechanism

The system uses WebSocket connections for real-time notifications.

### Workflow

1. User logs into the application.
2. Frontend establishes a WebSocket connection.
3. Backend pushes notifications instantly.
4. Frontend displays notifications without page refresh.
5. Automatic reconnection is performed if the connection drops.

## High Level Architecture

```text
+------------+
| Frontend   |
+------------+
      |
      | REST API
      v
+------------+
| Backend    |
+------------+
      |
      v
+------------+
| Database   |
+------------+

      ^
      |
  WebSocket
      |
+------------+
| Frontend   |
+------------+
```

## Conclusion

The Notification System provides REST APIs for notification creation, retrieval, updates, deletion, unread tracking, and real-time delivery using WebSocket connections. The design ensures scalability, maintainability, and efficient user communication.


# Stage 2

## Database Selection

For the Notification System, PostgreSQL is chosen as the persistent storage solution.

### Reasons for Choosing PostgreSQL

1. Supports structured notification data.
2. Provides ACID compliance for reliable transactions.
3. Efficient indexing for fast notification retrieval.
4. Supports filtering, sorting, and pagination.
5. Scales well for large datasets.

---

## Database Schema

### Notifications Table

| Column Name     | Data Type    | Description                           |
| --------------- | ------------ | ------------------------------------- |
| notification_id | UUID         | Unique notification identifier        |
| user_id         | VARCHAR(50)  | User identifier                       |
| title           | VARCHAR(255) | Notification title                    |
| message         | TEXT         | Notification content                  |
| type            | VARCHAR(50)  | academic, placement, reminder, system |
| priority        | VARCHAR(20)  | low, medium, high                     |
| is_read         | BOOLEAN      | Read status                           |
| created_at      | TIMESTAMP    | Creation time                         |

### SQL Table Creation

```sql
CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    priority VARCHAR(20),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Queries Corresponding to REST APIs

### Create Notification

```sql
INSERT INTO notifications
(notification_id, user_id, title, message, type, priority)
VALUES
(uuid_generate_v4(),
'2023002264',
'Assignment Reminder',
'Assignment submission deadline is tomorrow.',
'academic',
'high');
```

### Get All Notifications

```sql
SELECT * FROM notifications;
```

### Get Notification By ID

```sql
SELECT *
FROM notifications
WHERE notification_id = 'NTF001';
```

### Mark Notification As Read

```sql
UPDATE notifications
SET is_read = TRUE
WHERE notification_id = 'NTF001';
```

### Delete Notification

```sql
DELETE FROM notifications
WHERE notification_id = 'NTF001';
```

### Get Unread Notifications

```sql
SELECT *
FROM notifications
WHERE is_read = FALSE;
```

### Get Notification Count

```sql
SELECT
COUNT(*) AS total,
SUM(CASE WHEN is_read = FALSE THEN 1 ELSE 0 END) AS unread
FROM notifications;
```

### Filter Notifications

```sql
SELECT *
FROM notifications
WHERE type = 'academic'
AND is_read = FALSE;
```

---

## Challenges as Data Volume Increases

### 1. Slow Query Performance

Problem:
Large numbers of notifications can slow down searches.

Solution:

* Create indexes on user_id, is_read, and created_at.
* Use query optimization techniques.

Example:

```sql
CREATE INDEX idx_user_id
ON notifications(user_id);
```

---

### 2. Storage Growth

Problem:
Notification records grow continuously.

Solution:

* Archive old notifications.
* Remove expired notifications periodically.

---

### 3. High Read Traffic

Problem:
Many users may request notifications simultaneously.

Solution:

* Implement caching.
* Use read replicas for scaling.

---

### 4. Pagination Requirement

Problem:
Returning thousands of notifications in a single response is inefficient.

Solution:

```sql
SELECT *
FROM notifications
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;
```

---

## Scalability Improvements

1. Database indexing.
2. Table partitioning.
3. Notification archiving.
4. Read replicas.
5. Redis caching layer.
6. Pagination for large datasets.

---

## Conclusion

PostgreSQL provides reliable persistence, strong consistency, efficient querying, and scalability for the Notification System. Proper indexing, caching, pagination, and archiving strategies ensure good performance even as notification volume increases.

