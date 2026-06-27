import pandas as pd

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

FULL_PATH = BASE_DIR / "data/timdb/source/bollywood_full.csv"
CREW_PATH = BASE_DIR / "data/timdb/source/bollywood_crew.csv"
CREW_DATA_PATH = BASE_DIR / "data/timdb/source/bollywood_crew_data.csv"

OUTPUT_PATH = BASE_DIR / "data/timdb/processed/movies_processed.csv"

movies = pd.read_csv(FULL_PATH)
crew = pd.read_csv(CREW_PATH)
crew_data = pd.read_csv(CREW_DATA_PATH)

crew_lookup = crew_data.set_index("crew_id")["name"].to_dict()


def get_director(crew_ids):
    if pd.isna(crew_ids):
        return ""

    director_id = str(crew_ids).split("|")[0]

    return crew_lookup.get(director_id, "")


movies = movies.merge(
    crew[["imdb_id", "directors"]],
    on="imdb_id",
    how="left"
)

movies["director"] = movies["directors"].apply(get_director)

movies["overview"] = movies["summary"].fillna("")
movies.loc[movies["overview"] == "", "overview"] = movies["story"].fillna("")

movies["genres"] = movies["genres"].fillna("").apply(
    lambda x: [genre.strip() for genre in x.split("|") if genre.strip()]
)

movies["cast"] = movies["actors"].fillna("").apply(
    lambda x: [actor.strip() for actor in x.split("|") if actor.strip()]
)

movies["keywords"] = [[] for _ in range(len(movies))]

movies["popularity"] = 0

movies["search_content"] = (
    movies["title_x"].fillna("")
    + " "
    + movies["overview"].fillna("")
    + " "
    + movies["tagline"].fillna("")
    + " Genres: "
    + movies["genres"].astype(str)
    + " Cast: "
    + movies["cast"].astype(str)
    + " Director: "
    + movies["director"].fillna("")
)

final_df = movies[[
    "imdb_id",
    "title_x",
    "overview",
    "genres",
    "keywords",
    "cast",
    "director",
    "imdb_rating",
    "imdb_votes",
    "popularity",
    "release_date",
    "year_of_release",
    "runtime",
    "tagline",
    "search_content"
]].copy()

final_df.rename(columns={
    "imdb_id": "imdbId",
    "title_x": "title",
    "imdb_rating": "voteAverage",
    "imdb_votes": "voteCount",
    "release_date": "releaseDate",
    "year_of_release": "year"
}, inplace=True)

OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

final_df.to_csv(OUTPUT_PATH, index=False)

print(f"Processed {len(final_df)} movies.")
print(f"Saved to: {OUTPUT_PATH}")