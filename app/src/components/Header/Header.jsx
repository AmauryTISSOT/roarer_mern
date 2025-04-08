import styles from "./Header.module.css";
import Bouton from "../Bouton/Bouton_nav/Bouton.jsx";
import { BsHouse, BsEmojiSmile } from "react-icons/bs";
import {
    CiFlag1,
    CiUser,
    CiSearch,
    CiPen,
    CiImageOn,
    CiBookmark,
} from "react-icons/ci";

import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const handleProfile = () => {
        navigate(`/profile`);
    };

    const handleAddTweet = () => {
        navigate(`/create`);
    };
    const handleSearch = () => {
        navigate(`/search`);
    };
    const handleHome = () => {
        navigate(`/`);
    };
    const handleNotification = () => {
        navigate(`/notification`);
    };
    const handleBooksMarks = () => {
        navigate(`/bookmarks`);
    };

    return (
        <>
            <header className={styles.header}>
                <div className={styles.topSection}>
                    <div className={styles.logo}>
                        <img src="/images/logo.png" alt="Logo" />
                    </div>
                    <div className={styles.boutonContainer}>
                        <Bouton
                            label="Accueil"
                            onClick={handleHome}
                            className={styles.boutonRond}
                        >
                            <BsHouse size={20} color="#b2aaee" />
                        </Bouton>
                        <Bouton
                            label="Notification"
                            onClick={handleNotification}
                            className={styles.boutonRond}
                        >
                            <CiFlag1 size={20} color="#b2aaee" />
                        </Bouton>
                        <Bouton
                            label="Profil"
                            onClick={handleProfile}
                            className={styles.boutonRond}
                        >
                            <CiUser size={20} color="#b2aaee" />
                        </Bouton>
                        <Bouton
                            label="Recherche"
                            onClick={handleSearch}
                            className={styles.boutonRond}
                        >
                            <CiSearch size={20} color="#b2aaee" />
                        </Bouton>
                        <Bouton
                            label="Booksmarks"
                            onClick={handleBooksMarks}
                            className={styles.boutonRond}
                        >
                            <CiBookmark size={20} color="#b2aaee" />
                        </Bouton>
                        <Bouton
                            label="Roarer"
                            onClick={handleAddTweet}
                            className={styles.boutonRond}
                        >
                            <CiPen size={20} color="#b2aaee" />
                        </Bouton>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
