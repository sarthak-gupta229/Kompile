import axiosInstance from "./axiosInstance.js";

export const getAllCompanies = async () => {
  const response = await axiosInstance.get("/companies");
  return response.data;
};

export const getCompanyQuestions = async (companyId, params = {}) => {
  const response = await axiosInstance.get(`/companies/${companyId}/questions`, {
    params,
  });
  return response.data;
};

export const getCompanyTopics = async (companyId) => {
  const response = await axiosInstance.get(`/companies/${companyId}/topics`);
  return response.data;
};

export const toggleCompanyQuestion = async (companyId, questionId) => {
  const response = await axiosInstance.post(
    `/companies/${companyId}/questions/${questionId}/toggle`,
  );
  return response.data;
};
