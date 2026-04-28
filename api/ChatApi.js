import axios from "axios";

export const ChatApi = axios.create({
  baseURL: "https://localhost:7193/api/"
});