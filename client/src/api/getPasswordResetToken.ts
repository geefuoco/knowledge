import { config } from "../config/config";

export async function getPasswordResetToken(
  email: string
): Promise<number | null> {
  try {
    const response = await fetch(
      `${config.SERVER}/api/v1/user/reset-password`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );
    return response.status;
  } catch (error) {
    console.error(error);
  }
  return null;
}
