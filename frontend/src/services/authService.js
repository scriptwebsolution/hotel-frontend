import api from "./api.js";

export const registerRequest = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data.data;
};

export const loginRequest = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data.data;
};

export const googleLoginRequest = async (credential) => {
  const { data } = await api.post("/auth/google", { credential });
  return data.data;
};

export const fetchMe = async () => {
  const { data } = await api.get("/auth/me");
  return data.data;
};
