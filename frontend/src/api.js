import axios from "axios";

const API = axios.create({
  baseURL: "https://YOUR-BACKEND-URL.onrender.com/api"
});

export default API;