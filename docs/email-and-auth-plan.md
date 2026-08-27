# Email, OTP & Password Reset — Frontend Notes

Canonical plan:

→ `expense-manager-backend/docs/email-and-auth-plan.md`

## Current state

**Batches E0–E5 done** on backend + FE for invites, OTP, password reset, and invite handoff.

Configure `EMAIL_PROVIDER=smtp` for real delivery (console is blocked in production).

## Frontend batches

| Batch | Focus | Status |
|-------|--------|--------|
| **FE-E1** | Invite sent toast | **done** |
| **FE-E2** | OTP verify + resend | **done** |
| **FE-E3** | Forgot / reset password | **done** |
| **FE-E4** | Logged-out invite handoff | **done** |
