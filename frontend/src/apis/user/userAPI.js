import axios from "axios";

//======Registration========

export const resgisterAPI = async (userData) => {
  const response = await axios.post(
    "http://localhost:5000/api/v1/users/register",
    {
      email: userData?.email,
      password: userData?.password,
      username: userData?.username,
    },
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

//======login========

export const loginAPI = async (userData) => {
  const response = await axios.post(
    "http://localhost:5000/api/v1/users/login",
    {
      email: userData?.email,
      password: userData?.password,
    },
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

//======check Auth========

export const checkUserAuthStatusAPI = async (userData) => {
  const response = await axios.get(
    "http://localhost:5000/api/v1/users/auth/check",
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

//======logout========

export const logoutAPI = async (userData) => {
  const response = await axios.post(
    "http://localhost:5000/api/v1/users/logout",
    {},
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

//======logout========

export const getUserProfileAPI = async () => {
  const response = await axios.get(
    "http://localhost:5000/api/v1/users/profile",
    {
      withCredentials: true,
    }
  );
  return response?.data;
};
