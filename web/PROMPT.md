You are scaffolding a mobile-first React TypeScript app using Vite, Tailwind, and shadcn/ui (latest).
Keep dependencies minimal.
Allowed third-party libs ONLY:
- @auth0/auth0-react
- react-router
- react-hook-form
- zod
- @reduxjs/toolkit
- react-redux
- axios
- sonner

## Goal
MVP for a Loyalty Hub with two apps:
- Member Web (mobile-first)
- Admin Web (minimal)

Auth via Auth0 Universal Login (handled by Auth0). Exclude auth endpoints from BE design.

## Architecture & Rules (Redux-first)
- Use Redux Toolkit with TypeScript. Feature slices: `auth`, `profile`, `earnRequests`, `miles`, `tiers`, `ui/toast`.
- Absolutely NO API calls inside React components.
- Components may only read via typed selectors (`useAppSelector`) and dispatch typed thunks/actions (`useAppDispatch`).
- API calls live in `src/lib/http.ts` (single axios instance + interceptors) and RTK async thunks under `src/features/**/thunks.ts`.
- Business logic in thunks/reducers; components are presentational.

## Auth & Onboarding
- After login (Google mail via Auth0 Universal Login):
  1. FE calls `GET /api/v1/users/profile` with access token.
  2. If `profile.onboarded` is `true` → navigate `/home`.
  3. If `profile.onboarded` is `false` → navigate `/onboarding`.
- Onboarding submit:
  - Call `PUT /api/v1/customer/onboard` with `{ first_name, last_name, phone, address, referrer_code? }`
  - On 200 → mark `profile.onboarded = true` in Redux and navigate `/home`.
  - If error → handled by `ui/toast` middleware (see below).
- Post-Login Auth0 Action still maps `event.user.app_metadata.onboarded` to a namespaced ID token claim:
  - ENV: `VITE_AUTH0_ONBOARDED_CLAIM` (default `https://loyalty.yourapp.com/onboarded`)
  - Treat missing/falsey as `false`.

## Redux Middleware (Error Toast)
- Middleware `errorToastMiddleware`:
  - On any action with `payload` type `ApiError` and `payload.message` is non-null:
    - Call `toast.error(payload.message)` from `sonner`.
  - Import `toast` from `sonner` (shadcn/ui latest).
  - Registered in `src/app/store.ts`.

Example:
```ts
import { Middleware } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { ApiError } from '@/types';

export const errorToastMiddleware: Middleware = () => next => action => {
  if (action?.payload && (action.payload as ApiError)?.message) {
    toast.error((action.payload as ApiError).message);
  }
  return next(action);
};
```

# Member Features (this MVP)
## Pages (mobile-first)

- Home: profile summary (name/phone), current miles, current tier badge, quick links.
- Profile: view/edit fields except email (immutable).
- Earn Miles: form submit manual earn request.
- History: list Earn Requests, filters (status/date), pagination.
- Tier: show current tier, period window (start/end), miles_to_keep, miles_to_upgrade, target tier.

## Redux State (examples)

