import React from "react";
import styles from "./ProfileHeader.module.css";
import Bouton from "../Bouton/Bouton_nav/Bouton";

const ProfileHeader = ({ profile }) => {
  if (!profile) {
    return <p>Chargement...</p>;
  }

  return (
    <header className={styles.header}>
      {/* Bannière de profil */}
      <img
        className={styles.banner}
        src={
          profile.banner ||
          "https://www.guardianoffshore.com.au/wp-content/uploads/2015/03/banner-placeholder.jpg"
        } // Valeur par défaut si pas de bannière
        alt="banner"
      />

      {/* Photo de profil */}
      <img
        className={styles.profilePicture}
        src={
          profile.profilePicture ||
          "https://media.istockphoto.com/id/1223671392/fr/vectoriel/photo-de-profil-par-d%C3%A9faut-avatar-photo-placeholder-illustration-de-vecteur.jpg?s=612x612&w=0&k=20&c=iLDNfo8MGvF_Srti46vL4iyYbHB4bUK5iv6V7c4Pj80="
        } // Valeur par défaut si pas de photo de profil
        alt="profile picture"
      />

      {/* Bouton de suivi */}
      <Bouton className={styles.followButton}>Follow</Bouton>

      <div className={styles.profileInfo}>
        {/* Nom de l'utilisateur */}
        <h2>{profile.name}</h2>

        {/* Nom d'utilisateur */}
        <span className={styles.name}>@{profile.username}</span>

        {/* Bio */}
        <p className={styles.bioContainer}>
          {profile.bio || "Pas de bio disponible"}
        </p>

        {/* Date d'inscription */}
        <div className={styles.joinedContainer}>
          <p>Joined</p>
          <span>{profile.joined || "Non renseigné"}</span>
        </div>

        {/* Informations de suivi */}
        <div className={styles.followInfo}>
          <div className={styles.followContainer}>
            <b>{profile.following || 0}</b>
            <p>Following</p>
          </div>
          <div className={styles.followContainer}>
            <b>{profile.followers || 0}</b>
            <p>Followers</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
