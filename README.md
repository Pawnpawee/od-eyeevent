# OWNDAYS Eye Event — Landing Page

Registration landing page for OWNDAYS Thailand's free eye-exam event.
Two routes, one Vercel deployment, one unified warm neutral design language.

This visit link: https://od-eyeevent.vercel.app/

| Route | Audience | Purpose |
|---|---|---|
| `/` | Customers (public) | Register for a free eye-exam appointment |
| `/admin` | HR / People Analytics | View registrations, stats, export data |


---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Deploy | Vercel |
| Database | Vercel Postgres (Neon) |
| Visit counter | Vercel KV (Redis) |
| Chart | Recharts |
| Export | SheetJS (`xlsx`) |
| Styling | Tailwind CSS v4 |
| Font | Anuphan (Google Fonts — Thai + Latin) |
| Icons | Heroicons (`@heroicons/react/24/outline`) |

---

## Design System

Warm neutral color ramp — zero blue on either page.

| Token | Hex | Usage |
|---|---|---|
| Ink | `#1a1917` | Headlines, borders, CTA buttons, primary text |
| White | `#ffffff` | Page bg, card bg |
| Cream | `#faf9f7` | Landing form section bg, button text |
| Sand | `#f0efec` | Admin page bg, stat cards, table headers |
| Stone | `#d6d3cd` | Input borders, dividers, card borders |
| Drift | `#a8a49d` | Icons, placeholders, metadata labels |
| Ash | `#6b6860` | Sublines, secondary text |
| Char | `#3d3b37` | Button hover, admin buttons |
| Clay | `#b44c3a` | Error messages only |

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Create `.env.local` in the project root (never commit this file):
```bash
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=
KV_REST_API_URL=
KV_REST_API_TOKEN=
ADMIN_PASSWORD=your_admin_password_here
```
Vercel Postgres + KV variables are injected automatically from the Vercel dashboard.
`ADMIN_PASSWORD` must be set manually — it gates the `/admin` route.


### 3. Run the dev server
```bash
npm run dev
```
- Landing page: [http://localhost:3000](http://localhost:3000)
- Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Project Structure

```
od-eyeevent/
├── app/
│   ├── page.tsx                        → Landing page (customer)
│   ├── admin/page.tsx                  → Admin dashboard (Server Component)
│   ├── api/
│   │   ├── register/route.ts           → POST: save registration
│   │   ├── registrations/route.ts      → GET: all registrations
│   │   ├── stores/route.ts             → GET: store list from DB
│   │   ├── pageviews/route.ts          → GET/POST: visit counter
│   │   ├── admin-auth/route.ts         → POST: validate admin password
│   │   └── migrate/route.ts            → GET: dev-only DB setup (delete before deploy)
│   ├── layout.tsx                      → Root layout, Anuphan font
│   └── globals.css                     → Tailwind base + overrides
├── components/
│   ├── HeroSection.tsx                 → Logo, headline, lens-circle decoration
│   ├── RegistrationForm.tsx            → 6-field form with province→branch cascade
│   ├── SuccessMessage.tsx              → Modal shown after successful registration
│   └── admin/
│       ├── AdminAuthGate.tsx           → Client-side password gate
│       ├── StatsCards.tsx              → Total regs, page views, top store
│       ├── RegistrationsTable.tsx      → Filterable table + export button
│       ├── StoreChart.tsx              → Horizontal bar chart by branch
│       └── ExportButton.tsx            → SheetJS .xlsx download
├── lib/
    ├── db.ts                           → Vercel Postgres client singleton
    └── stores.ts                       → Static store data (seed source)

```

---

## Key Implementation Details

### Registration form
- Province → Branch cascade: selecting province filters branch dropdown
- Phone auto-formatted as `0xx-xxx-xxxx`; dashes stripped before DB insert
- Email field strips non-email characters on input
- Duplicate email returns 409 → shown inline under the email field
- Success shows a modal overlay; on close, form resets and focus returns

### Admin auth
- Password stored in `ADMIN_PASSWORD` env var only (never in client code)
- `POST /api/admin-auth` validates server-side
- Session stored in `sessionStorage` — survives page refresh, clears on tab close

---

## AI Usage

Used Claude (Anthropic) as a code-generation assistant. I handled all design, architecture, and decision-making; AI handled the typing under my direction.

**My responsibilities:**
- Analyzed the brief and defined two deliverables (customer landing page + admin analyst view)
- Studied OWNDAYS's actual website to set the visual direction — warm neutral palette, Anuphan font, no blue
- Chose the full stack (Next.js 14, Vercel Postgres, KV, Recharts, SheetJS, Tailwind v4)
- Designed the system architecture: API routes, DB schema, province→branch cascade, session-based admin auth
- Created the 8-step build plan to sequence each piece in the right order
- Reviewed all generated code, tested locally, and fixed issues myself — e.g. validation edge cases, responsive breakpoints, TypeScript type errors

**What AI generated under my direction:**
- Component and API route code, following my file structure and architecture
- Tailwind markup and responsive layouts based on my design tokens
- Chart config (Recharts) and export logic (SheetJS) based on my data shape
- SQL migration script based on my schema design

**Workflow per step:**
1. I gave AI specific context — which file, what it does, which patterns to follow
2. AI generated the code
3. I reviewed, tested, and either approved or rewrote the parts that didn't work
4. Next step only after the current one was solid

AI accelerated the coding; the decisions, structure, and quality control were mine.

---

## What I'd improve with more time

### Security & Access
- Add authentication on `/admin` route (NextAuth or Vercel Auth)
  so only HR/People Analytics team can access registration data
- Add rate limiting on `/api/register` to prevent spam submissions

### Performance
- Optimization unuse code
- Cache `/api/stores` response at the edge (`revalidate = 3600`)
  currently fetches from Postgres on every request —
  store data rarely changes so 1-hour cache would reduce DB load significantly
- Dynamic imports for heavy components to reduce initial bundle size
  e.g. `next/dynamic` for Recharts (chart library) and SheetJS (export)
  since admin dashboard is not the primary page, load them only when needed
```ts
  const StoreChart = dynamic(() => import('@/components/admin/StoreChart'), {
    loading: () => Loading chart...
  })
  const ExportButton = dynamic(() => import('@/components/admin/ExportButton'))
```

### User Experience
- Email confirmation sent to customer after successful registration
  confirming their name, selected branch, and preferred date
- Add footer with OWNDAYS Thailand contact info,
  social links (Facebook, LINE), and store locator link

### Data & Analytics
- Pagination on admin table for large datasets
- GROUP BY province in addition to branch for regional insights
- Date range filter on admin dashboard (not just single date)
- Export filtered data by date range, not just current view

### Infrastructure
- Unit tests for all API routes
- Input sanitization middleware on all POST endpoints

---


