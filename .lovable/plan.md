

## Problem

The "Auth session missing" error occurs because **you are not logged in**. Looking at the network requests, all calls to Supabase use only the **anon key** (no user JWT token), confirming there is no authenticated session.

The Parent Dashboard at `/parent` has **no auth guard** — it renders for anyone, even unauthenticated visitors. When you try to add a child, `useChildProfiles` calls `supabase.auth.getUser()`, which throws `AuthSessionMissingError` because there's no session.

## Root Cause

Two issues:
1. **No route protection** — `/parent` doesn't redirect unauthenticated users to `/auth`
2. **No graceful handling** — the add child flow crashes instead of prompting login

## Plan

### 1. Add auth guard to ParentDashboard
In `src/pages/ParentDashboard.tsx`:
- Use `useAuth()` to check `user` and `loading`
- While `loading`, show a spinner
- If `user` is null, redirect to `/auth` (with a return URL so they come back after login)

### 2. Add auth guard to KidsDashboard  
Same pattern for `src/pages/KidsDashboard.tsx` since it also queries user-specific data.

### 3. Defensive check in useChildProfiles
In `src/hooks/useChildProfiles.ts`, update the query to check for a session first via `useAuth()` user state, and skip the query (`enabled: !!user`) when not authenticated. Same for the `addChild` mutation — use the `user.id` from `useAuth()` context instead of calling `supabase.auth.getUser()` which throws.

This ensures:
- Unauthenticated users are redirected to login
- No cryptic "auth session missing" errors
- After login, users return to the dashboard and can add children

