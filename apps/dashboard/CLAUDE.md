# apps/dashboard — Admin Panel

Admin dashboard for managing the surf school. Deployed to Vercel.

## Stack

React 19 + Vite 6 + Tailwind CSS v4 + React Router 7 + TanStack Query + TanStack Table + Zustand + react-hook-form + zod + sonner (toasts)

## Auth

Uses Supabase Auth (`signInWithPassword`). Session state managed by `authStore` (Zustand) listening to `supabase.auth.onAuthStateChange()`. Protected by `ProtectedRoute` guard that checks session. `RoleGate` restricts by role.

Roles: `admin` (full CRUD except users) and `superadmin` (full CRUD including user management).

## Routes

| Path | Component | Access |
|------|-----------|--------|
| `/login` | `LoginPage` | Public |
| `/dashboard` | `DashboardHome` | admin, superadmin |
| `/dashboard/gallery` | `GalleryPage` | admin, superadmin |
| `/dashboard/packages` | `PackagesPage` | admin, superadmin |
| `/dashboard/bookings` | `BookingsPage` | admin, superadmin |
| `/dashboard/instructors` | `InstructorsPage` | admin, superadmin |
| `/dashboard/pricing` | `PricingPage` | admin, superadmin |
| `/dashboard/settings` | `SettingsPage` | admin, superadmin |
| `/dashboard/users` | `UsersPage` | superadmin only |

## Module Architecture

Feature-based structure. Each module in `src/modules/` contains:

```
modules/<feature>/
  api/<feature>.api.ts    — Supabase queries (select/insert/update/delete)
  hooks/use<Feature>.ts   — TanStack Query hooks wrapping the API
  pages/<Feature>Page.tsx — Page component with table + dialogs
  components/             — Feature-specific components (tables, forms, dialogs)
```

### Modules

- **auth** — Login, auth API, useLogin hook
- **bookings** — Bookings table, detail dialog, status updates (via Edge Function `update-booking-status`), instructor assignment (via Edge Function `assign-instructors`)
- **dashboard** — Home/overview page
- **gallery** — Gallery table, upload dialog (direct to Supabase Storage), edit/delete
- **instructors** — Instructors table, form with photo upload (Supabase Storage), delete
- **packages** — Packages table, create/edit form, delete
- **pricing** — Service pricing tiers table, create/edit/delete
- **settings** — Site settings (key-value pairs from `site_settings` table)
- **users** — Dashboard user management (superadmin only, creates users via Edge Function `admin-create-user`)

## Data Fetching Pattern

All API modules use `supabase-js` directly:

```typescript
// Example: modules/gallery/api/gallery.api.ts
supabase.from('gallery_items').select('*').order('sort_order')
supabase.from('gallery_items').insert({ ... })
supabase.from('gallery_items').update({ ... }).eq('id', id)
supabase.from('gallery_items').delete().eq('id', id)
supabase.storage.from('gallery').upload(path, file)
```

For operations requiring business logic, Edge Functions are called:
```typescript
supabase.functions.invoke('update-booking-status', { body: { booking_id, status } })
supabase.functions.invoke('assign-instructors', { body: { booking_id, instructor_ids } })
supabase.functions.invoke('admin-create-user', { body: { email, password, full_name, role } })
```

## Core Components

```
src/core/
  components/
    AppLayout.tsx     — Sidebar + Topbar + Outlet layout
    Sidebar.tsx       — Navigation sidebar with role-based menu items
    Topbar.tsx        — Top bar with user info and logout
    PageHeader.tsx    — Reusable page header with title + actions
  guards/
    ProtectedRoute.tsx — Checks Supabase Auth session, redirects to /login
    RoleGate.tsx       — Restricts access by user role
  store/
    authStore.ts       — Zustand store: user, session, isLoading, login/logout actions
  api/
    client.ts          — Supabase client instance (uses @surf-app/supabase)
```

## UI Components (local, shadcn/ui pattern)

Located in `src/components/ui/`. Based on Radix UI primitives. Components: alert, avatar, badge, button, card, dialog, dropdown-menu, form, input, label, select, separator, skeleton, table, tabs, textarea.

## Env Vars

```
VITE_SUPABASE_URL=https://uwvnrmjhjlzdnggljkoo.supabase.co
VITE_SUPABASE_ANON_KEY=...
VITE_BRAND_NAME=Surfers Lab CR
```
