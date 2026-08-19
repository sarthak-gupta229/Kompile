import axiosInstance from "./axiosInstance.js";

export const createRoom = async (data) => {
  const response = await axiosInstance.post("/rooms", data);
  return response.data;
};

export const joinRoom = async (data) => {
  const response = await axiosInstance.post(`/rooms/join-room`, data);
  return response.data;
};

export const leaveRoom = async (roomId) => {
  const response = await axiosInstance.post(`/rooms/${roomId}/leave`);
  return response.data;
};

export const getRoom = async (roomId) => {
  const response = await axiosInstance.get(`/rooms/${roomId}`);
  return response.data;
};

export const getRooms = async () => {
  const response = await axiosInstance.get("/rooms/mine");
  return response.data;
};

export const deleteRoom = async (roomId) => {
  const response = await axiosInstance.delete(`/rooms/${roomId}`);
  return response.data;
};
