import { FaComment, FaHeart, FaAt } from "react-icons/fa";
import styles from "./OneNotification.module.css";

const NotificationIcon = ({ type }) => {
  switch (type) {
    case "message":
      return <FaComment />;
    case "like":
      return <FaHeart />;
    case "mention":
      return <FaAt />;
    default:
      return null;
  }
};

const OneNotification = ({ notification }) => {
  return (
    <li className={styles.notificationItem}>
      <div className={styles.notificationContent}>
        <NotificationIcon type={notification.type} />
        <p className={styles.notificationText}>{notification.text}</p>
        <span className={styles.timestamp}>{notification.timestamp}</span>
      </div>
    </li>
  );
};
export default OneNotification;
