import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Tweet from "../Tweet/Tweet";
import Commentary from "../Commentary/Commentary";
import { TweetApi } from "../../services/TweetApi";
import AddCommentary from "../AddCommentary/AddCommentary";

const TweetDetail = () => {
    const [tweet, setTweet] = useState({});
    const [comments, setComments] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        fetchTweet();
    }, [id]);

    const fetchTweet = async () => {
        try {
            const response = await TweetApi.getTweet(id);
            console.log("data", response.data.data);
            setTweet(response.data.data);
            setComments(response.data.data.comments);
        } catch (error) {
            console.error("Error fetching tweet:", error);
        }
    };

    const handleCommentSubmit = async () => {
        await fetchTweet();
    };

    const renderTweets = () => {
        console.log(tweet);
        return (
            <Tweet
                id={tweet.id}
                key={tweet.id}
                username={tweet.id_user._id}
                profilePicture={tweet.id_user.avatar}
                text={tweet.text}
                image={tweet.id_media_pictures}
                timestamp={tweet.created_at}
                disableShowComment={true}
                metrics={tweet.metrics}
            />
        );
    };

    const showAllComments = () => {
        return comments.map((comment) => (
            <Commentary
                key={comment._id}
                username={comment.author._id}
                profilePicture={comment.author.avatar}
                text={comment.content}
                timestamp={comment.createdAt}
            />
        ));
    };

    return (
        <>
            {Object.keys(tweet).length > 0 ? (
                renderTweets()
            ) : (
                <h2>"Loading..."</h2>
            )}
            <AddCommentary tweetId={id} onCommentSubmit={handleCommentSubmit} />
            {comments && showAllComments()}
        </>
    );
};

export default TweetDetail;
