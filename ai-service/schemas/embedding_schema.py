from pydantic import BaseModel


class EmbeddingRequest(BaseModel):
    query: str