import bookmarkApi from "../../services/BookMarkApi";
import styles from "./BookMarksPage.module.css";
import { useEffect, useState } from "react";
import Tweet from "../../components/Tweet/Tweet";

const BookmarksPage = () => {
    const [booksmarks, setBooksmarks] = useState([]);

    useEffect(() => {
        const fetchBooksMarks = async () => {
            try {
                const response = await bookmarkApi.getBookmarks();
                setBooksmarks(response.data);
            } catch (error) {
                console.error("Error fetching bookmarks:", error);
            }
        };
        fetchBooksMarks();
    }, []);

    const renderTweets = () => {
        return booksmarks.map(({ tweet }) => (
            <Tweet
                id={tweet._id}
                key={tweet.id}
                username={tweet.id_user._id}
                profilePicture={tweet.id_user.avatar}
                text={tweet.text}
                image={tweet.id_media_pictures}
                timestamp={tweet.created_at}
                metrics={tweet.metrics}
            />
        ));
    };

    return (
        <div className={styles.container}>
            <h1>Bookmarks</h1>
            {renderTweets()}
        </div>
    );
};

export default BookmarksPage;
