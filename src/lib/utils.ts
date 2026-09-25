import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns the correct asset URL with basePath prefix when deployed.
 * Use this for all <img src> attributes instead of hardcoded paths.
 */
export function assetUrl(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
}
