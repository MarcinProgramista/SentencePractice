import axios from "axios";

const API_URL = "http://localhost:3000/api/sentences";

export const getSentences = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getSentenceById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const searchSentences = async (query) => {
  const response = await axios.get(`${API_URL}/search?q=${query}`);
  return response.data;
};

export const createSentence = async (sentence) => {
  const response = await axios.post(API_URL, sentence);

  return response.data;
};

export const deleteSentence = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);

  return response.data;
};

export const updateSentence = async (id, sentence) => {
  const response = await axios.put(`${API_URL}/${id}`, sentence);

  return response.data;
};
