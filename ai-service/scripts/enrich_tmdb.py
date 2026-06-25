import os
import time
import requests

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
TMDB_ACCESS_TOKEN = os.getenv("TMDB_ACCESS_TOKEN")

client = MongoClient(MONGO_URI)

db = client["movix"]
movies = db["movies"]

headers = {
    "Authorization": f"Bearer {TMDB_ACCESS_TOKEN}",
    "accept": "application/json"
}

total = movies.count_documents({})

print(f"Found {total} movies")

cursor = movies.find(
    {},
    {
        "_id": 1,
        "tmdbId": 1,
        "title": 1
    }
)

for index, movie in enumerate(cursor, start=1):

    tmdb_id = movie["tmdbId"]

    try:

        response = requests.get(
            f"https://api.themoviedb.org/3/movie/{tmdb_id}",
            headers=headers,
            timeout=15
        )

        if response.status_code != 200:
            print(
                f"Failed {tmdb_id} "
                f"({response.status_code})"
            )
            continue

        data = response.json()

        movies.update_one(
            {
                "_id": movie["_id"]
            },
            {
                "$set": {
                    "posterPath": data.get("poster_path"),
                    "backdropPath": data.get("backdrop_path"),
                    "runtime": data.get("runtime"),
                    "tagline": data.get("tagline"),
                    "homepage": data.get("homepage"),
                    "status": data.get("status")
                }
            }
        )

        if index % 25 == 0:
            print(
                f"{index}/{total} updated"
            )

        time.sleep(0.05)

    except Exception as e:
        print(
            f"Error {tmdb_id}: {e}"
        )

print("Finished enrichment")