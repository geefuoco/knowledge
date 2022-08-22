import { config } from "../config/config";

export async function logoutUser() {
  try {
    await fetch(`${config.SERVER}/logout`, {
      method: "post",
      credentials: "include",
    });
  } catch (error) {
    console.error(error);
  }
}
