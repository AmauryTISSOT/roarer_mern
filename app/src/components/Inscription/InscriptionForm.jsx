import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import UserApi from "../../services/UserApi";
import style from "./InscriptionForm.module.css";

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Le nom d'utilisateur est requis")
        .min(3, "Le nom d'utilisateur doit avoir au moins 3 caractères")
        .max(20, "Le nom d'utilisateur ne peut pas dépasser 20 caractères"),
    email: yup
        .string()
        .required("L'email est requis")
        .email("Veuillez entrer un email valide"),
    password: yup
        .string()
        .required("Le mot de passe est requis")
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .matches(
            /[A-Z]/,
            "Le mot de passe doit contenir au moins une majuscule"
        )
        .matches(
            /[a-z]/,
            "Le mot de passe doit contenir au moins une minuscule"
        )
        .matches(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
        .matches(
            /[\W_]/,
            "Le mot de passe doit contenir au moins un caractère spécial"
        ),
    bio: yup.string().max(160, "La bio ne doit pas dépasser 160 caractères"),
    created_at: yup.date().default(() => new Date()),
});

const InscriptionForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(null);

    const onSubmit = async (data) => {
        setErrorMessage(null); // Reset des erreurs avant soumission

        try {
            await UserApi.register({
                name: data.name,
                email: data.email,
                password: data.password,
            });

            navigate("/connexion"); // Redirection vers la page de connexion
        } catch (error) {
            setErrorMessage(error.message || "Une erreur est survenue");
            console.error(error);
        }
    };

    return (
        <div className={style.formContainer}>
            <h1 className={style.formTitle}>Inscription</h1>
            {errorMessage && (
                <p className={style.errorMessage}>{errorMessage}</p>
            )}
            <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
                <div className={style.formGroup}>
                    <label htmlFor="name">Nom d'utilisateur</label>
                    <input
                        type="text"
                        id="name"
                        className={style.formInput}
                        {...register("name")}
                    />
                    {errors.name && <p>{errors.name.message}</p>}
                </div>
                <div className={style.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        className={style.formInput}
                        {...register("email")}
                    />
                    {errors.email && <p>{errors.email.message}</p>}
                </div>
                <div className={style.formGroup}>
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        type="password"
                        id="password"
                        className={style.formInput}
                        {...register("password")}
                    />
                    {errors.password && <p>{errors.password.message}</p>}
                </div>
                <div className={style.formGroup}>
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        className={style.formInput}
                        {...register("bio")}
                    />
                    {errors.bio && <p>{errors.bio.message}</p>}
                </div>
                <div style={{ display: "none" }}>
                    <input
                        type="text"
                        {...register("created_at")}
                        defaultValue={new Date()}
                    />
                </div>
                <button className={style.submitButton} type="submit">
                    C'est parti !
                </button>
                <p>
                    Vous avez déjà un compte?{" "}
                    <a href="/connexion">Connectez-vous</a>
                </p>
            </form>
        </div>
    );
};

export default InscriptionForm;
