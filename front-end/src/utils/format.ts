import { WEEK_DAYS } from "@/types/enums";
import type { TrainingAppointmentDto } from "@/types";

export function formatAppointment(appointment: TrainingAppointmentDto): string {
  return `${WEEK_DAYS[appointment.day]} ${appointment.time}`;
}