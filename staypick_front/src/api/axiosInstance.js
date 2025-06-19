// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8081/api", // 백엔드 주소
});

// 요청마다 Authorization 헤더 자동 첨부
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // AuthProvider와 동일한 키 사용
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
