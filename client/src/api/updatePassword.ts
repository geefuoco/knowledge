import { config } from "../config/config";

export async function updatePassword(
  password: string,
  token: string
): Promise<number | null> {
  try {
    const response = await fetch(
      `${config.SERVER}/api/v1/user/update-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, token }),
      }
    );
    return response.status;
  } catch (error) {
    console.error(error);
  }
  return null;
}
