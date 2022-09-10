import { config } from "../config/config";

type SignedUrl = {
  fields: {
    Policy: string;
    "X-Amz-Algorithm": string;
    "X-Amz-Credential": string;
    "X-Amz-Date": string;
    "X-Amz-Signature": string;
    bucket: string;
    key: string;
  };
  url: string;
};

export async function getSignedUrl(): Promise<SignedUrl | null> {
  try {
    const response = await fetch(`${config.SERVER}/get-signed-url`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  } catch (error) {
    console.error(error);
  }
  return null;
}
