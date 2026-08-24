"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/auth-provider";
import { SUPPORTED_CURRENCIES } from "@/lib/currency/currency";
import { useCurrency } from "@/lib/currency/currency-provider";
import { usePreferenceActions } from "@/lib/preferences/use-preference-actions";
import { TIMEZONE_OPTIONS } from "@/lib/timezone/timezone";
import { useTimezone } from "@/lib/timezone/timezone-provider";
import { useTheme, type ThemePreference } from "@/lib/theme/theme-provider";
import { cn } from "@/utils/cn";

const themeOptions: Array<{ value: ThemePreference; label: string }> = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export default function SettingsPage() {
  const { logout } = useAuth();
  const { theme } = useTheme();
  const { preference, detectedTimezone } = useTimezone();
  const { currency } = useCurrency();
  const { updateTheme, updateTimezone, updateCurrency } = usePreferenceActions();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Preferences sync to your account and apply on every device."
      />

      <div className="grid gap-4">
        <Card>
          <h2 className="text-base font-semibold">Preferences</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Theme, timezone, and default currency are stored on your account.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateTheme(option.value)}
                className={cn(
                  "rounded-[var(--radius-md)] border px-3 py-2.5 text-sm font-medium transition-colors",
                  theme === option.value
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-muted",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-semibold">Regional</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Timezone affects how dates are shown. Default currency is used for
            new expenses until you pick another currency on the expense or an AI
            assistant clarifies a different unit.
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="timezone-select"
                className="text-sm font-medium text-foreground"
              >
                Timezone
              </label>
              <select
                id="timezone-select"
                value={preference}
                onChange={(event) => updateTimezone(event.target.value)}
                className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-card px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="auto">Auto-detect ({detectedTimezone})</option>
                {TIMEZONE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Dates are stored in UTC on the server.
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="currency-select"
                className="text-sm font-medium text-foreground"
              >
                Default currency
              </label>
              <select
                id="currency-select"
                value={currency}
                onChange={(event) =>
                  updateCurrency(event.target.value as typeof currency)
                }
                className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-card px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {SUPPORTED_CURRENCIES.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Amounts are stored as numbers with currency in a separate field.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold">Integrations</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Slack and other integrations will be configured here. Credentials
                stay on the backend.
              </p>
            </div>
            <Badge>Coming soon</Badge>
          </div>
          <div className="mt-5 rounded-[var(--radius-md)] border border-dashed border-border px-4 py-5">
            <p className="text-sm font-medium">Slack</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Connect a channel and choose message format when the integrations
              API is available.
            </p>
            <Button className="mt-4" variant="secondary" disabled>
              Connect Slack
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-semibold">Security</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign out discards the access token on this device. Server-side
            revocation is not enabled yet.
          </p>
          <Button
            className="mt-5"
            variant="outline"
            onClick={() => void logout()}
          >
            Log out
          </Button>
        </Card>
      </div>
    </div>
  );
}
