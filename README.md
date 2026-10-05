# Missed Call Calculator

A one-page lead magnet for local service businesses. Owners enter a few numbers, see how much revenue they lose to missed calls each month and year, and then leave their contact details to learn about automatic missed-call text-back.

Built with Next.js (App Router), TypeScript, Tailwind CSS and Supabase. Ready to deploy on Vercel.

## How it works

- **Calculator**: `monthly_loss = calls_per_week × 4.3 × (miss_rate/100) × (booking_rate/100) × job_value`, `yearly = monthly × 12`. The result is rounded to the nearest dollar. Example: 40 calls, 25% missed, $400 job, 30% booking gives **$5,160/month**.
- **Lead form**: `POST /api/leads` validates input with zod, recomputes the loss on the server, and inserts a row into the Supabase `leads` table.
- **Spam protection**: a hidden honeypot field plus an in-memory per-IP rate limit (5 submissions per 10 minutes per server instance).
- **Health check**: `GET /api/health` reports whether lead storage is configured. It never returns the secret values.
- **Runs without env vars**: the calculator works fully. Until Supabase is configured, the form shows a friendly "not connected yet" message, because the API returns `503 Lead storage not configured`.

## Changing the trade

Edit `TRADE` at the top of `lib/config.ts`, for example `"plumbing business"` or `"dental practice"`. All page copy is kept in that file too.

## Setup

### 1. Create a Supabase project
Go to [supabase.com](https://supabase.com), create a new project, and wait for it to finish provisioning.

### 2. Create the table
In the Supabase dashboard, open **SQL Editor → New query**, paste the contents of `supabase/schema.sql`, and run it. This creates the `leads` table and turns on Row Level Security with no public policies, so only the server can write to it.

### 3. Set environment variables
```bash
cp .env.example .env.local
```
Fill in:

| Variable | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Your public URL, e.g. `https://calc.yourdomain.com` (use `http://localhost:3000` locally) |
| `SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role` key. **Server-only: never add a `NEXT_PUBLIC_` prefix.** |

### 4. Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000, submit the form, and confirm a row appears in Supabase under **Table Editor → leads**. `http://localhost:3000/api/health` should show `"leadStorageConfigured": true`.

### 5. Deploy to Vercel
1. Push this repo to GitHub and import it at [vercel.com/new](https://vercel.com/new). The framework is detected automatically.
2. Under **Settings → Environment Variables**, add the same three variables. Set `NEXT_PUBLIC_SITE_URL` to your production URL.
3. Deploy, then submit a test lead on the live site.

## Commands

- `npm run dev`: start the local dev server
- `npm run build`: production build
- `npm run lint`: run the linter

## Project layout

```
app/
  page.tsx              Hero, calculator and footer
  layout.tsx            SEO metadata (title, description, Open Graph)
  api/leads/route.ts    Validates, rate-limits and stores leads
  api/health/route.ts   Health check
components/             Calculator, inputs, animated result, lead form, footer
lib/
  config.ts             Trade wording and page copy
  calculator.ts         Loss formula and currency formatting
  leadSchema.ts         zod schemas shared by client and server
  rateLimit.ts          In-memory per-IP rate limiter
  supabaseAdmin.ts      Lazily created server-only Supabase client
supabase/schema.sql     Database migration
```

## Notes

- The rate limiter keeps its counts in memory, and each Vercel instance has its own copy. If spam becomes a problem, switch to a shared store such as Upstash Redis.
- The footer's privacy policy link is a placeholder (`PRIVACY_POLICY_URL` in `lib/config.ts`). Point it at your real policy before you promote the page.
