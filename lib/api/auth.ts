import apiClient from './axios'
import type { ApiResponse, AuthResponse, ApiUser } from '@/lib/types'

// ─── Auth API ─────────────────────────────────────────────────────────────────

export interface RegisterData {
  name: string
  email: string
  password: string
  phoneNumber?: string
}

export interface LoginData {
  email: string
  password: string
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data)
  return res.data.data
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data)
  return res.data.data
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout')
}

export async function getMe(): Promise<ApiUser> {
  const res = await apiClient.get<ApiResponse<{ user: ApiUser }>>('/users/me')
  return res.data.data.user
}

export async function updateMe(data: Partial<ApiUser>): Promise<ApiUser> {
  const res = await apiClient.patch<ApiResponse<{ user: ApiUser }>>('/users/updateMe', data)
  return res.data.data.user
}
