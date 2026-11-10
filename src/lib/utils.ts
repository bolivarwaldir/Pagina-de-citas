import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateES(date: Date): string {
  return date.toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Bogota",
  });
}

export function getTodayBogota(): Date {
  const now = new Date();
  // Get date in Bogota timezone
  const bogotaStr = now.toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
  return new Date(bogotaStr + "T00:00:00");
}
