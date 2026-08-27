function deriveWsUrl(apiUrl: string): string {
  const configured = process.env.NEXT_PUBLIC_WS_URL?.replace(/\/$/, "");
  if (configured) {
    return configured;
  }

  try {
    const url = new URL(apiUrl);
    return `${url.protocol}//${url.host}`;
  } catch {
    return "http://localhost:5050";
  }
}

export const appConfig = {
  apiUrl:
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    "http://localhost:5050/api/v1",
  wsUrl: deriveWsUrl(
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
      "http://localhost:5050/api/v1",
  ),
  appName: "Flux",
  tagline: "Go live. Spend. — We'll keep score.",
} as const;
