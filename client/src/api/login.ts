import type { User } from "../config/types";
import { config } from "../config/config";

export async function loginToServer(
  email: string,
  password: string
): Promise<User | null> {
  try {
    const response = await fetch(`${config.SERVER}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    return response.json();
  } catch (error) {
    console.error("Error while trying to log in to server");
    return null;
  }
}
