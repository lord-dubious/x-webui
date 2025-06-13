import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Use relative path for API calls since frontend and backend are on the same port
export const domain = process.env.NEXT_PUBLIC_DOMAIN || ""
