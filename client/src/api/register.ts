import { config } from "../config/config";

export async function registerUser(
  username: string,
  email: string,
  password: string
) {
  try {
    const data = {
      username,
      email,
      password,
    };

    const headers = {
      "Content-Type": "application/json",
    };
    const response = await fetch(`${config.SERVER}/register`, {
      method: "post",
      credentials: "include",
      headers,
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error(error);
  }
}
