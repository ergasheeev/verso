import { Ambulance, Flame, Shield, AlertTriangle, Info, type LucideIcon } from "lucide-react";

// Single source of truth for the emergency list, shared by Services and
// Profile so the two cannot drift. Translated labels live under the "services"
// i18n section.
export interface EmergencyNumber {
  Icon: LucideIcon;
  key: "emergency_ambulance" | "emergency_fire" | "emergency_police" | "emergency_gas" | "emergency_tourism";
  number: string;
}

export const EMERGENCY_NUMBERS: EmergencyNumber[] = [
  { Icon: Ambulance,     key: "emergency_ambulance", number: "103" },
  { Icon: Flame,         key: "emergency_fire",      number: "101" },
  { Icon: Shield,        key: "emergency_police",    number: "102" },
  { Icon: AlertTriangle, key: "emergency_gas",       number: "104" },
  { Icon: Info,          key: "emergency_tourism",   number: "1219" },
];
