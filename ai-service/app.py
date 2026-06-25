import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.embedding_routes import router as embedding_router

load_dotenv()

app = FastAPI(
    title="MOVIX AI Service",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("BACKEND_URL"),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    embedding_router,
    prefix="/api",
    tags=["Embedding"],
)


@app.get("/")
def health_check():
    return {
        "success": True,
        "message": "MOVIX AI Service is running",
    }