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

export const getUserLeetCodeStats = async (username) => {
  const url = username ? `platforms/leetcode/${username}` : "platforms/leetcode";
  const { data } = await axiosInstance.get(url);
  return data;
};

export const getUserCodeForcesStats = async (username) => {
  const url = username
    ? `platforms/codeforces/${username}`
    : "platforms/codeforces";
  const { data } = await axiosInstance.get(url);
  return data;
};

export const getUserGitHubStats = async (username) => {
  const url = username ? `platforms/github/${username}` : "platforms/github";
  const { data } = await axiosInstance.get(url);
  return data;
};

export const getAllUserStats = async (username) => {
  const url = username ? `platforms/stats/${username}` : "platforms/stats";
  const { data } = await axiosInstance.get(url);
  return data;
};

export const syncAll = async () => {
  const { data } = await axiosInstance.post("/platforms/sync/all");
  return data;
};


