# Pour lancer le projet avec docker compose

`docker compose up --build -d`

# Pour lancer ce projet avec docker les dockerfiles

Depuis le répertoire `/app`
Effectuer la commande : `docker build -t mern-frontend .`

Depuis le répertoire `/back`
Effectuer la commande : `docker build -t mern-backend .`

Création du réseau : `docker network create mern-network`

Effectuer ensuite les commandes suivantes :

-   Création du container front : `docker run -d --name frontend --network mern-network -p8080:80 mern-frontend`
-   Création du container mongodb : `docker run -d --name mongodb --network mern-network -v mongodb_data:/data/db mongo:latest`
-   Création du container backend : `docker run -d --name backend --network mern-network mern-backend`

---

# Projet Hackathon : Application de Réseau Social avec Reconnaissance des Expressions Faciales

## Présentation du Projet

Ce projet a été réalisé dans le cadre d'un hackathon avec pour objectif de concevoir une application similaire à Twitter, permettant aux utilisateurs de publier des tweets, d'interagir avec les publications des autres, et d'intégrer une fonctionnalité d'analyse des expressions faciales en temps réel. L'application est conçue pour offrir une expérience utilisateur riche et interactive, tout en exploitant les capacités de l'intelligence artificielle pour détecter les émotions à partir des expressions faciales.

## Objectifs

-   Développer une application de réseau social complète avec des fonctionnalités de publication et d'interaction avec les tweets.
-   Intégrer une IA capable de reconnaître les expressions faciales en temps réel.
-   Offrir une interface utilisateur intuitive et ergonomique.
-   Assurer la performance et la scalabilité de l'application.

## Structure du Projet

Le projet est organisé en plusieurs dossiers principaux, chacun dédié à une partie spécifique de l'application :

### `app/`

Ce dossier contient le frontend de l'application, développé avec **React** et **Vite**. Il inclut tous les composants et pages nécessaires pour l'interface utilisateur, permettant aux utilisateurs d'interagir avec les fonctionnalités de l'application.

### `back/`

Ce dossier contient le backend de l'application, développé en **Node.js**. Il gère les requêtes serveur, la logique métier, et l'interaction avec la base de données.

### `models/`

Ce dossier regroupe les différents modèles utilisés dans l'application, notamment les modèles d'intelligence artificielle pour la reconnaissance des expressions faciales.

## Instructions pour Lancer l'Application

Pour lancer l'application en local, suivez les étapes ci-dessous :

1. **Frontend (`app/`)** :

    - Naviguez dans le dossier `app/`.
    - Installez les dépendances avec `npm install`.
    - Lancez l'application avec `npm run dev`.

2. **Backend (`back/`)** :

    - Naviguez dans le dossier `back/`.
    - Installez les dépendances avec `npm install`.
    - Lancez le serveur avec `npm start`.

3. **Modèles (`models/`)** :
    - Assurez-vous que les modèles d'IA sont correctement configurés et chargés dans l'application en suivant les instructions de chaque micro-service des modèles.

## Conclusion

Ce projet a été une opportunité d'explorer le développement d'une application de réseau social enrichie par l'intelligence artificielle. Nous espérons que vous apprécierez l'utilisation de l'application et ses fonctionnalités innovantes.
