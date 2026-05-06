import api from "./api.js";

export const getCustomers = async (params = {}) => {
  const { data } = await api.get("/customers", { params });
  return data.data;
};

export const getGuests = async (params = {}) => {
  const { data } = await api.get("/customers/guests", { params });
  return data.data;
};
