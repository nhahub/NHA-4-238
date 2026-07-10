export type MemberDto = {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  imageUrl?: string | null;
  activeSubscriptions?: number | null;
  totalAttendedSessions?: number | null;
};

export type AddMemberDto = {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  image?: File;
};

export type UpdateMemberDto = {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phoneNumber: string;
};

export type ChangePasswordDto = {
  oldPassword: string;
  newPassword: string;
};