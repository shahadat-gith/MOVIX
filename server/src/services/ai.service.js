import axios from "axios";
import dotenv from "dotenv";
import { InferenceClient } from "@huggingface/inference";

dotenv.config();

const environment = process.env.NODE_ENV;

const hfClient = new InferenceClient(process.env.HF_TOKEN);

export const generateEmbedding = async (query) => {
  if (environment === "production") {
    const embedding = await hfClient.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: query,
    });

    return embedding;
  }

  const response = await axios.post(
    `${process.env.AI_SERVICE_URL}/api/embedding`,
    {
      query,
    }
  );

  return response.data.embedding;
};