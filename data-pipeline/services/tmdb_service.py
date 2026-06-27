import os
import requests

from dotenv import load_dotenv

load_dotenv()

TMDB_BASE_URL = "https://api.themoviedb.org/3"

TMDB_ACCESS_TOKEN = os.getenv("TMDB_ACCESS_TOKEN")

if not TMDB_ACCESS_TOKEN:
    raise ValueError("TMDB_ACCESS_TOKEN not found in .env")


class TMDBService:

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(
            {
                "Authorization": f"Bearer {TMDB_ACCESS_TOKEN}",
                "accept": "application/json",
            }
        )

    def _get(self, endpoint, params=None):
        response = self.session.get(
            f"{TMDB_BASE_URL}{endpoint}", params=params, timeout=15
        )

        response.raise_for_status()

        return response.json()


    def get_movie_details(self, tmdb_id):
        try:
            return self._get(f"/movie/{tmdb_id}")

        except requests.HTTPError as e:
            if e.response is not None and e.response.status_code == 404:
                return None
            raise

        except requests.RequestException:
            return None

    def find_movie_by_imdb(self, imdb_id):
        try:
            data = self._get(f"/find/{imdb_id}", {"external_source": "imdb_id"})

            movies = data.get("movie_results", [])

            if not movies:
                return None

            return movies[0]

        except requests.RequestException:
            return None

    def search_movie(self, title, year=None):
        params = {"query": title}

        if year:
            params["year"] = year

        try:
            data = self._get("/search/movie", params)

            results = data.get("results", [])

            if not results:
                return None

            return results[0]

        except requests.RequestException:
            return None
