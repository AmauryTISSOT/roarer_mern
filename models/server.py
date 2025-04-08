import time
from threading import Thread
import base64
from io import BytesIO
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware 
from transformers import pipeline
from pydantic import BaseModel
from typing import Optional
from PIL import Image
import matplotlib.pyplot as plt
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZDE2NGVkMzZmZWU1YjA0NzhiYWRlMyIsImlhdCI6MTc0MTg4MTQ2NSwiZXhwIjoxNzQxODg1MDY1fQ.QnlT6iOYQOimtMBOz_8_e_BgpEWlT4n_y9EOVeqxw60"

emotion_pipeline = pipeline("image-classification", model="dima806/facial_emotions_image_detection")

class ImageData(BaseModel):
    image: Optional[str] = None 
    postId: Optional[str] = None
    userId: Optional[str] = None

reactions_cache = {}

def decode_image(base64_string: str) -> Image:
    try:
        if base64_string.startswith('data:image'):
            base64_string = base64_string.split(',')[1]

        image_data = base64.b64decode(base64_string)

        image = Image.open(BytesIO(image_data))

        # plt.imshow(image)
        # plt.axis('off')  # Supprime les axes pour l'affichage propre
        # plt.show()

        return image
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erreur lors du décodage de l'image: {str(e)}")


@app.post("/analyze")
async def analyze_image(data: ImageData):
    if not data.image:
        raise HTTPException(status_code=400, detail="Aucune image fournie")

    try:
        image = decode_image(data.image)  
        predictions = emotion_pipeline(image)

        label = predictions[0]['label']
        score = predictions[0]['score']

        # print(label, score)

        if score < 0.6 or label == "neutral":
            return
        
        user_post_key = f"{data.userId}_{data.postId}"

        if user_post_key in reactions_cache:
            if score <= reactions_cache[user_post_key]["score"]:
                return 
        
        reactions_cache[user_post_key] = {
                "label": label, 
                "score": score, 
                "timestamp": time.time(),
                "user": 1,
                # "user": data.userId,
                "post": data.postId
            }

        return {"message": "Réaction enregistrée", "label": label, "score": score}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur du serveur: {str(e)}")

def cleanup_and_store():
    while True:
        print(reactions_cache)
        time.sleep(60)  
        now = time.time()

        to_store = {key: data for key, data in reactions_cache.items() if now - data["timestamp"] <= 300}
        reactions_cache.clear()  
        reactions_cache.update(to_store) 

        print(reactions_cache)

        response = requests.post(
            'http://localhost:5001/api/reactions/bulk',  
            json=reactions_cache, 
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {token}'
                },
            
        )
        
        # Vérifier la réponse de l'API
        if response.status_code == 201:
            print(f"Réactions insérées avec succès: {response.json()}")
        else:
            print(f"Erreur lors de l'insertion: {response.status_code} - {response.text}")
        

Thread(target=cleanup_and_store, daemon=True).start()