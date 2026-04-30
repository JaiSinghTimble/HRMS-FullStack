import api from "./axios";

export const createJobApi = (data) => {
  return api.post("/api/job/create", data);
};

export const getJobsApi = () => {
  return api.get("/api/job/all");
};

export const getOpenJobsApi = () => {
  return api.get("/api/job/open");
};

export const deleteJobApi = (id) => {
  return api.delete(`/api/job/delete/${id}`);
};

export const updateJobApi = (id, data) => {
  return api.put(`/api/job/update/${id}`, data);
};