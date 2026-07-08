import { createContext, useState } from "react";

export const UserContext = createContext();

const defaultUser = {
  name: "",
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  bio: "",
  country: "",
  techStack: "",
  college: "",
  degree: "",
  branch: "",
  graduationYear: "",
  avatar: "",
  platform_data: {
    github: { username: "" },
    leetcode: { username: "" },
  },
};

const normalizePlatformData = (data, previousPlatformData = {}) => {
  const platformData = {
    ...defaultUser.platform_data,
    ...previousPlatformData,
    ...(data?.platform_data || {}),
  };

  if (Array.isArray(data?.connectedPlatforms)) {
    data.connectedPlatforms.forEach(({ platform, username }) => {
      if (!platform || !username) return;
      platformData[platform] = {
        ...platformData[platform],
        username,
      };
    });
  }

  return platformData;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(defaultUser);

  const login = (data) => {
    if (!data) return;
    setUser((prev) => {
      return {
        ...prev,
        id: data._id || data.id || prev.id,
        username: data.username || prev.username,
        name: data.username || data.name || prev.name,
        email: data.email || prev.email,
        isEmailVerified: data.isEmailVerified ?? prev.isEmailVerified,
        avatar: data.avatar?.url || data.avatar || prev.avatar,
        platform_data: normalizePlatformData(data, prev.platform_data),
      };
    });
  };

  const logout = () => {
    setUser(defaultUser);
  };

  const updateBasicInfo = (info) => {
    setUser((prev) => ({
      ...prev,
      ...info,
    }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        updateBasicInfo,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
