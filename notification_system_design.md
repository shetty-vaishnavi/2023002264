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

# Stage 3

## Query Analysis

Given Query:

```sql
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;
```

### Is the Query Accurate?

Yes. The query correctly retrieves all unread notifications for student ID 1042 and sorts them by creation time.

### Why is it Slow?

The database currently contains approximately:

* 50,000 students
* 5,000,000 notifications

Without proper indexing, the database must scan a large number of rows to find matching records. Sorting the results using `ORDER BY createdAt` also increases execution time.

### Recommended Improvement

Create a composite index on the columns used in filtering and sorting:

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt);
```

This allows the database to quickly locate unread notifications for a student and return them in sorted order.

### Expected Computational Cost

Without index:

```text
Time Complexity ≈ O(N)
```

The database may scan millions of rows.

With composite index:

```text
Time Complexity ≈ O(log N)
```

The database can directly navigate to the required records.

## Should We Add Indexes on Every Column?

No.

Adding indexes on every column is not a good practice because:

* Extra storage space is consumed.
* Insert operations become slower.
* Update operations become slower.
* Many indexes remain unused.

Indexes should only be created for frequently filtered, sorted, or joined columns.

## Query for Placement Notifications in Last 7 Days

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
  AND createdAt >= NOW() - INTERVAL 7 DAY;
```

## Additional Optimization Suggestions

1. Use pagination when fetching notifications.

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
  AND isRead = false
ORDER BY createdAt DESC
LIMIT 50 OFFSET 0;
```

2. Archive old notifications to a separate table.

3. Periodically remove expired notifications.

4. Monitor query execution plans using:

```sql
EXPLAIN
SELECT *
FROM notifications
WHERE studentID = 1042
  AND isRead = false;
```

## Conclusion

The query is functionally correct but may become slow as notification volume grows. A composite index on `studentID`, `isRead`, and `createdAt` significantly improves performance. Creating indexes on every column is unnecessary and increases storage and write overhead. Proper indexing, pagination, and archival strategies help maintain scalability for millions of notifications.


# Stage 4

## Problem Statement

Currently, notifications are fetched from the database every time a user loads a page. As the number of users and notifications grows, this generates a large number of database queries, increases response time, and creates unnecessary load on the database server.

## Proposed Solutions

### 1. Implement Caching

Frequently accessed notification data can be stored in a cache layer such as Redis.

#### Workflow

1. User requests notifications.
2. Application checks Redis cache.
3. If data exists, return cached notifications.
4. If data is not found, fetch from database and store in cache.

#### Benefits

* Faster response times.
* Reduced database load.
* Improved user experience.

#### Tradeoffs

* Additional infrastructure required.
* Cache invalidation must be handled carefully.
* Slight increase in system complexity.

---

### 2. Use Real-Time Notifications

Instead of fetching notifications on every page refresh, establish a WebSocket connection after login.

#### Workflow

1. User logs in.
2. Frontend opens WebSocket connection.
3. Backend pushes new notifications instantly.
4. Frontend updates notification list dynamically.

#### Benefits

* Eliminates unnecessary polling.
* Real-time user experience.
* Fewer database requests.

#### Tradeoffs

* Persistent connections consume server resources.
* More complex implementation compared to REST APIs.

---

### 3. Pagination

Load notifications in smaller chunks instead of retrieving all records.

#### Example

```http
GET /api/v1/notifications?page=1&limit=20
```

#### Benefits

* Reduced response size.
* Faster page loading.
* Lower database workload.

#### Tradeoffs

* Additional pagination logic required.
* Users may need multiple requests to view older notifications.

---

### 4. Fetch Only Required Fields

Instead of using:

```sql
SELECT * FROM notifications;
```

Use:

```sql
SELECT notificationId, title, isRead, createdAt
FROM notifications;
```

#### Benefits

* Reduced data transfer.
* Faster query execution.

#### Tradeoffs

* Additional query maintenance when fields change.

---

### 5. Database Indexing

Create indexes on frequently queried columns.

```sql
CREATE INDEX idx_notifications_user_read
ON notifications(studentID, isRead);
```

#### Benefits

* Faster lookups.
* Improved query performance.

#### Tradeoffs

* Additional storage consumption.
* Slower insert and update operations.

---

## Recommended Approach

For a production-scale notification system, the best solution is a combination of:

1. Redis caching
2. WebSocket-based real-time delivery
3. Pagination
4. Proper indexing

This approach minimizes database load while providing fast and scalable notification delivery.

## Conclusion

Fetching notifications on every page load is inefficient at scale. A combination of caching, real-time communication, pagination, and indexing significantly improves performance while maintaining a good user experience.


# Stage 5

## Problems with the Current Implementation

The proposed implementation processes all students sequentially.

```text
For each student:
1. Send email
2. Save notification in database
3. Push notification to application
```

This approach has several issues:

### 1. Poor Performance

For 50,000 students, processing one student at a time will take a long time and significantly delay notification delivery.

### 2. Single Point of Failure

If the email service fails after sending notifications to 20,000 students, the remaining students may never receive notifications.

### 3. No Retry Mechanism

Failed email deliveries are lost because there is no retry process.

### 4. Tight Coupling

Database storage, email delivery, and push notifications are executed together. Failure of one component affects the entire process.

---

## What Happens if Email Fails for 200 Students?

The system should not stop processing.

Failed email requests must be:

1. Logged.
2. Stored in a retry queue.
3. Retried automatically after a delay.
4. Monitored through alerting and reporting systems.

This ensures eventual delivery without affecting other users.

---

## Recommended Architecture

Instead of sending notifications directly, use an asynchronous event-driven architecture.

### Workflow

1. HR clicks "Notify All".
2. Backend creates notification records.
3. Notification jobs are published to a message queue.
4. Worker services consume jobs independently.
5. Email service sends emails.
6. Push service delivers in-app notifications.
7. Failed jobs are retried automatically.

### Components

```text
HR User
   |
   v
