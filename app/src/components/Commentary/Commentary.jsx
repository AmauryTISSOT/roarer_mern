import styles from "./Commentary.module.css";
import { FaRetweet } from "react-icons/fa";
import { IoChatbubbleOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import React from "react";
import formatDate from "../../utils/formatDate";

const Commentary = ({ username, profilePicture, text, timestamp }) => {
    return (
        <div className={styles.tweetContainer}>
            <div className={styles.tweetHeader}>
                <img
                    src={
                        !profilePicture ||
                        profilePicture === "default-avatar.png"
                            ? "https://www.tenforums.com/geek/gars/images/2/types/thumb_15951118880user.png"
                            : profilePicture
                    }
                    alt={`Avatar de ${username}`}
                    className={styles.avatar}
                />
                <div className={styles.userInfo}>
                    <div className={styles.userName}>{username}</div>
                    <div className={styles.userHandle}>@{username}</div>
                    <div className={styles.tweetTimestamp}>
                        {formatDate(timestamp)}
                    </div>
                </div>
            </div>
            <div className={styles.contentContainer}>
                <p className={styles.tweetText}>{text}</p>
                <div className={styles.tweetActions}>
                    <div className={styles.actionItem}>
                        <IoChatbubbleOutline />
                        <span className={styles.actionCount}></span>
                    </div>
                    <div className={styles.actionItem}>
                        <FaRetweet />
                        <span className={styles.actionCount}></span>
                    </div>
                    <div className={styles.actionItem}>
                        <FaRegHeart />
                        <span className={styles.actionCount}></span>
                    </div>
                    <div className={styles.actionItem}>
                        <CiBookmark />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Commentary;
