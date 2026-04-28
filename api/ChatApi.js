import axios from "axios";

export const chatApi = axios.create({
  baseURL: "https://localhost:7193/api/"
});