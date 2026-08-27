"use client";

import { AuthProvider } from "@/lib/auth/auth-provider";
import { CurrencyProvider } from "@/lib/currency/currency-provider";
import { PreferencesSync } from "@/lib/preferences/preferences-sync";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { TimezoneProvider } from "@/lib/timezone/timezone-provider";
import { StoreProvider } from "@/lib/store/provider";
import { ToastProvider } from "@/components/shared/toast";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TimezoneProvider>
        <CurrencyProvider>
          <StoreProvider>
          <AuthProvider>
            <PreferencesSync />
            <TooltipProvider>
              <ToastProvider>{children}</ToastProvider>
              <Toaster position="bottom-center" />
            </TooltipProvider>
          </AuthProvider>
          </StoreProvider>
        </CurrencyProvider>
      </TimezoneProvider>
    </ThemeProvider>
  );
}
