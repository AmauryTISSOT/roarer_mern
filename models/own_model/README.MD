# HACKATHON MIA 2025 - Groupe 20

## MODEL CNN :: Détection des émotions faciales humaines

### Projet
Ce projet se concentre sur la détection des émotions à partir d'images faciales à l'aide d'un réseau neuronal convolutif (CNN).

### Objectif
Développer un modèle d'apprentissage profond robuste, capable de classer avec précision les émotions faciales.

## Installation des bibliothèques nécessaires
```bash
pip install -r requirements.txt
```

## Comment démarrer MLflow

### Option 1 : Via Docker
1. Assurez-vous d'avoir Docker installé.
2. Placez-vous dans le répertoire du projet et exécutez :
   ```bash
   docker-compose up
   ```
3. MLflow sera accessible sur `http://localhost:5000`.

#### Fichier `docker-compose.yml`
```yaml
version: "3.8"
services:
  mlflow:
    build: .
    container_name: mlflow_server
    volumes:
      - ./emotion.db:/app/emotion.db
      - ./mlruns:/app/mlruns
    ports:
      - "5000:5000"
```

### Option 2 : Via un environnement virtuel (classique)
1. Créez et activez un environnement virtuel :
   ```bash
   python -m venv venv
   source venv/bin/activate  # Sur macOS/Linux
   venv\Scripts\activate  # Sur Windows
   ```
2. Installez les dépendances :
   ```bash
   pip install -r requirements.txt
   ```
3. Démarrez MLflow avec la base de données SQLite `emotion.db` :
   ```bash
   mlflow ui --backend-store-uri sqlite:///emotion.db
   ```
4. Accédez à MLflow via `http://localhost:5000`.


##  Exploration des données  
Le dataset est organisé en plusieurs classes représentant différentes émotions. Une analyse initiale permet de visualiser la répartition des données et quelques échantillons d’images.  

Exemple de visualisation de la distribution des classes :  
```python
plt.figure(figsize=(10,5))
sns.barplot(x=list(class_counts.keys()), y=list(class_counts.values()), palette="viridis")
plt.xlabel("Catégories d'émotions")
plt.ylabel("Nombre d'images")
plt.title("Distribution des classes dans le dataset")
plt.xticks(rotation=45)
plt.show()
```

---

## Modèle CNN  
Le modèle est construit avec plusieurs couches convolutives, des couches de normalisation et de régularisation, et une sortie softmax pour classer les émotions.  

```python
model = tf.keras.Sequential([
    tf.keras.layers.Conv2D(32, (3,3), activation='relu', input_shape=(48,48,1)),
    tf.keras.layers.MaxPooling2D(2,2),
    ...
    tf.keras.layers.Dense(7, activation='softmax')  
])
```

Le modèle est compilé avec l'optimiseur **Adam** et une fonction de perte **categorical_crossentropy**.

---

## Entraînement du modèle  
```python
history = model.fit(
    ds_train,
    validation_data=ds_val,
    epochs=50,
    callbacks=[early_stopping, model_checkpoint, reduce_lr, MLflowCallback(), LearningRateCallback()]
)
```
Des callbacks sont utilisés pour :  
- Arrêter l'entraînement en cas de sur-apprentissage (early stopping).  
- Sauvegarder le meilleur modèle.
- Réduire le taux d’apprentissage si nécessaire.  

---

## Suivi avec MLflow  
MLflow est utilisé pour suivre les performances du modèle.  

### Configuration de MLflow  
```python
import mlflow
mlflow_tracking = "sqlite:///emotion.db"
mlflow.set_tracking_uri(mlflow_tracking)
mlflow.set_experiment("emotion_detector")
```

### Suivi des métriques  
Les métriques sont enregistrées après chaque epoch :  
```python
mlflow.log_metric("accuracy", logs.get("accuracy", 0), step=epoch)
mlflow.log_metric("val_loss", logs.get("val_loss", 0), step=epoch)
```

---

## Test du modèle  
Une fois entraîné, le modèle peut être évalué sur les données de test :  
```python
test_loss, test_acc = model.evaluate(ds_test)
print(f"Test Accuracy: {test_acc:.2%}")
```

---


