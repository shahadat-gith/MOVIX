import os
import json

from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")

client = MongoClient(MONGO_URI)

db = client[DB_NAME]

collection = db[COLLECTION_NAME]

json_file = (
    BASE_DIR /
    "data/embeddings/movies_embeddings.json"
)

print("Loading JSON...")

with open(
    json_file,
    "r",
    encoding="utf-8"
) as file:
    movies = json.load(file)

print(f"Found {len(movies)} movies")

print("Clearing collection...")

collection.delete_many({})

print("Inserting movies...")

collection.insert_many(movies)

print(
    f"Successfully inserted {len(movies)} movies."
)