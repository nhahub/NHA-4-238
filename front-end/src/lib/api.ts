import { getToken } from "@/lib/auth-storage";
import { LoginResponseDto } from "@/types/auth";


export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
  statusCode: number;
};


export type Plan = {
  id: number;
  title: string;
  description: string;
  trainerId: number;   
  trainerName: string;
  sportId: number;     
  sport: string;
  appointments: TrainingAppointmentDto[];
};

export const WEEK_DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type TrainingAppointmentDto = {
  day: number;
  time: string;
};


export type AddUpdatePlanDto = {
  title: string;
  description: string;
  trainerId: number;
  sportId: number;
  appointments: TrainingAppointmentDto[];
};

export type PackageOption = {
  id: number;
  title: string;
  description: string;
  price: number;
  numberOfMonthes: number;
  numberOfSessions: number;
  planId: number;
  planTitle: string;
  sport?: string | null;
};

export type AddUpdatePackageDto = {
  title: string;
  description: string;
  price: number;
  numberOfMonthes: number;
  numberOfSessions: number;
  planId: number | null;
};

export type Trainer = {
  id: number;
  name:string;
  title: string;
  description: string;
  yearsOfExperience: number;
  sport: string;
  sportId: number;
  imageUrl: string;
};

export type AddTrainerDto = {
  name: string;
  title: string;
  description: string;
  yearsOfExperience: number;
  sportId: number;
  image: File;
};

export type UpdateTrainerDto = {
  name: string;
  title: string;
  description: string;
  yearsOfExperience: number;
  sportId: number;
  image?: File;
};

export type Sport = {
  id: number;
  name:string;
  description: string;
  imageUrl: string;
};

export type AddSportDto = {
  name: string;
  description: string;
  image: File;
};

export type UpdateSportDto = {
  name: string;
  description: string;
  image?: File;
};

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

export type ChangePasswordDto = {
  oldPassword: string;
  newPassword: string;
};

export type Subscription = 
{
  id:number;
  memberName : string;
  email:string;
  planName:string;
  startDate:string;
  endDate:string;
  status:string;
  paid:number;
}

export type MemberAttendanceDto = {
  id: number;
  name: string;
  phoneNumber: string;
  attended: boolean;
};

export type TodaySessionDto = {
  planId: number;
  sessionId: number;
  trainerName: string;
  planName: string;
  time: string;
  members: MemberAttendanceDto[];
};

export type MemberSessionsDto = {
planId: number;
sessionId: number;
trainerName: string;
planName: string;
date: string;
time: string;
attended: boolean; 
}

export type MemberCalendar = {
recentSessions: MemberSessionsDto[];
upcomingSessions: MemberSessionsDto[];
}

export type MonthlyActivity = {
  month: string;
  numberOfAttendedSessions: number;
};

export type MemberDashboard =
{

  joinedBefore: number;
  activeSubscriptions: number;
  monthAttendance:number;
  totalSpend: number;
  recentSessions: MemberSessionsDto[];
  upcomingSessions: MemberSessionsDto[];
  monthlyActivity: MonthlyActivity[];
}

interface MonthlyRevenue {
  revenue: number;
  month: string;
}

interface SportSubscribersDto {
  sport: string;
  activeSubscriptions: number;
}

interface SubscriptionDto {
  id: number;
  memberName?: string;
  email?: string;
  planName: string;
  startDate: string;
  endDate: string;
  status: string;
  paid: number;
}

interface AdminDashboardDto {
  todaySessionsList: TodaySessionDto[];
  monthlyRevenues: MonthlyRevenue[];
  sportSubscribers: SportSubscribersDto[];
  lastSubscriptions: SubscriptionDto[];
  totalRevenue: number;
  totalMembers: number;
  activeSubscriptions: number;
  currentMonthSubscriptions: number;
  totalPlans: number;
  totalPackages: number;
  totalTrainers: number;
  todaySessions: number;
}


export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:5046";

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { ...authHeaders() },
  });
  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !body.success) {
    throw new Error(body.message || "API request failed");
  }

  return body.data;
}

async function apiForm<T>(
  path: string,
  method: "POST" | "PUT",
  formData: FormData
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: { ...authHeaders() }, // no Content-Type — fetch sets the multipart boundary itself
    body: formData,
  });

  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !body.success)
    throw new Error(body.message);

  return body.data;
}

async function apiDelete(path: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });

  const body = (await response.json()) as ApiResponse<null>;

  if (!response.ok || !body.success)
    throw new Error(body.message);
}

