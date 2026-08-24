import { authApi } from "@/lib/api/auth";
import type { UserPreferences } from "@/types/api";

export async function persistPreferences(
  preferences: Partial<UserPreferences>,
): Promise<UserPreferences> {
  return authApi.updateMe({ preferences });
}
