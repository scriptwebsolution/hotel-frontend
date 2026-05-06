import api from "./api.js";

export const getFacilityList = async () => {
  const { data } = await api.get("/room-facilities/list");
  return data.data;
};

export const deleteFacility = async (id) => {
  const { data } = await api.delete(`/room-facilities/list/${id}`);
  return data;
};

export const getFacilityDetailsList = async () => {
  const { data } = await api.get("/room-facilities/details");
  return data.data;
};

export const deleteFacilityDetails = async (id) => {
  const { data } = await api.delete(`/room-facilities/details/${id}`);
  return data;
};

export const getRoomSizeList = async () => {
  const { data } = await api.get("/room-facilities/sizes");
  return data.data;
};

export const deleteRoomSize = async (id) => {
  const { data } = await api.delete(`/room-facilities/sizes/${id}`);
  return data;
};
