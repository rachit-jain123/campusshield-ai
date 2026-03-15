import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export const scanText = (data) => API.post("/scan", data);

export default API;