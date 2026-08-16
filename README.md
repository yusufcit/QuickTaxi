# Quick Taxi Website

Production-oriented Next.js application for Quick Taxi (Ireland), with a booking request workflow and Supabase-backed admin management.

## Core Rules

- No online payment.
- No fare calculation.
- No public price display.
- Customer submits a booking request.
- Admin contacts customer manually by WhatsApp/phone with a quote.
- Booking is only confirmed after manual admin confirmation.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Auth)
- Zod (validation)
- Resend (admin email notifications)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env.local
```

3. Create Supabase schema from [supabase/schema.sql](supabase/schema.sql).

4. Start dev server:

```bash
npm run dev
```

## Admin Access

- Admin login route: `/admin/login`
- Protected admin routes: `/admin/*`
- Role mapping table: `admin_users`

## Booking Flow

1. Customer submits request via `/book`.
2. Request is validated server-side.
3. Booking reference is generated and saved in PostgreSQL.
4. Admin notification entry is created.
5. Optional email notification is sent through Resend.
6. Admin reviews and updates status in dashboard.

## Security Notes

- Server-side validation with Zod.
- Admin authorization checks on protected APIs.
- Honeypot and lightweight rate limiting on public booking endpoint.
- No secrets are exposed in frontend code.

## Scripts

- `npm run dev`
- `npm run lint`
- `npm run build`
- `npm run start`
