import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export class AuthService {
  static async login(credentials: { email: string; password: string }) {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  }

  static async register(userData: { email: string; password: string; name: string }) {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  }

  static async logout() {
    const response = await axios.post(`${API_URL}/auth/logout`);
    return response.data;
  }

  static async refreshToken() {
    const response = await axios.post(`${API_URL}/auth/refresh-token`);
    return response.data;
  }

  static async getCurrentUser() {
    const response = await axios.get(`${API_URL}/auth/me`);
    return response.data;
  }
}
