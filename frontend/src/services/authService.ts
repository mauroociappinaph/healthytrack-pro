import { api } from './api';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    bio?: string;
    avatar?: string;
    preferences?: string;
  };
}

export const authService = {
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async updateProfile(data: Partial<AuthResponse['user']>) {
    const response = await api.patch('/auth/profile', data);
    return response.data;
  },

  async changePassword(data: any) {
    const response = await api.patch('/auth/password', data);
    return response.data;
  },
};
