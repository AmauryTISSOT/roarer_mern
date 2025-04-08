import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import UserApi from "../../services/UserApi.js";
import BarreRecherche from "../../components/BarreRecherche/BarreRecherche.jsx";
import { TweetApi } from "../../services/TweetApi.js";
import style from "./Recherche.module.css";
import Tweet from "../../components/Tweet/Tweet.jsx";
import PreviewProfile from "../../components/PreviewProfile/PreviewProfile.jsx";

export default function Recherche() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState({ tweets: [], users: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (searchQuery.length < 2) {
            setResults({ tweets: [], users: [] });
            setError(null);
            return;
        }

        const fetchTweetsAndUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const responseTweet = await TweetApi.searchTweets(searchQuery);
                const responseUser = await UserApi.searchUsers(user);
                console.log("Réponse tweet :", responseTweet.data);
                console.log("Réponse user :", responseUser.data);

                // Trier les utilisateurs et les filtrer en fonction de la searchQuery
                const filteredUsers = responseUser.data.filter(
                    (user) =>
                        user.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                        user.email
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                );

                setResults({
                    tweets: responseTweet.data.data || [],
                    users: filteredUsers,
                });
            } catch (error) {
                setError(
                    "Erreur lors de l'exécution de la recherche. Veuillez réessayer."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTweetsAndUsers();
    }, [searchQuery]);

    return (
        <div className={style.container}>
            <h1 className={style.title}>Recherche</h1>
            <BarreRecherche onSearch={setSearchQuery} />
            {loading && <p className={style.loading}>Chargement...</p>}
            {error && <p className={style.error}>{error}</p>}

            {/* Affichage des utilisateurs */}
            {results.users.length > 0 && (
                <>
                    <h2 className={style.sectionTitle}>Utilisateurs</h2>
                    <div className={style.sectionUser}>
                        <ul className={style.listUser}>
                            {results.users.map((user) => (
                                <li key={user._id} className={style.item}>
                                    <PreviewProfile user={user} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}

            {/* Affichage des tweets */}
            {results.tweets.length > 0 && (
                <div className={style.section}>
                    <h2 className={style.sectionTitle}>Tweets</h2>
                    <ul className={style.list}>
                        {results.tweets.map((tweet) => (
                            <li key={tweet.id} className={style.item}>
                                <Tweet
                                    id={tweet.id}
                                    username={tweet.username}
                                    profilePicture={tweet.profilePicture}
                                    text={tweet.text}
                                    disableMetrics={true}
                                    image={tweet.id_media_pictures}
                                    timestamp={tweet.timestamp}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Si aucun résultat trouvé */}
            {results.users.length === 0 &&
                results.tweets.length === 0 &&
                searchQuery.length > 1 && (
                    <p className={style.noResults}>Aucun résultat</p>
                )}
        </div>
    );
}
