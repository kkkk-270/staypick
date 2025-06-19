import axios from "axios";

const adminAxiosInstance = axios.create({
  baseURL: "http://localhost:8081", // 운영 배포 시 이 부분만 환경 변수로 대체
});

adminAxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken"); // ✅ 관리자용 토큰만 사용
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default adminAxiosInstance;
