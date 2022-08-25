import type { User } from "../config/types";

export function storeLocalUser(user: User) {
  window.sessionStorage.setItem("knowledge_user", JSON.stringify(user));
}

export function removeLocalUser() {
  window.sessionStorage.removeItem("knowledge_user");
}

export function getLocalUser(): User | null {
  const data = window.sessionStorage.getItem("knowledge_user");
  return data ? JSON.parse(data) : null;
}
