import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-based-smart-auto-grading-system-ma2s.onrender.com/api",
});

export default API;