export async function apiJson<T>(
  path: string,
  method: "POST" | "PUT",
  body: unknown
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !data.success)
    throw new Error(data.message);

  return data.data;
}
function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  plans: () => apiGet<Plan[]>("/api/Plan/Plans"),
  packages: () => apiGet<PackageOption[]>("/api/Package/Packages"),
  trainers: () => apiGet<Trainer[]>("/api/Trainer/Trainers"),
  sports: () => apiGet<Sport[]>("/api/Sport/Sports"),
  members: () => apiGet<MemberDto[]>("/api/Account/Members"),
  subscriptions: () => apiGet<Subscription[]>("/api/Subscription/Subscriptions"),
    sport: (id:number)=>
        apiGet<Sport>(`/api/Sport/${id}`),

    createSport:(formData:FormData)=>
        apiForm<Sport>("/api/Sport","POST",formData),

    updateSport:(id:number,formData:FormData)=>
        apiForm<Sport>(`/api/Sport/${id}`,"PUT",formData),

    deleteSport:(id:number)=>
        apiDelete(`/api/Sport/${id}`),

    trainer:(id:number)=>
        apiGet<Trainer>(`/api/Trainer/${id}`),

    createTrainer:(formData:FormData)=>
        apiForm<Trainer>("/api/Trainer","POST",formData),

    updateTrainer:(id:number,formData:FormData)=>
        apiForm<Trainer>(`/api/Trainer/${id}`,"PUT",formData),

    deleteTrainer:(id:number)=>
        apiDelete(`/api/Trainer/${id}`),

    plan:(id:number)=>
        apiGet<Plan>(`/api/Plan/${id}`),

   
createPlan: (body: AddUpdatePlanDto) =>
    apiJson<Plan>("/api/Plan", "POST", body),

updatePlan: (id: number, body: AddUpdatePlanDto) =>
    apiJson<Plan>(`/api/Plan/${id}`, "PUT", body),

    deletePlan:(id:number)=>
        apiDelete(`/api/Plan/${id}`),

    package:(id:number)=>
        apiGet<PackageOption>(`/api/Package/${id}`),
   
createPackage: (body: AddUpdatePackageDto) =>
    apiJson<PackageOption>("/api/Package", "POST", body),

updatePackage: (id: number, body: AddUpdatePackageDto) =>
    apiJson<PackageOption>(`/api/Package/${id}`, "PUT", body),

    deletePackage:(id:number)=>
        apiDelete(`/api/Package/${id}`),

    member: (id: number) => apiGet<MemberDto>(`/api/Account/Member/${id}`),
    createMember: (formData: FormData) =>
  apiForm<LoginResponseDto>("/api/Account/Member", "POST", formData),
   deleteMember: (id: number) => apiDelete(`/api/Account/Member/${id}`),
   updateMember: (id: number, body: UpdateMemberDto) => apiJson<MemberDto>(`/api/Account/Member/${id}`, "PUT", body),
   staffList:     () => apiGet<StaffDto[]>("/api/Account/Staffs"),
   createStaff:    (formData: FormData) => apiForm<StaffDto>("/api/Account/Staff", "POST", formData),
    updateStaff:      (id: number, body: UpdateStaffDto) => apiJson<StaffDto>(`/api/Account/Staff/${id}`, "PUT", body),
changePassword: (id: number, body: ChangePasswordDto) => apiJson<void>(`/api/Account/${id}/Password`, "PUT", body),
updateImage:    (id: number, formData: FormData) => apiForm<string>(`/api/Account/${id}/Image`, "PUT", formData),
deleteImage:    (id: number) => apiDelete(`/api/Account/${id}/Image`),
deleteStaff:         (id: number) => apiDelete(`/api/Account/Staff/${id}`),
createSubscription: (body: { memberId: number; packageId: number }) =>
    apiJson<Subscription>("/api/Subscription", "POST", body),

memberSubscriptions: (memberId: number) =>
    apiGet<Subscription[]>(`/api/Subscription/Member/${memberId}`),
todaySessions: () =>
    apiGet<TodaySessionDto[]>("/api/Session/Today"),

markAttendance: (body: { sessionId: number; memberId: number }) =>
    apiJson<void>("/api/Session", "POST", body),
memberCalendar: (memberId: number, year: number, month: number) =>
    apiGet<MemberCalendar>(`/api/Member/Calendar/${memberId}?year=${year}&month=${month}`),
memberDashboard: (memberId: number) =>
    apiGet<MemberDashboard>(`/api/Member/Dashboard/${memberId}`),

AdminDashboard: () =>
    apiGet<AdminDashboardDto>(`/api/Admin/Dashboard`),

generateSessions: (daysAhead: number) =>
  apiJson<number>("/api/Session/Generate", "POST", { daysAhead }),

};

export function formatAppointment(appointment: TrainingAppointmentDto) {
  return `${WEEK_DAYS[appointment.day]} ${appointment.time}`;

}
