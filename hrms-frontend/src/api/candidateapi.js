import api from "./axios";

export const getCandidatesApi = () => {
  return api.get("/api/candidate/all");
};

export const processCandidateApi = (id) => {
  return api.put(`/api/candidate/process/${id}`);
};

export const rejectCandidateApi = (id) => {
  return api.put(`/api/candidate/reject/${id}`);
};