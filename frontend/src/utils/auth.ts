import axios from "axios";

const AUTH_TOKEN_KEY = "pongJwt";
const API_URL = "http://localhost:8090";

export function logoutUser() {
  clearAuthToken();
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

export async function is2faRequired(): Promise<boolean> {
  let responseState = false;
  await axios
    .get(`${API_URL}/auth/current`)
    .then(() => {
      responseState = false;
      return false;
    })
    .catch((error) => {
      if (error.request.responseText.includes("2FA needed"))
        responseState = true;
      return true;
    });
  return responseState;
}
