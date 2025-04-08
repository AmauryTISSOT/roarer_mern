from fastapi import FastAPI, HTTPException
import mlflow
from mlflow.tracking import MlflowClient
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, JSONResponse
import os

tracking_uri = "sqlite:///../own_model/emotion.db"
mlflow.set_tracking_uri(tracking_uri)
client = MlflowClient()

app = FastAPI(
    title="API MLflow Client pour Emotion Detector",
    version="0.1",
    docs_url="/docs",
    redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,  
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")

#get all experiences
@app.get("/experiences", tags=["Mlflow"])
async def get_current_time():
    experiments = client.search_experiments()
    response = []
    for experiment in experiments:
        experiment_info = {
            "experiment_id": experiment.experiment_id,
            "name": experiment.name,
            "artifact_location": experiment.artifact_location,
        }
        response.append(experiment_info)

    return JSONResponse(content=response)

#get all models with versions
@app.get("/models", tags=["Mlflow"])
async def get_models():
    try:
        registered_models = client.search_registered_models()
        response = []
        for model in registered_models:
            model_info = {
                "name": model.name,
                "versions": []
            }
            for version in model.latest_versions:
                version_info = {
                    "version": version.version,
                    "run_id": version.run_id,
                    "current_stage": version.current_stage,
                    "artifact_uri": version.source
                }
                model_info["versions"].append(version_info)
            response.append(model_info)
        return JSONResponse(content=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#get models staging in production with artifact uri
@app.get("/production", tags=["Mlflow"])
def get_production_models():
    production_models = []
    for model in client.search_registered_models():
        for version in model.latest_versions:
            if version.current_stage == "Production":
                production_models.append({
                    "model_name": model.name,
                    "version": version.version,
                    "stage": version.current_stage,
                    "run_id": version.run_id,
                    "artifact_uri": version.source
                })
    return production_models