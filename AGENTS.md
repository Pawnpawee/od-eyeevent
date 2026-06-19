# AGENT.md — od-eyeevent
> This file is the single source of truth for the AI agent building this project.
> Read this fully before writing any code. Follow every decision listed here — do not improvise alternatives.

---

## Project Overview
Build a landing page for OWNDAYS Thailand where customers register for a free eye-exam event.
Deploy to Vercel. Two audiences, two pages, two different design languages.

| Page | Route | Audience | Design Style |
|---|---|---|---|
| Landing page | `/` | Customers (public) | OWNDAYS brand — minimal, black/white/gray |
| Analyst dashboard | `/admin` | HR / People Analytics (internal) | Same palette as landing — black/white/gray, no blue |

---

## Stack — Final Decisions (Do Not Change)

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSG pre-renders HTML for SEO, native Vercel support |
| Deploy | Vercel | Free, one-click, same platform as DB and KV |
| Database | Vercel Postgres (Neon) | Free tier, no 7-day pause (unlike Supabase), parameterized queries |
| Visit counter | Vercel KV (Redis) | Atomic increment, free tier, same platform |
| Chart | Recharts | Simple, React-native, no extra setup |
| Export | xlsx (SheetJS) | Client-side .xlsx export, one function call |
| Styling | Tailwind CSS | Faster responsive layout, consistent spacing, mobile-first |
| Font | Anuphan (Google Fonts) | Supports Thai + Latin, clean modern weight range |

---

## Project Structure

```
od-eyeevent/
├── app/
│   ├── page.jsx                     → Landing page (customer)
│   ├── admin/
│   │   └── page.jsx                 → Analyst dashboard
│   ├── api/
│   │   ├── register/
│   │   │   └── route.js             → POST: save registration to Vercel Postgres
│   │   ├── registrations/
│   │   │   └── route.js             → GET: read all registrations (admin)
│   │   └── pageviews/
│   │       └── route.js             → GET/POST: increment + read counter (Vercel KV)
│   ├── layout.jsx                   → Root layout, font import
│   └── globals.css                  → Tailwind base + global overrides
├── components/
│   ├── HeroSection.jsx
│   ├── RegistrationForm.jsx
│   └── SuccessMessage.jsx
│   └── admin/
│       ├── StatsCards.jsx
│       ├── RegistrationsTable.jsx
│       ├── StoreChart.jsx
│       └── ExportButton.jsx
├── lib/
│   └── db.js                        → Vercel Postgres client singleton
├── tailwind.config.js
├── .env.local                       → secrets (never commit)
└── README.md
```

---

## Part A — Landing Page `/`

### Hero Section
- Logo: text-based OWNDAYS wordmark — styled with letter-spacing, font-weight 300
- Headline: `ตรวจวัดสายตาฟรี — จองคิวได้เลยวันนี้`
- Subline: `มองชัดขึ้น ใช้ชีวิตได้เต็มที่ขึ้น ลงทะเบียนเลือกสาขาและวันที่สะดวก OWNDAYS พร้อมดูแลคุณ`
- Layout: centered, white background, generous padding

### Registration Form
| Field | Type | Validation |
|---|---|---|
| ชื่อ-นามสกุล | text | Required |
| อีเมล | email | Required + regex format |
| เบอร์โทรศัพท์ | tel | Required |
| สาขาที่สะดวก | select | Required |
| วันที่สะดวก | date | Required |


### On Submit Sequence
1. Client-side validation → show inline error messages per field
2. POST `/api/register` → insert row into Vercel Postgres
3. POST `/api/pageviews` → increment KV counter
4. Show `<SuccessMessage />` — replace form, do not redirect

---

## Part B — Admin Dashboard `/admin`

### Stat Cards (3)
- Total Registrations — count from Postgres
- Page Views — read from Vercel KV
- Most Popular Store — GROUP BY store, take MAX

### Bar Chart
- Library: Recharts `<BarChart>`
- X axis: store name
- Y axis: registration count
- Data: fetched from `/api/registrations`

### Registrations Table
| Name | Email | Phone | Store | Preferred Date | Registered At |
|---|---|---|---|---|---|

### Filter Controls
- Dropdown: filter by store (All Stores + each branch)
- Date input: filter by preferred_date
- Filtering happens client-side on fetched data — no extra API call

