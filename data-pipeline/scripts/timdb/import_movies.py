import ast
import os

import pandas as pd

from dotenv import load_dotenv
from pathlib import Path
from pymongo import MongoClient
from tqdm import tqdm

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent.parent

INPUT_PATH = (
    BASE_DIR
    / "data"
    / "timdb"
    / "processed"
    / "movies_final.csv"
)

client = MongoClient(os.getenv("MONGO_URI"))

db = client["movix"]
movies = db["movies"]

df = pd.read_csv(INPUT_PATH)

documents = []

for _, row in tqdm(
    df.iterrows(),
    total=len(df),
    desc="Preparing Movies"
):

    runtime = row["runtime"]

    if pd.isna(runtime) or runtime == "\\N":
        runtime = 0
    else:
        runtime = int(float(runtime))

    year = row["year"]

    if pd.isna(year):
        year = None
    else:
        year = int(year)

    release_date = None

    if pd.notna(row["releaseDate"]):

        parsed_date = pd.to_datetime(
            row["releaseDate"],
            format="%d %B %Y",
            errors="coerce"
        )

        if not pd.isna(parsed_date):
            release_date = parsed_date.to_pydatetime()

    documents.append({
        "tmdbId": int(row["tmdbId"]),
        "title": row["title"],
        "overview": row["overview"] if pd.notna(row["overview"]) else "",
        "genres": ast.literal_eval(row["genres"]),
        "keywords": ast.literal_eval(row["keywords"]),
        "cast": ast.literal_eval(row["cast"]),
        "director": row["director"] if pd.notna(row["director"]) else "",
        "voteAverage": float(row["voteAverage"]) if pd.notna(row["voteAverage"]) else 0,
        "voteCount": int(row["voteCount"]) if pd.notna(row["voteCount"]) else 0,
        "popularity": float(row["popularity"]) if pd.notna(row["popularity"]) else 0,
        "releaseDate": release_date,
        "year": year,
        "runtime": runtime,
        "tagline": row["tagline"] if pd.notna(row["tagline"]) else "",
        "posterPath": row["posterPath"],
        "backdropPath": row["backdropPath"],
        "homepage": row["homepage"] if pd.notna(row["homepage"]) else "",
        "status": row["status"] if pd.notna(row["status"]) else "",
        "embedding": ast.literal_eval(row["embedding"])
    })


print("Importing movies...")

movies.insert_many(
    documents,
    ordered=False
)

print("\n================================")
print("Import Completed Successfully")
print("================================")
print(f"Movies Imported : {len(documents)}")