Notification API
   |
   v
Message Queue
   |
   +-----------> Email Worker
   |
   +-----------> Push Notification Worker
   |
   +-----------> Logging Service
```

---

## Should Database Save and Email Sending Happen Together?

No.

The notification should first be saved successfully in the database.

After successful storage, background workers should handle email and push notification delivery.

### Reason

If email sending fails but the notification is already stored:

* Notification is not lost.
* Retry mechanisms can resend the email.
* Users can still view notifications inside the application.

This increases reliability and fault tolerance.

---

## Revised Pseudocode

```pseudo
function notifyAll(studentIds, message):

    notificationId = saveNotification(message)

    for each studentId in studentIds:

        saveStudentNotification(studentId, notificationId)

        publishToQueue({
            studentId: studentId,
            notificationId: notificationId
        })


EmailWorker():

    while jobAvailable():

        try:
            sendEmail(job.studentId)
            markEmailDelivered(job.studentId)

        catch error:
            retryJob(job)


PushWorker():

    while jobAvailable():

        try:
            sendPushNotification(job.studentId)
            markPushDelivered(job.studentId)

        catch error:
            retryJob(job)
```

---

## Benefits of the New Design

1. Faster processing through parallel workers.
2. Improved scalability for large user bases.
3. Automatic retries for failed deliveries.
4. Better fault tolerance.
5. Independent scaling of email and push services.
6. Reduced load on the main application server.

## Conclusion

The original implementation is simple but not suitable for sending notifications to 50,000 users. An event-driven architecture using message queues, worker services, retries, and asynchronous processing provides better performance, scalability, and reliability.

# Stage 6

## Priority Inbox Design

The Priority Inbox displays the most important unread notifications first. Priority is calculated using both notification type and recency.

### Priority Rules

| Notification Type | Weight |
| ----------------- | ------ |
| Placement         | 3      |
| Result            | 2      |
| Event             | 1      |

Newer notifications receive higher priority when two notifications have the same weight.

### Implementation Approach

1. Fetch notifications from the protected Notification API.
2. Assign weights based on notification type.
3. Sort notifications by:

   * Higher weight first
   * More recent timestamp first
4. Return the top 10 notifications.

### Maintaining Top 10 Efficiently

Instead of sorting all notifications every time, a Min Heap (Priority Queue) of size 10 can be maintained. When a new notification arrives, its score is compared with the smallest element in the heap. This keeps the complexity low and avoids re-sorting the entire dataset.

### Time Complexity

* Fetch Notifications: O(n)
* Priority Calculation: O(n)
* Heap Maintenance: O(n log 10)
* Overall Complexity: O(n)

### Result

The implementation successfully retrieves notifications from the API and displays the top 10 priority notifications based on type and recency.





