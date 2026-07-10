export type StaffDto = {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  username: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  imageUrl?: string | null;
};

export type AddStaffDto = {
  firstName: string;
  lastName: string;
  birthDate: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  image?: File;
};

export type UpdateStaffDto = {
  firstName: string;
  lastName: string;
  birthDate: string;
  username: string;
  email: string;
  phoneNumber: string;
};