"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/auth-provider";
import { useTheme, type ThemePreference } from "@/lib/theme/theme-provider";
import { cn } from "@/utils/cn";

const themeOptions: Array<{ value: ThemePreference; label: string }> = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Account preferences and future integrations."
      />

      <div className="grid gap-4">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold">Account</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Profile details from the authenticated session.
              </p>
            </div>
            <Badge tone="success">Signed in</Badge>
          </div>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Name
              </dt>
              <dd className="mt-1 text-sm font-medium">{user?.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Email
              </dt>
              <dd className="mt-1 text-sm font-medium">{user?.email}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-base font-semibold">Preferences</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Theme preference is stored locally on this device.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTheme(option.value)}
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
      </div>
    </div>
  );
}
