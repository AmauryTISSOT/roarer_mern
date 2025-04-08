import { useEffect, useState } from "react";
import { RetweetApi } from "../../services/RetweetApi";
import styles from "./Retweets.module.css"; // Import du CSS module

const Retweets = () => {
  const [retweets, setRetweets] = useState([]);

  useEffect(() => {
    const fetchRetweets = async () => {
      try {
        const response = await RetweetApi.getRetweet();
        console.log("Réponse API Retweets:", response); // Debugging

        if (Array.isArray(response)) {
          setRetweets(response);
        } else {
          console.error(
            "Les retweets ne sont pas sous forme de tableau:",
            response
          );
          setRetweets([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des retweets:", error);
      }
    };

    fetchRetweets();
  }, []);

  return (
    <div className={styles.container}>
      {retweets.length > 0 ? (
        <ul className={styles.list}>
          {retweets.map((retweet) => (
            <li key={retweet.id} className={styles.retweetCard}>
              <div className={styles.user}>
                <img
                  src={
                    "https://media.istockphoto.com/id/1223671392/fr/vectoriel/photo-de-profil-par-d%C3%A9faut-avatar-photo-placeholder-illustration-de-vecteur.jpg?s=612x612&w=0&k=20&c=iLDNfo8MGvF_Srti46vL4iyYbHB4bUK5iv6V7c4Pj80="
                  }
                  className={styles.avatar}
                />
                <span className={styles.userId}>@{retweet.user._id}</span>
              </div>

              {/* Affichage en fonction du type */}
              {retweet.type === "retweet" ? (
                <div className={styles.retweetContent}>
                  <p>🔁 Retweet</p>
                  <p className={styles.text}>
                    {retweet.originalTweet?.text || "Pas de contenu"}
                  </p>
                </div>
              ) : retweet.type === "quote" ? (
                <div className={styles.quoteContent}>
                  <p className={styles.text}>
                    {retweet.quoteContent || "Aucune citation"}
                  </p>
                  <div className={styles.originalTweet}>
                    <p>Tweet original :</p>
                    <p className={styles.text}>
                      {retweet.originalTweet?.text || "Pas de contenu"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className={styles.text}>Type inconnu</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noRetweets}>Aucun retweet trouvé.</p>
      )}
    </div>
  );
};

export default Retweets;
