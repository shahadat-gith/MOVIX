import os
import time
import requests

from datetime import datetime
from dotenv import load_dotenv
from pymongo import MongoClient
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
TMDB_ACCESS_TOKEN = os.getenv("TMDB_ACCESS_TOKEN")

client = MongoClient(MONGO_URI)

db = client["movix"]

movies = db["movies"]
movie_details = db["movieDetails"]

session = requests.Session()

retry_strategy = Retry(
    total=5,
    backoff_factor=1,
    status_forcelist=[429, 500, 502, 503, 504]
)

adapter = HTTPAdapter(
    max_retries=retry_strategy
)

session.mount("https://", adapter)

headers = {
    "accept": "application/json",
    "Authorization": f"Bearer {TMDB_ACCESS_TOKEN}"
}

cursor = movies.find(
    {},
    {
        "tmdbId": 1,
        "title": 1
    }
)

total = movies.count_documents({})

print(f"Processing {total} movies")

for index, movie in enumerate(cursor, start=1):

    tmdb_id = movie["tmdbId"]

    exists = movie_details.find_one(
        {
            "tmdbId": tmdb_id
        }
    )

    if exists:
        continue

    try:

        response = session.get(
            f"https://api.themoviedb.org/3/movie/{tmdb_id}",
            headers=headers,
            timeout=30
        )

        if response.status_code != 200:
            print(
                f"Failed {tmdb_id}"
            )
            continue

        data = response.json()

        movie_details.insert_one({
            "tmdbId": tmdb_id,

            "posterPath":
                data.get("poster_path"),

            "backdropPath":
                data.get("backdrop_path"),

            "runtime":
                data.get("runtime"),

            "tagline":
                data.get("tagline"),

            "homepage":
                data.get("homepage"),

            "status":
                data.get("status"),

            "cachedAt":
                datetime.utcnow()
        })

        if index % 25 == 0:
            print(
                f"{index}/{total}"
            )

        time.sleep(0.15)

    except Exception as e:
        print(
            f"Error {tmdb_id}: {e}"
        )

print("Completed")