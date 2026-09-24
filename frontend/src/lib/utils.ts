import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "UZS"): string {
  if (currency === "UZS") return new Intl.NumberFormat("uz-UZ").format(amount) + " so'm";
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export function truncate(text: string, length: number): string {
  return text.length > length ? text.slice(0, length) + "…" : text;
}
