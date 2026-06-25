from fastapi import FastAPI

from routes.embedding_routes import (
    router as embedding_router
)

app = FastAPI(
    title="MOVIX AI Service"
)

app.include_router(
    embedding_router
)

@app.get("/")
def health_check():
    return {
        "success": True,
        "message":"AI Service is working..."
    }