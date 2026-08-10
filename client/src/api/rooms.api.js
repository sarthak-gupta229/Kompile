import axiosInstance from "./axiosInstance";

export const createRoom = async (data) => {
  const response = await axiosInstance.post("/rooms", data);
  return response.data;
};

export const joinRoom = async (roomId) => {
  const response = await axiosInstance.post(`/rooms/${roomId}/join`);
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
  const response = await axiosInstance.get("/rooms");
  return response.data;
};

export const deleteRoom = async (roomId) => {
  const response = await axiosInstance.delete(`/rooms/${roomId}`);
  return response.data;
};
