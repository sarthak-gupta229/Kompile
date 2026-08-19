import axiosInstance from "./axiosInstance.js";

export const getMissions = async () => {
  const { data } = await axiosInstance.get("/missions");
  return data;
};

export const createMission = async (missionData) => {
  const { data } = await axiosInstance.post("/missions/create", missionData);
  return data;
};

export const toggleMission = async (missionId) => {
  const { data } = await axiosInstance.patch(`/missions/toggle/${missionId}`);
  return data;
};

export const deleteMission = async (missionId) => {
  const { data } = await axiosInstance.delete(`/missions/delete/${missionId}`);
  return data;
};
