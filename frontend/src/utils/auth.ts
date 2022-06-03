import jwt_decode from 'jwt-decode'
import axios from 'axios'

const REST_ENDPOINT = 'http://localhost:8090/'
const AUTH_TOKEN_KEY = 'pongJWT'

export function logoutUser() {
    clearAuthToken()
}

export function setAuthToken(token: string) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function getAuthToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY)    
}

export function clearAuthToken() {
    axios.defaults.headers.common['Authorization'] = ''
    localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function isLoggedIn() {
    let authToken = getAuthToken()
    return !!authToken
}

// export function getUserInfo() {
//     if (isLoggedIn()) {
//         return jwt_decode(getAuthToken())
//     }
// }