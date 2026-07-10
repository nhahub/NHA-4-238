export type Role = "Admin" | "Staff" | "Member";


export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface AuthUser {
  id: number;
  email: string | null;
  fullName: string;
  role: Role;
  imageUrl: string | null; 
}

export interface LoginResponseDto {
  id: number;
  email: string | null;
  fullName: string;
  role: string | null;
  accessToken: string | null;
  expiresIn: number | null;
  imageUrl: string | null; 
}

export interface RegisterMemberRequest {
  firstName: string;
  lastName: string;
  birthDate: string; // yyyy-MM-dd
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  image?: File;
}