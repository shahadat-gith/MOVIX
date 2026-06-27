import axios from "axios";
import dotenv from "dotenv";
import { InferenceClient } from "@huggingface/inference";

dotenv.config();


const hfClient = new InferenceClient(process.env.HF_TOKEN);
const hfModel = process.env.HF_EMBEDDING_MODEL

export const generateEmbedding = async (query) => {
  const embedding = await hfClient.featureExtraction({
    model: hfModel,
    inputs: query,
  });

  return embedding;
};