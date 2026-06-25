import axios from "axios";
import dotenv from "dotenv"

dotenv.config()

export const generateEmbedding = async (query) => {
  const response = await axios.post(`${process.env.AI_SERVICE_URL}/api/embedding`,{ query });

  return response.data.embedding;
};