import style from "./MainContent.module.css";
import { useState, useEffect, useContext } from "react";
import { TweetApi } from "../../services/TweetApi.js"; // Import tweetApi

import Tweet from "../Tweet/Tweet.jsx";

import { WebcamContext } from "../../provider/WebcamProvider";

const MainContent = () => {
    const [tweets, setTweets] = useState([]); // State to store fetched tweets

    useEffect(() => {
        const fetchTweets = async () => {
            try {
                const response = await TweetApi.getFeed();
                setTweets(response.data.data);
                console.log("response", response.data.data);
            } catch (error) {
                console.error("Error fetching tweets:", error);
            }
        };
        fetchTweets();
    }, []);

    const { webcamRef } = useContext(WebcamContext);

    const renderTweets = () => {
        console.log("tweets", tweets);
        return tweets
            .filter((tweet) => tweet.id_user !== null) // Filter out tweets with null id_user
            .map((tweet) => (
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
        <div className={style.mainContent}>
            {tweets.length === 0 ? (
                <h2 className={style.noContent}>Chargement en cours...</h2>
            ) : (
                renderTweets()
            )}
        </div>
    );
};

export default MainContent;
