import axiosInstance from "./axiosInstance";

export const fetchGlobalLeaderboard = async ({
  metric,
  page = 1,
  limit = 20,
}) => {
  const { data } = await axiosInstance.get("/leaderboard/leaderboard", {
    params: { metric, page, limit },
  });
  return data.data;
};

export const fetchRoomLeaderboard = async ({ roomId, metric }) => {
  const { data } = await axiosInstance.get(`/leaderboard/rooms/${roomId}/leaderboard`, {
    params: { metric },
  });
  return data.data;
};
