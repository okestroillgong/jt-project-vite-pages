import axios from "axios";

const api = axios.create({
  baseURL: "/api", // API 요청의 기본 URL을 설정합니다.
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 요청 타임아웃을 10초로 설정합니다.
});

// 요청 인터셉터: 모든 요청에 인증 토큰을 추가하는 등의 작업을 수행할 수 있습니다.
api.interceptors.request.use(
  (config) => {
    // 예: 로컬 스토리지에서 토큰을 가져와 헤더에 추가
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    console.log("Starting Request", config);
    return config;
  },
  (error) => {
    console.error("Request Error", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 응답 데이터를 처리하거나 에러를 공통으로 처리합니다.
api.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  (error) => {
    console.error("Response Error", error);
    // 예: 401 Unauthorized 에러 발생 시 로그인 페이지로 리디렉션
    // if (error.response && error.response.status === 401) {
    //   window.location.href = '/login';
    // }
    return Promise.reject(error);
  }
);

export default api;
