import axios from "axios";

const AUTH_TOKEN_KEY = "pongJwt";
const API_URL = "http://localhost:8090";

export function logoutUser() {
  axios.post(`${API_URL}/auth/logout`).then(r => );
  // clearAuthToken();
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
  document.cookie =
    `${AUTH_TOKEN_KEY}=` + ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
}

export function isLoggedIn(): boolean {
  const authToken = getAuthToken();
  return !!authToken;
}

export async function is2faRequired(): Promise<boolean> {
  axios.defaults.withCredentials = true;
  return axios
    .get(`${API_URL}/auth/current`)
    .then((response) => {
      console.log(response);
      console.log("You're Connected");
      return false;
    })
    .catch((error) => {
      console.log(error);
      if (error.request.responseText.includes("2FA needed")) {
        return true;
      } else {
        console.log("Not Connected");
        return false;
      }
    });
}
