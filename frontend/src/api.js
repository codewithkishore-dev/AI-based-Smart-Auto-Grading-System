import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-based-smart-auto-grading-system-99sh.onrender.com/api",
});

export default API;