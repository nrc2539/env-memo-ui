import { useApiClient } from "@/hooks/useApiClient";
import type { UserProfileType } from "@/models/UserProfileType";

interface VerifyTokenResponse {
  id: number;
  email: string;
  name: string;
  tokenType: "reset" | "setup";
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export function useAuthAction() {
  const apiClient = useApiClient();

  async function login(
    email: string,
    password: string,
  ): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    return data;
  }

  async function register(
    name: string,
    email: string,
    password: string,
  ): Promise<void> {
    await apiClient.post("/auth/register", { name, email, password });
  }

  async function forgotPassword(email: string): Promise<void> {
    await apiClient.post("/auth/forgot-password", { email });
  }

  async function verifyToken(
    token: string | null,
    type: "reset" | "setup",
  ): Promise<VerifyTokenResponse> {
    const { data } = await apiClient.post<VerifyTokenResponse>(
      "/auth/verify-token",
      { token, type },
    );
    return data;
  }

  async function resetPassword(
    token: string,
    password: string,
  ): Promise<void> {
    await apiClient.post("/auth/reset-password", { token, password });
  }

  async function setupPassword(
    token: string,
    password: string,
    name: string,
  ): Promise<void> {
    await apiClient.post("/auth/setup-password", { token, password, name });
  }

  async function changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    await apiClient.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  }

  async function getProfile(): Promise<UserProfileType> {
    const { data } = await apiClient.get<UserProfileType>("/auth/profile");
    return data;
  }

  async function updateProfile(name: string): Promise<void> {
    await apiClient.patch("/auth/profile", { name });
  }

  return {
    login,
    register,
    forgotPassword,
    verifyToken,
    resetPassword,
    setupPassword,
    changePassword,
    getProfile,
    updateProfile,
  };
}
