import ast
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

movies_path = BASE_DIR / "data" / "tmdb" / "source" / "tmdb_5000_movies.csv"
credits_path = BASE_DIR / "data" / "tmdb" / "source" / "tmdb_5000_credits.csv"

movies_df = pd.read_csv(movies_path)
credits_df = pd.read_csv(credits_path)

df = movies_df.merge(
    credits_df,
    left_on="id",
    right_on="movie_id",
    how="inner"
)


def extract_names(value):
    if pd.isna(value):
        return []

    try:
        return [item["name"] for item in ast.literal_eval(value)]
    except (ValueError, SyntaxError, TypeError):
        return []


def extract_cast(value):
    if pd.isna(value):
        return []

    try:
        return [item["name"] for item in ast.literal_eval(value)[:5]]
    except (ValueError, SyntaxError, TypeError):
        return []


def extract_director(value):
    if pd.isna(value):
        return ""

    try:
        crew = ast.literal_eval(value)

        for member in crew:
            if member.get("job") == "Director":
                return member.get("name", "")

    except (ValueError, SyntaxError, TypeError):
        pass

    return ""


df["genres"] = df["genres"].apply(extract_names)
df["keywords"] = df["keywords"].apply(extract_names)
df["cast"] = df["cast"].apply(extract_cast)
df["director"] = df["crew"].apply(extract_director)

df["overview"] = df["overview"].fillna("")
df["tagline"] = df["tagline"].fillna("")

df["search_content"] = (
    df["title_x"].fillna("")
    + " "
    + df["overview"]
    + " "
    + df["tagline"]
    + " Genres: "
    + df["genres"].astype(str)
    + " Keywords: "
    + df["keywords"].astype(str)
    + " Cast: "
    + df["cast"].astype(str)
    + " Director: "
    + df["director"]
)

final_df = df[
    [
        "id",
        "title_x",
        "overview",
        "genres",
        "keywords",
        "cast",
        "director",
        "vote_average",
        "vote_count",
        "popularity",
        "release_date",
        "search_content",
    ]
].copy()

final_df.rename(
    columns={
        "id": "tmdbId",
        "title_x": "title",
        "vote_average": "voteAverage",
        "vote_count": "voteCount",
        "release_date": "releaseDate",
    },
    inplace=True,
)

output_path = (
    BASE_DIR
    / "data"
    / "tmdb"
    / "processed"
    / "movies_processed.csv"
)

output_path.parent.mkdir(parents=True, exist_ok=True)

final_df.to_csv(output_path, index=False)

print(f"Processed {len(final_df)} movies.")
print(f"Saved to: {output_path}")