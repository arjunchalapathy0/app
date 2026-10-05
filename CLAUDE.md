# Missed Call Calculator

A lead-magnet web app for local service businesses. It shows owners how much revenue they lose to missed calls, then captures their contact info so I can offer an automatic missed-call text-back service.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase (Postgres) for storing leads
- Deployed on Vercel

## Commands
- npm run dev: start the local dev server
- npm run build: production build (must pass before you finish any task)
- npm run lint: run the linter

## Rules
- Keep it simple. Do not add libraries unless clearly necessary (zod is fine).
- Never hardcode secrets. Use environment variables only.
- The Supabase service role key is server-only. Never import it in client code or expose it with a NEXT_PUBLIC_ prefix.
- Validate all user input on both the client and the server.
- Mobile-first design, tested at 375px width. Accessible: labels on every input, visible focus states, good color contrast.
- Keep the trade wording (e.g. "home service business") in a single config file so it can be swapped per trade.
- The app must build and run with no env vars set.

## Calculator logic
monthly_loss = calls_per_week * 4.3 * (miss_rate / 100) * (booking_rate / 100) * job_value
yearly_loss = monthly_loss * 12
Round to the nearest dollar. Treat empty or invalid input as 0 and clamp negatives.
Sanity check: 40 calls, 25% miss, $400 job, 30% booking is about $5,160/month.

## Workflow
- Work step by step: scaffold, UI, API and database, then polish and README.
- After each meaningful change, run npm run build and fix any errors before moving on.
- Before finishing a task, verify the acceptance checklist in the build prompt.
- Ask me only if something is truly blocking. Otherwise make a reasonable choice and note it in your summary.

## Code style
- TypeScript strict mode, no any unless justified.
- Small, focused components. Put shared logic in lib/.
- Descriptive names, short comments only where the reason isn't obvious.
