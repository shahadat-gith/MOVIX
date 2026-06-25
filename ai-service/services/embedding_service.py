import os

from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

print("Embedding service imported")

load_dotenv()

_model = None


def get_model():
    global _model

    if _model is None:
        print("Loading SentenceTransformer model...")

        _model = SentenceTransformer(
            "all-MiniLM-L6-v2",
            token=os.getenv("HF_TOKEN"),
        )

        print("SentenceTransformer loaded successfully.")

    return _model


def generate_embedding(text: str):
    print("Generating embedding...")

    model = get_model()

    embedding = model.encode(
        text,
        normalize_embeddings=True,
    ).tolist()

    print("Embedding generated.")

    return embedding