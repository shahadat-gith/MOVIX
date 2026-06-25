import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

movies_path = BASE_DIR / "data/raw/tmdb_5000_movies.csv"
credits_path = BASE_DIR / "data/raw/tmdb_5000_credits.csv"

movies = pd.read_csv(movies_path)
credits = pd.read_csv(credits_path)

merged = movies.merge(
    credits,
    left_on="id",
    right_on="movie_id"
)

output_path = BASE_DIR / "data/processed/movies_merged.csv"

output_path.parent.mkdir(
    parents=True,
    exist_ok=True
)

merged.to_csv(
    output_path,
    index=False
)

print(f"Merged dataset saved: {output_path}")