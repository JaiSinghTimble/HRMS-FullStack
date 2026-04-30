import api from "./axios";

export const getDashboardStatsApi = () => {
  return api.get("/api/dashboard/stats");
};