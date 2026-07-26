import axiosInstance from "./axiosInstance";

export const syncLeetCode = async () => {
  const { data } = await axiosInstance.post("platforms/sync/leetcode");
  return data;
};

export const syncCodeForces = async () => {
  const { data } = await axiosInstance.post("platforms/sync/codeforces");
  return data;
};

export const syncGitHub = async () => {
  const { data } = await axiosInstance.post("platforms/sync/github");
  return data;
};

export const getUserLeetCodeStats = async () => {
  const { data } = await axiosInstance.get("platforms/leetcode");
  return data;
};

export const getUserCodeForcesStats = async () => {
  const { data } = await axiosInstance.get("platforms/codeforces");
  return data;
};

export const getUserGitHubStats = async () => {
  const { data } = await axiosInstance.get("platforms/github");
  return data;
};

export const getAllUserStats = async () => {
  const { data } = await axiosInstance.get("platforms/stats");
  return data;
};
