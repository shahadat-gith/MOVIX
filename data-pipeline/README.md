# MOVIX Data Pipeline

A production-ready data pipeline for ingesting, enriching, embedding, and importing movie datasets into MongoDB for the MOVIX platform.

## Features

* Processes TMDB and TIMDB datasets
* Cleans and transforms raw movie data
* Enriches movies using TMDB API
* Generates semantic embeddings using Hugging Face Inference API
* Imports optimized documents into MongoDB
* Designed for AWS Lambda deployment

## Project Structure

```text
data-pipeline/
│
├── data/
│   ├── tmdb/
│   │   ├── source/
│   │   └── processed/
│   │
│   └── timdb/
│       ├── source/
│       └── processed/
│
├── scripts/
│   ├── tmdb/
│   │   ├── preprocess_dataset.py
│   │   ├── enrich_dataset.py
│   │   ├── embed_movies.py
│   │   └── import_movies.py
│   │
│   └── timdb/
│       ├── preprocess_dataset.py
│       ├── enrich_dataset.py
│       ├── embed_movies.py
│       └── import_movies.py
│
├── services/
│   ├── embedding_service.py
│   └── tmdb_service.py
│
├── requirements.txt
├── .env
└── README.md
```

## Requirements

* Python 3.12+
* MongoDB Atlas
* TMDB API Access Token
* Hugging Face API Token

## Installation

```bash
pip install -r requirements.txt
```

## Environment Variables

Create a `.env` file using `.env.example`.

## TMDB Pipeline

### 1. Preprocess Dataset

```bash
python -m scripts.tmdb.preprocess_dataset
```

### 2. Enrich Dataset

```bash
python -m scripts.tmdb.enrich_dataset
```

### 3. Generate Embeddings

```bash
python -m scripts.tmdb.embed_movies
```

### 4. Import into MongoDB

```bash
python -m scripts.tmdb.import_movies
```

## TIMDB Pipeline

### 1. Preprocess Dataset

```bash
python -m scripts.timdb.preprocess_dataset
```

### 2. Enrich Dataset

```bash
python -m scripts.timdb.enrich_dataset
```

### 3. Generate Embeddings

```bash
python -m scripts.timdb.embed_movies
```

### 4. Import into MongoDB

```bash
python -m scripts.timdb.import_movies
```

## Output

The final imported movie document contains:

* Metadata
* Genres
* Keywords
* Cast
* Director
* Ratings
* Runtime
* Poster
* Backdrop
* Semantic Embedding

## Tech Stack

* Python
* Pandas
* PyMongo
* Hugging Face Inference API
* TMDB API
* MongoDB Atlas

## License

MIT License
