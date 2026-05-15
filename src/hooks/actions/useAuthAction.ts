const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useAuthAction() {
  async function verifyToken(token: string | null, type: "reset" | "setup"): Promise<{ valid: boolean; name: string; email: string }> {
    await delay(1500);
    console.log("verify token", { token, type });
    const valid = !!token && token.length >= 10;
    return { valid, name: "John Doe", email: "john@example.com" };
  }

  async function resetPassword(token: string, password: string): Promise<void> {
    await delay(1000);
    console.log("reset password", { token, password });
  }

  async function setupPassword(token: string, password: string, name: string): Promise<void> {
    await delay(1000);
    console.log("setup password", { token, password, name });
  }

  return { verifyToken, resetPassword, setupPassword };
}
