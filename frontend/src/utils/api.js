import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true // <--- cookie receive/send होईल
});

export default api;