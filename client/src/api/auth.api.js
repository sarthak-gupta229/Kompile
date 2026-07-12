import axiosInstance from "./axiosInstance";

export const registerUser = async ({
  username,
  email,
  password,
  confirmPassword,
  leetcodeUsername = "",
  githubUsername = "",
}) => {
  const { data } = await axiosInstance.post("/auth/register", {
    username,
    email,
    password,
    confirmPassword,
    leetcodeUsername,
    githubUsername,
  });
  return data;
};

export const loginUser = async ({ email, password }) => {
  const { data } = await axiosInstance.post("/auth/login", {
    email,
    password,
  });
  return data;
};

export const logoutUser = async () => {
  const { data } = await axiosInstance.post("/auth/logout");
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await axiosInstance.get("/auth/current-user");
  return data;
};

export const verifyEmail = async (verificationToken) => {
  const { data } = await axiosInstance.get(
    `/auth/verify-email/${verificationToken}`,
  );
  return data;
};

export const resendEmailVerification = async () => {
  const { data } = await axiosInstance.post("/auth/resend-email-verification");
  return data;
};

export const refreshAccessToken = async () => {
  const { data } = await axiosInstance.post("/auth/refresh-token");
  return data;
};

export const forgotPassword = async ({ email }) => {
  const { data } = await axiosInstance.post("/auth/forgot-password", { email });
  return data;
};

export const resetPassword = async ({ resetToken, newPassword }) => {
  const { data } = await axiosInstance.post(
    `/auth/reset-password/${resetToken}`,
    { newPassword },
  );
  return data;
};

export const changePassword = async ({ oldPassword, newPassword }) => {
  const { data } = await axiosInstance.post("/auth/change-password", {
    oldPassword,
    newPassword,
  });
  return data;
};

export const getBasicInfo = async () => {
  const { data } = await axiosInstance.get("/users/get-basic-info");
  return data;
};

export const updateBasicInfo = async ({
  firstName,
  lastName,
  bio,
  country,
  techStack,
  college,
  degree,
  branch,
  graduationYear,
}) => {
  const { data } = await axiosInstance.put("/users/update-basic-info", {
    firstName,
    lastName,
    bio,
    country,
    techStack,
    college,
    degree,
    branch,
    graduationYear,
  });
  return data;
};
