import type { WeekDay } from "../enums";

export type TrainingAppointmentDto = {
  day: number;
  time: string;
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

export type AddUpdatePlanDto = {
  title: string;
  description: string;
  trainerId: number;
  sportId: number;
  appointments: TrainingAppointmentDto[];
};