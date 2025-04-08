import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import UserApi from "../../services/UserApi";
import style from "./ConnexionForm.module.css";

const validationSchema = yup.object({
    email: yup
        .string()
        .required("Veuillez entrer votre email")
        .email("Email invalide"),
    password: yup.string().required("Veuillez entrer votre mot de passe"),
});

const ConnexionForm = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });

    const [errorMessage, setErrorMessage] = useState(null);

    const { login } = useAuth();

    const onSubmit = async (data) => {
        setErrorMessage(null); // Réinitialisation des erreurs avant soumission

        try {
            const response = await UserApi.login({
                email: data.email,
                password: data.password,
            });
            login(response.token);
            navigate("/"); // Redirection après connexion
        } catch (error) {
            setErrorMessage(
                error.message || "Nom d'utilisateur ou mot de passe incorrect"
            );
        }
    };

    return (
        <div className={style.formContainer}>
            <h1 className={style.formTitle}>Connexion</h1>
            {errorMessage && (
                <p className={style.errorMessage}>{errorMessage}</p>
            )}
            <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
                <div className={style.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        className={style.formInput}
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="error-message">{errors.email.message}</p>
                    )}
                </div>
                <div className={style.formGroup}>
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        type="password"
                        id="password"
                        className={style.formInput}
                        {...register("password")}
                    />
                    {errors.password && (
                        <p className="error-message">
                            {errors.password.message}
                        </p>
                    )}
                </div>
                <button className={style.submitButton} type="submit">
                    Se connecter
                </button>
                <p>
                    Pas encore inscrit ?{" "}
                    <a href="/inscription">Créez un compte</a>
                </p>
            </form>
        </div>
    );
};

export default ConnexionForm;
