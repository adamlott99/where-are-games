export interface HostingSlot {
  id: number;
  host_name: string;
  host_address: string;
  hosting_date: string;
  additional_notes?: string;
  created_at: string;
}

export interface CreateHostingSlotRequest {
  host_name: string;
  host_address: string;
  hosting_date: string;
  additional_notes?: string;
}

export interface LoginRequest {
  password: string;
}

export interface LoginResponse {
  token: string;
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
