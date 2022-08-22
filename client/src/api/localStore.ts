export function storeLocalUser(userId: number) {
  window.sessionStorage.setItem("knowledge_user", userId.toString());
}

export function removeLocalUser() {
  window.sessionStorage.removeItem("knowledge_user");
}

export function getLocalUser(): number | null {
  const data = window.sessionStorage.getItem("knowledge_user");
  if (data) {
    return Number(data);
  }
  return null;
}
