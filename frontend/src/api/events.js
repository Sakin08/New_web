import api from "./axios.js";

export default {
  getAll: () => api.get("/events"),
  create: (data) => api.post("/events", data),
};