```ts
AuthState {
isAuthenticated: boolean
user?: Auth0User // includes namespaced claim
accessToken?: string
status: 'idle'|'loading'|'succeeded'|'failed'
error?: string
}
ProfileState {
data?: { email: string; first_name: string; last_name: string; phone: string; address: string; onboarded: boolean }
status: 'idle'|'loading'|'succeeded'|'failed'
error?: string
}
EarnRequestsState {
items: Array<{ id: string; requested_points: number; status: 'pending'|'approved'|'rejected'; reject_reason?: string; created_at: string }>
filters: { status?: 'pending'|'approved'|'rejected'; from?: string; to?: string; page: number; page_size: number }
createStatus: 'idle'|'submitting'|'succeeded'|'failed'
listStatus: 'idle'|'loading'|'succeeded'|'failed'
error?: string
}
MilesState {
balance: number
progress?: {
current_tier: string
current_miles: number
miles_to_keep: number
miles_to_upgrade: number
upgrade_target_tier?: string
remaining_days: number
period_start: string
period_end: string
}
status: 'idle'|'loading'|'succeeded'|'failed'
error?: string
}
TiersState {
rules: Array<{ code: string; name: string; min_points: number; keep_points_in_period: number; period_days: number }>
status: 'idle'|'loading'|'succeeded'|'failed'
error?: string
}
UIState {
toast?: { type: 'success'|'error'|'info'; message: string }
}

## Selectors

- selectIsAuthenticated, selectIsOnboarded, selectProfile, selectMiles, selectTierRules, selectEarnRequests, selectToast.

## Thunks (Member)

- profile/getProfile (GET /api/v1/users/profile)
- profile/completeOnboarding (PUT /api/v1/customer/onboard)
- miles/getProgress (GET /api/v1/me/miles)
- tiers/getRules (GET /api/v1/tiers)
- earnRequests/create (POST /api/v1/me/earn-requests)
- earnRequests/list (GET /api/v1/me/earn-requests?status&from&to&page&page_size)

## Admin Features (minimal in this prompt)

Routes under `/admin` (guarded):
- admin/earn-requests (list + approve/reject with reason)
- admin/customers (filter by tier)
- admin/api-keys (create/list/revoke)

## Axios instance & interceptors

- Single src/lib/http.ts with axios.
- Request interceptor: attach Authorization: Bearer <accessToken> from Redux if URL starts with VITE_API_BASE_URL. If missing, dispatch auth/fetchAccessToken first.
- Response interceptor:
  - On first 401: silent token renewal via auth/fetchAccessToken, replay once.
  - If still 401: dispatch auth/logout, navigate /login.
- BE error shape: { code: string; message: string; invalid_fields?: Record<string,string> } → handled by errorToastMiddleware.

## Routing & Guards

- /* catch-all decides: if authenticated → check onboarded; else /login.
- /login: Sign in button → loginWithRedirect()
- /onboarding: AuthGuard only
- /home, /profile, /earn, /history, /tier: AuthGuard + OnboardingGuard
- /admin/*: AdminGuard

## UI & Forms

- Style: Follow Human Interface Guidelines for layout, spacing, and typography.
- Keep a youthful e-commerce vibe with palette (Primary #0F4C81, Accent #FFD166, Mint #2ED3B7, Coral #FF7A70).
- Tailwind + shadcn/ui, dark mode supported.
- Forms: react-hook-form + zod with inline errors; toast on API failure.
- Buttons full-width on mobile; large touch targets.

## ENV (strict)

VITE_AUTH0_DOMAIN
VITE_AUTH0_CLIENT_ID
VITE_AUTH0_AUDIENCE
VITE_API_BASE_URL
VITE_APP_ENV = development | staging | production
VITE_AUTH0_CLAIM_NAMESPACE

## Project Structure

```bash
src/
app/
store.ts
hooks.ts
router.tsx
guards/
AuthGuard.tsx
OnboardingGuard.tsx
AdminGuard.tsx
config/env.ts
features/
auth/ { slice.ts, thunks.ts, selectors.ts, types.ts }
profile/ { slice.ts, thunks.ts, selectors.ts, types.ts }
miles/ { slice.ts, thunks.ts, selectors.ts, types.ts }
tiers/ { slice.ts, thunks.ts, selectors.ts, types.ts }
earnRequests/ { slice.ts, thunks.ts, selectors.ts, types.ts }
ui/ { slice.ts, selectors.ts }
lib/
http.ts
auth0.ts
pages/
Login.tsx
Onboarding.tsx
Home.tsx
Profile.tsx
EarnMiles.tsx
EarnHistory.tsx
Tier.tsx
components/
forms/ProfileForm.tsx
forms/EarnRequestForm.tsx
ui/Toast.tsx
ui/ThemeToggle.tsx
styles/globals.css
```

## Contracts (TypeScript)

```ts
type MemberProfile = {
id: string; email: string; first_name: string; last_name: string; phone: string; address: string; onboarded: boolean;
miles_balance: number; tier_code: string; tier_period_start: string; tier_period_end: string;
}
type EarnRequest = {
id: string; requested_points: number; status: 'pending'|'approved'|'rejected';
reject_reason?: string; created_at: string; decided_at?: string;
}
type TierRule = { code: string; name: string; min_points: number; keep_points_in_period: number; period_days: number; }
type TierProgress = {
current_tier: string; current_miles: number; miles_to_keep: number; miles_to_upgrade: number;
upgrade_target_tier?: string; remaining_days: number; period_start: string; period_end: string;
}
type ApiError = { code: string; message: string; invalid_fields?: Record<string,string>; }
```

## Acceptance Criteria

- After login, GET /api/v1/users/profile determines navigation.
- Onboarding PUT /api/v1/customer/onboard sets onboarded=true.
- All API errors toast automatically via middleware.
- No API calls in components; all via typed thunks.
- Mobile-first, HIG discipline, e-commerce vibe.
