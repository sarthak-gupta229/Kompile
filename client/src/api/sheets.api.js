import axiosInstance from "./axiosInstance";

export const getSheetBySlug = async (slug) => {
  const { data } = await axiosInstance.get(`sheets/${slug}`);

  return data;
};

export const getAllSheetsStats = async () => {
  const { data } = await axiosInstance.get(`sheets`);
  return data;
};

export const toggleSheetQuestion = async (sheetId, questionId) => {
  const { data } = await axiosInstance.patch(
    `sheets/${sheetId}/questions/${questionId}/toggle`,
  );
  return data;
};

export const toggleBookmarkQuestion = async (sheetId, questionId) => {
  const { data } = await axiosInstance.patch(
    `sheets/${sheetId}/questions/${questionId}/bookmark`,
  );
  return data;
};

