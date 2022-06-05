import jwt_decode from 'jwt-decode'
import axios from 'axios'

const AUTH_TOKEN_KEY = 'pongJwt'

export function logoutUser() {
    clearAuthToken();
}

export function setAuthToken(token: string) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getAuthToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function clearAuthToken(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function isLoggedIn(): Boolean {
    let authToken = getAuthToken();
    console.log(`MY JEW TOKEN IS : ${authToken}`)
    return !!authToken;
}