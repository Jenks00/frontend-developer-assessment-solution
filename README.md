# Schoolhouse — Student Management Dashboard

A small admin dashboard for a school administrator to browse classes, manage
enrollment, and look up student details. Built for the Frontend Developer
Practical Assessment.

## Setup

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). No backend or
database setup is required — the app runs entirely against a local mock API
(see below).

## Technologies

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS v4** with a custom warm/espresso color palette defined as
  CSS variables (`src/app/globals.css`)
- **Axios** for HTTP requests, wrapped in a small typed service layer
- **shadcn/ui** primitives (Base UI under the hood) for Button, Dialog,
  Select, Input, Table, Card, Badge
- **MSW (Mock Service Worker)** — provided in the starter — simulates the
  REST API entirely in the browser, including delays and error responses
- **lucide-react** for icons, **next/font** for `Fraunces` (headings) +
  `Inter` (body/UI)

No state-management library, form library, or data-fetching library was
added — the API surface is small enough that a handful of typed custom hooks
(`useClasses`, `useClass`, `useClassStudents`, `useStudent`, `useStudents`)
give the same loading/error/data shape everywhere without extra dependencies.

## Implementation notes

- **Data layer**: `src/services/*` wraps every endpoint in a typed function;
  `src/hooks/*` wraps each service call in a `{ data, isLoading, error,
  refetch }` hook. Components never call `axios`/`fetch` directly — this
  keeps data-fetching and UI cleanly separated and makes retry/refetch
  trivial to wire into error and empty states.
- **Search**: the class roster search is debounced (300ms) and hits the
  server-side `?search=` param on `GET /classes/:id/students` rather than
  filtering a client-side list, per the assessment's requirement.
- **Enroll dialog**: fetches the full student list only while the dialog is
  open (`useStudents(open)`), filters out students already in the class, and
  supports a client-side name/ID filter for picking a student quickly.
  Duplicate enrollment is prevented both by hiding already-enrolled students
  in the picker and by surfacing the API's 409 response if it still occurs.
- **Remove dialog**: a confirmation dialog with its own loading/error state,
  since removal is destructive.
- **Student details route**: `/students/[studentId]` is a real route reading
  the ID from the URL, so refreshing or sharing the link works. Rows in a
  class roster link to `/students/[id]?from=[classId]` so the details page
  can show a "back to class" link and resolve which class the student
  belongs to without an extra endpoint.
- **State persistence**: the currently viewed class persists in the URL
  itself (`/classes/[classId]`), and the last-viewed class ID is also cached
  in `localStorage` so it survives a full reload.
- **Navigation**: a fixed sidebar on desktop, a slide-in drawer (with
  backdrop, `Escape` to close, and auto-close on route change) on mobile.
  Active route is highlighted with `aria-current="page"`.
- **Loading / error / empty states**: every data-fetching hook exposes all
  three, and every page/section renders the matching `LoadingState`,
  `ErrorState` (with retry), or `EmptyState` component instead of ever
  showing a blank section. Buttons disable themselves during in-flight
  mutations (enroll/remove) to prevent double-submits.
- **Design**: a deliberate warm, dark-brown palette (see the `:root`
  variables in `globals.css`) rather than the starter's default neutral
  theme, paired with `Fraunces` for headings to avoid the generic
  blue-SaaS-dashboard look.

## Completed features

- Dashboard: total students, total classes, active students, quick access to
  classes
- Class overview: name, ID, enrolled count, student roster table
- Server-side student search by name or ID within a class
- Student details page with its own URL, working on direct navigation
- Enroll an existing student into a class (loading, success/error feedback,
  duplicate handling, list refresh)
- Remove a student from a class (confirmation dialog, loading, error
  feedback, list refresh)
- Responsive navigation (desktop sidebar / mobile drawer) with clear active
  state
- Loading, error (with retry), empty, and disabled states throughout

## Limitations

- No automated tests were added given the scope/time of the assessment.
- The enroll picker's client-side name/ID filter is not paginated; with the
  mock dataset size (50 students) this is not a problem, but a much larger
  school would want the same server-side search pattern used for the class
  roster.
- No optimistic UI on enroll/remove — the list refetches after the request
  resolves rather than updating immediately, which is simpler and safer
  against server-side validation failures at the cost of a brief extra wait.

## Further improvements

- Add pagination to the class roster for very large classes.
- Add TanStack Query to get request de-duplication, caching, and background
  revalidation for free instead of the current hand-rolled hooks.
- Add basic component/unit tests (e.g. enroll/remove flows, search
  debouncing) with Vitest + Testing Library.
- Optimistic updates for enroll/remove with rollback on failure.
