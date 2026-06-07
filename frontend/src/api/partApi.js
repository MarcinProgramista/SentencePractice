import axios from "axios";

const API_URL = "http://localhost:3000/api/parts";

export const getParts = async () => {
  const response = await axios.get(API_URL);

  return response.data;
};
