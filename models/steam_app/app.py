import cv2
import streamlit as st
import numpy as np
from transformers import pipeline
from PIL import Image
import time
import json
from datetime import datetime
import base64

# Vérifier le paramètre de requête avant toute configuration d'affichage
if st.query_params.get("get_camera_frame") is not None:
    cap = cv2.VideoCapture(0)
    ret, frame = cap.read()
    cap.release()
    if ret:
        frame = cv2.flip(frame, 1)
        pipe = pipeline("image-classification", model="dima806/facial_emotions_image_detection")
        emotion_colors = {
            "happy": (0, 255, 0),
            "anger": (0, 0, 255),
            "surprise": (255, 0, 0),
            "sad": (169, 169, 169),
            "fear": (0, 255, 255),
            "disgust": (148, 0, 211),
        }
        def predict_emotion(frame):
            image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            result = pipe(image)
            return result[0]
        prediction = predict_emotion(frame)
        label = prediction['label']
        score = prediction['score'] * 100
        color = emotion_colors.get(label, (255, 255, 255))
        height, width, _ = frame.shape
        cv2.putText(frame, f"{label} ({score:.2f}%)", (10, height - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)
        ret2, buffer = cv2.imencode('.jpg', frame)
        frame_encoded = base64.b64encode(buffer).decode("utf-8")
        st.json({"frame": frame_encoded, "emotion": label, "timestamp": datetime.now().isoformat()})
    st.stop()

# st.set_page_config(page_title="Camera Only", layout="wide", initial_sidebar_state="collapsed")

pipe = pipeline("image-classification", model="dima806/facial_emotions_image_detection")
emotion_colors = {
    "happy": (0, 255, 0),
    "anger": (0, 0, 255),
    "surprise": (255, 0, 0),
    "sad": (169, 169, 169),
    "fear": (0, 255, 255),
    "disgust": (148, 0, 211),
}

def predict_emotion(frame):
    image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    result = pipe(image)
    return result[0]

if "run" not in st.session_state:
    st.session_state.run = False
if "results" not in st.session_state:
    st.session_state.results = []

col1, col2 = st.columns(2)
with col1:
    if st.button("Démarrer"):
        st.session_state.run = True
with col2:
    if st.button("Arrêter"):
        st.session_state.run = False

frame_placeholder = st.empty()
cap = cv2.VideoCapture(0)

while st.session_state.run and cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        st.error("Erreur lors de la capture vidéo")
        break
    frame = cv2.flip(frame, 1)
    prediction = predict_emotion(frame)
    label = prediction['label']
    score = prediction['score'] * 100
    color = emotion_colors.get(label, (255, 255, 255))
    height, width, _ = frame.shape
    cv2.putText(frame, f"{label} ({score:.2f}%)", (10, height - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)
    frame_placeholder.image(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    timestamp = datetime.now().isoformat()
    st.session_state.results.append({"timestamp": timestamp, "emotion": label})
    time.sleep(0.03)

cap.release()

with open("emotions.json", "w") as f:
    json.dump(st.session_state.results, f)
