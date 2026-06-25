import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

print("Loading environment...")

load_dotenv()

print("Importing routes...")

from routes.embedding_routes import router as embedding_router

print("Creating FastAPI app...")

app = FastAPI(
    title="MOVIX AI Service",
    version="1.0.0",
)

origins = [
    "http://localhost:5000",
    os.getenv("BACKEND_URL"),
]

origins = [origin for origin in origins if origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Registering routes...")

app.include_router(
    embedding_router,
    prefix="/api",
    tags=["Embedding"],
)

print("App started successfully.")


@app.get("/")
def health_check():
    return {
        "success": True,
        "message": "MOVIX AI Service is running",
    }