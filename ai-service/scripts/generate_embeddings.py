import ast
import pandas as pd

from pathlib import Path
from sentence_transformers import SentenceTransformer

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_NAME = "all-MiniLM-L6-v2"

print("Loading embedding model...")
model = SentenceTransformer(MODEL_NAME)

# Load processed dataset
df = pd.read_csv(
    BASE_DIR / "data/processed/movies_processed.csv"
)

# Convert stringified lists back to arrays
df["genres"] = df["genres"].apply(ast.literal_eval)
df["keywords"] = df["keywords"].apply(ast.literal_eval)
df["cast"] = df["cast"].apply(ast.literal_eval)

# Extract release year
df["year"] = pd.to_datetime(
    df["releaseDate"],
    errors="coerce"
).dt.year

print(f"Generating embeddings for {len(df)} movies...")

embeddings = model.encode(
    df["search_content"].astype(str).tolist(),
    batch_size=32,
    show_progress_bar=True,
    convert_to_numpy=True
)

df["embedding"] = embeddings.tolist()

# Remove search_content before storing
# (keep it if you want debugging/search analysis)
df = df.drop(columns=["search_content"])

output_path = (
    BASE_DIR /
    "data/embeddings/movies_embeddings.json"
)

output_path.parent.mkdir(
    parents=True,
    exist_ok=True
)

records = df.to_dict(orient="records")

import json

with open(
    output_path,
    "w",
    encoding="utf-8"
) as f:
    json.dump(
        records,
        f,
        ensure_ascii=False
    )

print(f"\nSaved {len(records)} movies")
print(f"Output: {output_path}")

# Verification
print("\nSample document:")
print({
    "tmdbId": records[0]["tmdbId"],
    "title": records[0]["title"],
    "genres": records[0]["genres"],
    "year": records[0]["year"],
    "embedding_dim": len(records[0]["embedding"])
})