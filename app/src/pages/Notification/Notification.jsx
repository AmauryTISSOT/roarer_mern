import React, { useState } from "react";
import styles from "./Notification.module.css";
import OneNotification from "../../components/OneNotification/OneNotification.jsx";
import mockData from "../../services/mockData.js";

const Notifications = () => {
  const [notifications, setNotifications] = useState(
    mockData.mockNotifications
  );

  return (
    <div className={styles.notificationsContainer}>
      <h1 className={styles.title}>Notifications</h1>
      <ul className={styles.notificationList}>
        {notifications.map((notification) => (
          <OneNotification key={notification.id} notification={notification} />
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
