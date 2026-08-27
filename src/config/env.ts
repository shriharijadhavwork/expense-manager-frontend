export const appConfig = {
  apiUrl:
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    "http://localhost:5050/api/v1",
  appName: "Flux",
  tagline: "Go live. Spend. — We'll keep score.",
} as const;
