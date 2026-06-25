from fastapi import APIRouter

from schemas.embedding_schema import (
    EmbeddingRequest
)

from services.embedding_service import (
    generate_embedding
)

router = APIRouter(
    prefix="/api/embedding",
    tags=["Embedding"]
)

@router.post("/")
def create_embedding(
    payload: EmbeddingRequest
):
    embedding = generate_embedding(
        payload.query
    )

    return {
        "success": True,
        "embedding": embedding
    }