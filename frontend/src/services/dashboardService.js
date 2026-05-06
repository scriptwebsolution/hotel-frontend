import api from "./api.js";

export const fetchDashboardStats = async () => {
  const { data } = await api.get("/dashboard/stats");
  return data.data;
};

export const fetchDashboardAnalytics = async () => {
  const { data } = await api.get("/dashboard/analytics");
  return data.data;
};
