import styles from "./Tweet.module.css";
import { FaRetweet } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { IoChatbubbleOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { CiBookmarkCheck } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import formatDate from "../../utils/formatDate";
import { TweetApi } from "../../services/TweetApi";
import { useState } from "react";
import bookmarkApi from "../../services/BookMarkApi";

const Tweet = ({
    id,
    username,
    profilePicture,
    text,
    image,
    timestamp,
    disableShowComment,
    disableMetrics,
    metrics: initialMetrics,
}) => {
    const navigate = useNavigate();

    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [metrics, setMetrics] = useState(initialMetrics);

    const handleNavigateToTweetDetail = () => {
        if (!disableShowComment) {
            navigate(`detail/${id}`);
        }
    };

    const handleSaveBookmark = async (e) => {
        e.stopPropagation();
        try {
            setBookmarked(!bookmarked);
            await bookmarkApi.addBookmark(id);
        } catch (error) {
            console.error("Error adding bookmark:", error);
        }
    };

    const handleLike = async (e) => {
        e.stopPropagation();
        try {
            if (liked) {
                await TweetApi.unlikeTweet(id);
                setLiked(false);
                // Décrémenter le compteur de likes
                setMetrics((prevMetrics) => ({
                    ...prevMetrics,
                    likeCount: prevMetrics.likeCount - 1,
                }));
            } else {
                await TweetApi.likeTweet(id);
                setLiked(true);
                // Incrémenter le compteur de likes
                setMetrics((prevMetrics) => ({
                    ...prevMetrics,
                    likeCount: prevMetrics.likeCount + 1,
                }));
            }
        } catch (error) {
            console.error("Error adding like:", error);
        }
    };

    return (
        <div className={styles.tweetContainer} id={id}>
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
                {/* <img
                    src="public/images/title_logo.png"
                    alt="logo"
                    className={styles.logo}
                /> */}
            </div>
            <div
                className={styles.contentContainer}
                style={{ cursor: disableShowComment ? "default" : "pointer" }}
                onClick={handleNavigateToTweetDetail}
            >
                <p className={styles.tweetText}>{text}</p>
                {image.length > 0 && (
                    <img
                        src={image}
                        alt="tweet"
                        className={styles.tweetImage}
                    />
                )}
            </div>
            <div className={styles.tweetActions}>
                <div className={styles.actionItem}>
                    <IoChatbubbleOutline />
                    <span className={styles.actionCount}>
                        {!disableMetrics && metrics.commentCount}
                    </span>
                </div>
                <div className={styles.actionItem}>
                    <FaRetweet />
                    <span className={styles.actionCount}>
                        {!disableMetrics && metrics.retweetCount}
                    </span>
                </div>

                <div className={styles.actionItem} onClick={handleLike}>
                    {liked ? (
                        <FaHeart color="red" />
                    ) : (
                        <FaRegHeart color="red" />
                    )}
                    <span className={styles.actionCount}>
                        {!disableMetrics && metrics.likeCount}
                    </span>
                </div>
                <div className={styles.actionItem} onClick={handleSaveBookmark}>
                    {bookmarked ? <CiBookmarkCheck /> : <CiBookmark />}
                </div>
            </div>
        </div>
    );
};

export default Tweet;