### Export Button
- Library: SheetJS (`xlsx`)
- Exports currently filtered data as `.xlsx`
- Filename: `owndays-registrations-YYYY-MM-DD.xlsx`

### Visit Counter
- Increments on every `/` page load via `useEffect` → POST `/api/pageviews`
- Displayed in admin stat card

---

## Design System

### Font
```js
// tailwind.config.js
fontFamily: {
  sans: ['Anuphan', 'sans-serif'],
}
```
```jsx
// app/layout.jsx
import { Anuphan } from 'next/font/google'
const anuphan = Anuphan({ subsets: ['thai', 'latin'], weight: ['300', '400', '500', '700'] })
```

---

## Color Palette — Warm Neutral Ramp (Both Pages)

> Zero blue anywhere. Both pages share the same warm neutral system.

### Core Ramp
| Token | Value | Replaces | Usage |
|---|---|---|---|
| Ink | `#1a1917` | `#000000` | Headlines, borders, CTA button bg, primary text |
| White | `#ffffff` | — | Page background, card background, button text |
| Cream | `#faf9f7` | `#f5f5f5` | Landing form section bg, modal button text, inner lens circle |
| Sand | `#f0efec` | `#f8f9fa` | Admin page bg, stat card bg, table header, chart cursor |
| Stone | `#d6d3cd` | `#e0e0e0` | Input borders, dividers, card borders, grid lines |
| Drift | `#a8a49d` | `#999999`, `#aaaaaa` | Icon color, placeholder, label text, metadata |
| Ash | `#6b6860` | `#666666` | Sublines, secondary text, body copy |
| Char | `#3d3b37` | `#333333` | Button hover states, admin buttons, filter borders |

### Semantic
| Token | Value | Replaces | Usage |
|---|---|---|---|
| Clay | `#b44c3a` | `#cc0000` | Error messages, validation errors only |
| Moss | `#5a7a5e` | `#28a745` | Success states (reserved) |
| Ochre | `#c4973b` | `#ffc107` | Warning states (reserved) |

---

## Design Language A — Landing Page `/` (OWNDAYS Brand)

> Minimal Japanese aesthetic. Warm neutral only. No blue. No rounded corners.

### Color Assignments — Landing Page
| Element | Value |
|---|---|
| Background | `#ffffff` |
| Form section bg | `#faf9f7` (Cream) |
| Headlines | `#1a1917` (Ink) |
| Subtext | `#6b6860` (Ash) |
| Input borders | `#d6d3cd` (Stone) |
| Input focus border | `#1a1917` (Ink) |
| Placeholder | `#a8a49d` (Drift) |
| Icons | `#a8a49d` (Drift) |
| CTA button | `bg-[#1a1917] text-[#faf9f7]` |
| CTA hover | `bg-[#3d3b37]` |
| Error text | `#b44c3a` (Clay) |
| Modal overlay | `bg-[#1a1917]/50` |

### Interaction States — Landing Page
| Element | Default | Hover | Focus |
|---|---|---|---|
| CTA button | `bg-[#1a1917] text-[#faf9f7]` | `bg-[#3d3b37]` | `outline-[#1a1917]` |
| Input / Select | `border-[#d6d3cd] text-[#1a1917]` | `border-[#a8a49d]` | `border-[#1a1917] outline-none` |

### Typography — Landing Page
| Element | Tailwind Classes |
|---|---|
| Logo wordmark | `text-xl font-light tracking-[0.3em] uppercase` |
| Hero headline | `text-3xl md:text-5xl font-medium tracking-tight text-[#1a1917]` |
| Subline | `text-base md:text-lg font-light text-[#6b6860]` |
| Form label | `text-xs font-medium tracking-[0.15em] uppercase text-[#6b6860]` |
| Body | `text-base font-normal` |
| Error message | `text-xs text-[#b44c3a] mt-1` |

### Layout Rules — Landing Page
| Rule | Value |
|---|---|
| Section padding | `py-16 px-6 md:px-12` |
| Form max width | `max-w-lg mx-auto` |
| Border radius | `rounded-none` — sharp corners everywhere |
| Input border | `border border-[#d6d3cd] rounded-none` |
| Input focus | `focus:border-[#1a1917] focus:outline-none focus:ring-0` |

---

## Design Language B — Admin Dashboard `/admin` (Functional UI)

> Internal tool. Prioritize readability and scannability over brand aesthetics.

