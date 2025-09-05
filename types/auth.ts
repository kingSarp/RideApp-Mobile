// 📩 Data we send to backend
export interface SendOtpPayload {
  email: string;
}
// types/auth.ts
export interface User {
  id: number;
  email: string;
  isVerified: boolean;
  hasProfile: boolean;
  profileCompleted: boolean;
  name: string | null;
  phone: string; // E.164 formatted, e.g., +233501234567
}

// 📬 Data we receive from backend
export interface SendOtpResponse {
  message: string;
  isNewUser: boolean;
  type: "signup" | "login";
  sessionId: string;
}

export interface OtpSession {
  sessionId: string;
  email: string;
  type: "signup" | "login";
}

export interface VerifyOtpPayload {
  otp: string;
  sessionId: string;
}

export interface VerifyOtpResponse {
  message: string;
  userExists: boolean;
  isNewUser: boolean;
  needsProfile: boolean;
  type: "signup" | "login" | string; // or use a union of all expected types
  user: VerifiedUser;
  token: string;
}

export interface VerifiedUser {
  id: number;
  email: string;
  isVerified: boolean;
  hasProfile: boolean;
  profileCompleted: boolean;
  name: string | null;
  phone: string; // E.164 formatted, e.g., +233501234567
}

export interface CompleteProfilePayload {
  name: string;
  email: string;
  phone: string; // local or E.164 formatted phone number
  countryCode: string; // ISO alpha-2 country code, e.g., 'GH'
  password: string;
}

export interface CompleteProfileResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface OtpResponse {
  success: boolean;
  token?: string;
  message?: string;
}
