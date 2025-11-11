import api from "./axios.js";

export default {
  getAll: () => api.get("/housing"),
  create: (data) =>
    api.post("/housing", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, data) => api.put(`/housing/${id}`, data),
  remove: (id) => api.delete(`/housing/${id}`),
};