### Color Assignments — Admin Dashboard
| Element | Value |
|---|---|
| Page background | `#f0efec` (Sand) |
| Card background | `#ffffff` |
| Card border | `#d6d3cd` (Stone) |
| Stat card bg | `#f0efec` (Sand) |
| Stat card label | `#a8a49d` (Drift) |
| Stat card number | `#1a1917` (Ink) |
| Table header bg | `#f0efec` (Sand) |
| Table border | `#d6d3cd` (Stone) |
| Table alt/hover row | `#faf9f7` (Cream) |
| Primary text | `#1a1917` (Ink) |
| Labels / meta | `#a8a49d` (Drift) |
| Admin buttons | `bg-[#3d3b37] text-[#faf9f7] hover:bg-[#1a1917] rounded-[4px]` |
| Filter focus | `border-[#3d3b37]` |

---

## globals.css — Required Overrides

```css
@import "tailwindcss";

@theme {
  --font-sans: 'Anuphan', sans-serif;
}

/* Warm neutral ring color — overrides Tailwind's default blue */
* {
  --tw-ring-color: #1a1917;
}

/* Remove browser default blue outline on inputs */
input:focus,
select:focus,
textarea:focus {
  outline: none;
}
```

---

## API Routes — Behavior Spec

### POST `/api/register`
```js
// Input (JSON body)
{ name, email, phone, store, preferred_date }

// Server-side validation: all fields required, email format check
// On success: INSERT into registrations, return { success: true }
// On error: return { error: 'message' } with appropriate status code

// Parameterized query (SQL injection safe):
await sql`INSERT INTO registrations (name, email, phone, store, preferred_date)
          VALUES (${name}, ${email}, ${phone}, ${store}, ${preferred_date})`
```

### GET `/api/stores`
```js
// Returns all stores ordered by region ASC, display ASC
await sql`SELECT id, branch, province, display, region FROM stores ORDER BY region, display`
```

### GET `/api/registrations`
```js
// Returns all rows ordered by created_at DESC
await sql`SELECT * FROM registrations ORDER BY created_at DESC`
```

### POST `/api/pageviews` — increment
```js
await kv.incr('pageviews')
```

### GET `/api/pageviews` — read
```js
const count = await kv.get('pageviews')
```

---

## Database Schema

Run both tables once via Vercel Postgres query editor before first deploy.

### Table: stores
```sql
CREATE TABLE IF NOT EXISTS stores (
  id       VARCHAR(100) PRIMARY KEY,
  branch   VARCHAR(255) NOT NULL,
  province VARCHAR(255) NOT NULL,
  display  VARCHAR(255) NOT NULL
);
```

Seed stores — use `GET /api/migrate` (dev only) which seeds from `lib/stores.ts` automatically.

### Table: registrations
```sql
CREATE TABLE IF NOT EXISTS registrations (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(255) NOT NULL,
  email          VARCHAR(255) NOT NULL UNIQUE,
  phone          VARCHAR(50)  NOT NULL,
  store_id       VARCHAR(100) NOT NULL,
  branch         VARCHAR(255) NOT NULL,
  province       VARCHAR(255) NOT NULL,
  preferred_date DATE         NOT NULL,
  created_at     TIMESTAMP    DEFAULT NOW()
);
```

- `email` has a UNIQUE constraint — duplicate inserts return Postgres error code `23505` → API returns 409 Conflict
- `store_id`, `branch`, `province` stored separately to support GROUP BY province or branch in admin dashboard
- Store source of truth is `lib/stores.ts` — seeded via `GET /api/migrate`; dropdown fetches from `GET /api/stores`
- `region` column was removed from stores table — province field is used for grouping

---

## Security Rules
| Concern | Implementation |
|---|---|
| SQL injection | Vercel Postgres tagged template literals only — never string concatenation |
| XSS | React JSX renders escaped by default — never use `dangerouslySetInnerHTML` |
| Input validation | Client-side for UX + server-side in API route for security |
| Secrets | All credentials in `.env.local` only — never hardcoded |
| Admin auth | Password stored in `ADMIN_PASSWORD` env var; validated server-side via `POST /api/admin-auth`; client stores session in `sessionStorage` |

---

## Environment Variables
```bash
# .env.local — never commit this file
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=
KV_REST_API_URL=
KV_REST_API_TOKEN=
ADMIN_PASSWORD=
```
All provided automatically when you connect Vercel Postgres + Vercel KV in the Vercel dashboard.

---

