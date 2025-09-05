import api from "../lib/api/apiClient";
import { CompleteProfilePayload, CompleteProfileResponse, SendOtpPayload, SendOtpResponse, VerifyOtpPayload, VerifyOtpResponse } from "../types/auth";

// export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
//   const response = await api.post("/auth/login", payload);
//   return response.data;
// };

export const sendOtp = async (payload: SendOtpPayload): Promise<SendOtpResponse> => {
  try {
    const response = await api.post<SendOtpResponse>("/auth/send-otp", payload);
    console.log("OTP response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("sendOtp error:", error?.response?.data || error.message);
    throw error;
  }
};

export const verifyOtp = async (payload: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
  const response = await api.post<VerifyOtpResponse>("/auth/verify-otp", payload);
  return response.data;
}

export const completeProfile = async (payload: CompleteProfilePayload): Promise<CompleteProfileResponse> => {
  const response = await api.post<CompleteProfileResponse>("/auth/complete-profile", payload);
  return response.data;
}