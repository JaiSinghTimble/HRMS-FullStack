import api from "./axios";

export const sendOtpApi = (data) => {
  return api.post("/api/auth/send-otp", data);
};

export const verifyOtpApi = (data) => {
  return api.post("/api/auth/verify-otp", data);
};

export const resendOtpApi = (data) => {
  return api.post("/api/auth/resend-otp", data);
};