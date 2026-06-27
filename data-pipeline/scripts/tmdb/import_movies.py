import ast
import os

import pandas as pd

from dotenv import load_dotenv
from pathlib import Path
from pymongo import MongoClient
from tqdm import tqdm

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent.parent

INPUT_PATH = BASE_DIR / "data/tmdb/processed/movies_final.csv"

client = MongoClient(os.getenv("MONGO_URI"))

db = client["movix"]
movies = db["movies"]

df = pd.read_csv(INPUT_PATH)

documents = []

for _, row in tqdm(df.iterrows(), total=len(df), desc="Preparing Movies"):

    documents.append({
        "tmdbId": int(row["tmdbId"]),
        "title": row["title"],
        "overview": row["overview"] if pd.notna(row["overview"]) else "",
        "genres": ast.literal_eval(row["genres"]),
        "keywords": ast.literal_eval(row["keywords"]),
        "cast": ast.literal_eval(row["cast"]),
        "director": row["director"] if pd.notna(row["director"]) else "",
        "voteAverage": float(row["voteAverage"]),
        "voteCount": int(row["voteCount"]),
        "popularity": float(row["popularity"]),
        "releaseDate": pd.to_datetime(row["releaseDate"]).to_pydatetime() if pd.notna(row["releaseDate"]) else None,
        "year": int(row["year"]) if pd.notna(row["year"]) else None,
        "runtime": int(row["runtime"]) if pd.notna(row["runtime"]) else 0,
        "tagline": row["tagline"] if pd.notna(row["tagline"]) else "",
        "posterPath": row["posterPath"],
        "backdropPath": row["backdropPath"],
        "homepage": row["homepage"] if pd.notna(row["homepage"]) else "",
        "status": row["status"] if pd.notna(row["status"]) else "",
        "embedding": ast.literal_eval(row["embedding"])
    })


print("Importing movies...")

movies.insert_many(documents, ordered=False)

print("\n================================")
print("Import Completed Successfully")
print("================================")
print(f"Movies Imported : {len(documents)}")