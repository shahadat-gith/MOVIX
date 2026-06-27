import time
import pandas as pd

from pathlib import Path

from services.tmdb_service import TMDBService

BASE_DIR = Path(__file__).resolve().parent.parent.parent

INPUT_PATH = BASE_DIR / "data/timdb/processed/movies_processed.csv"
OUTPUT_PATH = BASE_DIR / "data/timdb/processed/movies_enriched.csv"

df = pd.read_csv(INPUT_PATH)

tmdb = TMDBService()

print(f"Enriching {len(df)} movies...")

tmdb_ids = []
poster_paths = []
backdrop_paths = []
popularities = []
homepages = []
statuses = []

for index, row in df.iterrows():

    imdb_id = row["imdbId"]

    if pd.isna(imdb_id):
        tmdb_ids.append(None)
        poster_paths.append(None)
        backdrop_paths.append(None)
        popularities.append(0)
        homepages.append("")
        statuses.append("")
        continuemdb_id = row["imdbId"]

    movie = tmdb.find_movie_by_imdb(imdb_id)

    if movie is None:

        print(f"[{index + 1}/{len(df)}] Failed: {imdb_id}")

        tmdb_ids.append(None)
        poster_paths.append(None)
        backdrop_paths.append(None)
        popularities.append(0)
        homepages.append("")
        statuses.append("")

        continue

    tmdb_id = movie.get("id")

    details = tmdb.get_movie_details(tmdb_id)

    tmdb_ids.append(tmdb_id)
    poster_paths.append(movie.get("poster_path"))
    backdrop_paths.append(movie.get("backdrop_path"))
    popularities.append(movie.get("popularity", 0))

    if details:
        homepages.append(details.get("homepage", ""))
        statuses.append(details.get("status", ""))
    else:
        homepages.append("")
        statuses.append("")

    if (index + 1) % 100 == 0:
        print(f"Processed {index + 1}/{len(df)}")

    time.sleep(0.03)

df["tmdbId"] = tmdb_ids
df["posterPath"] = poster_paths
df["backdropPath"] = backdrop_paths
df["popularity"] = popularities
df["homepage"] = homepages
df["status"] = statuses

OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

df.to_csv(OUTPUT_PATH, index=False)

print(f"\nEnriched {len(df)} movies")
print(f"Saved to: {OUTPUT_PATH}")
