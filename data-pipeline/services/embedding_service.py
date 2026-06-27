import os
import time

from dotenv import load_dotenv
from huggingface_hub import InferenceClient
from tqdm import tqdm

load_dotenv()


class Embedding:

    def __init__(self):
        self.token = os.getenv("HF_TOKEN")
        self.model = os.getenv("HF_EMBEDDING_MODEL")

        if not self.token:
            raise ValueError("HF_TOKEN not found in .env")

        if not self.model:
            raise ValueError("HF_EMBEDDING_MODEL not found in .env")

        self.client = InferenceClient(
            provider="hf-inference",
            api_key=self.token
        )

    def _embed_batch(self, texts):
        embeddings = self.client.feature_extraction(
            texts,
            model=self.model
        )

        if hasattr(embeddings, "tolist"):
            embeddings = embeddings.tolist()

        return [
            [float(value) for value in embedding]
            for embedding in embeddings
        ]

    def generate_embeddings(self, texts, batch_size=64, max_retries=3):
        if isinstance(texts, str):
            texts = [texts]

        embeddings = []

        total_batches = (len(texts) + batch_size - 1) // batch_size

        for i in tqdm(
            range(0, len(texts), batch_size),
            total=total_batches,
            desc="Generating Embeddings"
        ):
            batch = texts[i:i + batch_size]

            for attempt in range(max_retries):
                try:
                    batch_embeddings = self._embed_batch(batch)
                    embeddings.extend(batch_embeddings)
                    break

                except Exception as e:
                    if attempt == max_retries - 1:
                        raise RuntimeError(
                            f"Failed to generate embeddings.\n{e}"
                        )

                    time.sleep(2)

        return embeddings