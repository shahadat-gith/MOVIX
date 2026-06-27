import time
import pandas as pd

from pathlib import Path

from services.tmdb_service import TMDBService

BASE_DIR = Path(__file__).resolve().parent.parent.parent

input_path = (
    BASE_DIR
    / "data"
    / "tmdb"
    / "processed"
    / "movies_processed.csv"
)

output_path = (
    BASE_DIR
    / "data"
    / "tmdb"
    / "processed"
    / "movies_enriched.csv"
)

df = pd.read_csv(input_path)

tmdb = TMDBService()

print(f"Enriching {len(df)} movies...")

poster_paths = []
backdrop_paths = []
runtimes = []
taglines = []
homepages = []
statuses = []

for index, row in df.iterrows():

    tmdb_id = row["tmdbId"]

    movie = tmdb.get_movie_details(tmdb_id)

    if movie is None:

        print(f"[{index + 1}/{len(df)}] Failed: {tmdb_id}")

        poster_paths.append(None)
        backdrop_paths.append(None)
        runtimes.append(None)
        taglines.append("")
        homepages.append("")
        statuses.append("")

        continue

    poster_paths.append(movie.get("poster_path"))
    backdrop_paths.append(movie.get("backdrop_path"))
    runtimes.append(movie.get("runtime"))
    taglines.append(movie.get("tagline"))
    homepages.append(movie.get("homepage"))
    statuses.append(movie.get("status"))

    if (index + 1) % 100 == 0:
        print(f"Processed {index + 1}/{len(df)}")

    time.sleep(0.03)

df["posterPath"] = poster_paths
df["backdropPath"] = backdrop_paths
df["runtime"] = runtimes
df["tagline"] = taglines
df["homepage"] = homepages
df["status"] = statuses

output_path.parent.mkdir(
    parents=True,
    exist_ok=True
)

df.to_csv(
    output_path,
    index=False
)

print(f"\nEnriched {len(df)} movies")
print(f"Saved to: {output_path}")