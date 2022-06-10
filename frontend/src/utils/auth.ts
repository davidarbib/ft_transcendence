const AUTH_TOKEN_KEY = "pongJwt";
export function logoutUser() {
  clearAuthToken();
}

export function setAuthToken(token: string) {
  document.cookie = `${AUTH_TOKEN_KEY}=${token}`;
}

export function getAuthToken(): string | null {
  const cookieArr = document.cookie.split(";");

  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].split("=");

    if (AUTH_TOKEN_KEY == cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}

export function clearAuthToken(): void {
  document.cookie = `${AUTH_TOKEN_KEY}=`;
}

export function isLoggedIn(): boolean {
  const authToken = getAuthToken();
  return !!authToken;
}
