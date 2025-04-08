import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Bouton from "../Bouton/Bouton_nav/Bouton";
import style from "./Footer.module.css";
import { Link } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleClick = () => {
        if (user) {
            logout();
        } else {
            navigate(`/inscription`);
        }
    };

    return (
        <footer className={style.footer}>
            <div className={style.section}>
                <h3>Suggestions</h3>
                <ul>
                    <li>Compte 1</li>
                    <li>Compte 2</li>
                    <li>Compte 3</li>
                </ul>
            </div>
            <div className={style.section}>
                <h3>Tendances</h3>
                <ul>
                    <li>#Sujet 1</li>
                    <li>#Sujet 2</li>
                    <li>#Sujet 3</li>
                </ul>
            </div>
            <div className={style.boutonLogoutContainer}>
                <Bouton
                    label={
                        user
                            ? "Se déconnecter"
                            : "Inscrivez-vous pour pouvoir Roarer !"
                    }
                    onClick={handleClick}
                />
            </div>
        </footer>
    );
};

export default Footer;
