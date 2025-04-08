# MLflow Client - Emotion Detector

## Description
Ce projet est un client FastAPI permettant d'interagir avec un serveur MLflow pour gérer les expériences et les modèles de détection d'émotions faciales.

## Prérequis
- Python 3.x
- Docker (optionnel)

## Installation et Exécution

### 1. Démarrer via Docker
```sh
docker-compose up
```
L'API sera disponible sur http://localhost:8000/docs

### 2. Démarrer manuellement (sans Docker)

# Activer l'environnement virtuel (optionnel)
python -m venv venv
source venv/bin/activate  # Sur Windows : venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Lancer le serveur FastAPI
```sh
python run.py
```
L'API sera disponible sur http://127.0.0.1:8000/docs
