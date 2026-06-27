import ast
import pandas as pd

from pathlib import Path

from services.embedding_service import Embedding

BASE_DIR = Path(__file__).resolve().parent.parent.parent

input_path = (
    BASE_DIR
    / "data"
    / "tmdb"
    / "processed"
    / "movies_enriched.csv"
)

output_path = (
    BASE_DIR
    / "data"
    / "tmdb"
    / "processed"
    / "movies_final.csv"
)

df = pd.read_csv(input_path)

initial_count = len(df)

df = df[
    df["posterPath"].fillna("").str.strip().ne("")
    & df["backdropPath"].fillna("").str.strip().ne("")
].copy()

removed = initial_count - len(df)

print(f"Removed {removed} movies without poster/backdrop.")
print(f"Generating embeddings for {len(df)} movies...")

df["genres"] = df["genres"].apply(ast.literal_eval)
df["keywords"] = df["keywords"].apply(ast.literal_eval)
df["cast"] = df["cast"].apply(ast.literal_eval)

df["year"] = pd.to_datetime(
    df["releaseDate"],
    errors="coerce"
).dt.year

embed = Embedding()

embeddings = embed.generate_embeddings(
    df["search_content"]
      .fillna("")
      .astype(str)
      .tolist()
)

df["embedding"] = embeddings

df.drop(
    columns=["search_content"],
    inplace=True
)

output_path.parent.mkdir(
    parents=True,
    exist_ok=True
)

df.to_csv(
    output_path,
    index=False
)

print("\nEmbedding generation completed.")
print(f"Movies saved : {len(df)}")
print(f"Removed      : {removed}")
print(f"Output       : {output_path}")

print("\nSample Movie")
print("----------------------------")
print("TMDB ID :", df.iloc[0]["tmdbId"])
print("Title   :", df.iloc[0]["title"])
print("Year    :", df.iloc[0]["year"])
print("Embedding Dimension :", len(df.iloc[0]["embedding"]))