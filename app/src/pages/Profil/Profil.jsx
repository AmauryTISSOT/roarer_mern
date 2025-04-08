import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import UserApi from "../../services/UserApi.js";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader.jsx";
import style from "./Profil.module.css";
import Tweet from "../../components/Tweet/Tweet.jsx";
import { TweetApi } from "../../services/TweetApi.js";
import Retweets from "../../components/Retweets/Retweets.jsx";

const Profil = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [tweets, setTweets] = useState([]); // Tweets normaux
    const [retweets, setRetweets] = useState([]); // Retweets
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingTweets, setLoadingTweets] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("tweets"); // Onglet actif : "tweets" ou "retweets"

    // Récupérer le profil de l'utilisateur
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) {
                setError("Utilisateur non trouvé");
                setLoadingProfile(false);
                return;
            }
            try {
                const profileData = await UserApi.getProfile(user);
                setProfile(profileData);
                console.log("Profil chargé:", profileData);
            } catch (error) {
                setError("Erreur lors de la récupération du profil");
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchProfile();
    }, [user]);

    // Récupérer les tweets et retweets de l'utilisateur
    useEffect(() => {
        const fetchTweets = async () => {
            if (!profile) return;

            try {
                const feedData = await TweetApi.getFeed();
                console.log(
                    "Données des tweets récupérées:",
                    feedData.data.data
                );

                const userTweets = feedData.data.data.filter(
                    (tweet) =>
                        tweet.id_user !== null &&
                        tweet.id_user._id === profile._id // Tweets normaux
                );

                const userRetweets = feedData.data.data.filter(
                    (tweet) =>
                        tweet.retweets && tweet.retweets.includes(profile._id) // Filtrer les retweets
                );

                setTweets(userTweets);
                setRetweets(userRetweets);
            } catch (error) {
                setError("Erreur lors de la récupération des tweets");
            } finally {
                setLoadingTweets(false);
            }
        };

        fetchTweets();
    }, [profile]);

    if (loadingProfile || loadingTweets) {
        return <p>Chargement...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!profile) {
        return <p>Aucun profil trouvé.</p>;
    }

    return (
        <div className={style.profilContainer}>
            <ProfileHeader profile={profile} />

            {/* Onglets Tweets / Retweets */}
            <div className={style.tabsContainer}>
                <button
                    className={activeTab === "tweets" ? style.activeTab : ""}
                    onClick={() => setActiveTab("tweets")}
                >
                    Tweets
                </button>
                <button
                    className={activeTab === "retweets" ? style.activeTab : ""}
                    onClick={() => setActiveTab("retweets")}
                >
                    Retweets
                </button>
            </div>

            {/* Affichage des tweets ou retweets selon l'onglet actif */}
            <div>
                {activeTab === "tweets" ? (
                    <>
                        <h2>Tweets de {profile.name}</h2>
                        {tweets.length === 0 ? (
                            <p>Aucun tweet à afficher</p>
                        ) : (
                            tweets.map((tweet) => (
                                <Tweet
                                    key={tweet._id}
                                    id={tweet._id}
                                    username={profile.name}
                                    profilePicture={
                                        tweet.id_user.avatar ||
                                        "default-avatar.png"
                                    }
                                    text={tweet.text}
                                    image={
                                        tweet.id_media_pictures.length > 0
                                            ? tweet.id_media_pictures[0]
                                            : ""
                                    }
                                    timestamp={tweet.created_at}
                                    metrics={tweet.metrics}
                                    disableShowComment={false}
                                />
                            ))
                        )}
                    </>
                ) : (
                    <>
                        <h2>Retweets de {profile.name}</h2>
                        <Retweets />
                    </>
                )}
            </div>
        </div>
    );
};

export default Profil;
