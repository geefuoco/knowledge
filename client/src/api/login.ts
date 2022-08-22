const SERVER = "http://192.168.2.210:5000";

type User = {
  id: number;
  email: string;
  password?: string;
  bio?: string;
  avatar?: string;
};

export async function loginToServer(
  email: string,
  password: string
): Promise<User | null> {
  try {
    const response = await fetch(`${SERVER}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  } catch (error) {
    console.error("Error while trying to log in to server");
    return null;
  }
}
