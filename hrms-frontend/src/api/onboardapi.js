import api from "./axios";

export const moveToOnboardApi = (id) => {
  return api.post(`/api/onboard/move/${id}`);
};

export const getOnboardApi = () => {
  return api.get("/api/onboard/all");
};