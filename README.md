This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## MiniShort (URL shortener)

This repo implements a small URL shortener with the following conventions (used by automated tests):

- `GET /healthz` → returns 200 JSON { ok: true, version: '1.0' }
- `POST /api/links` → create link (409 if custom code already exists)
- `GET /api/links` → list links
- `GET /api/links/:code` → get link stats
- `DELETE /api/links/:code` → delete link
- `GET /:code` → redirects (302) to target and increments click count

Required env vars: see `.env.example`.

Run locally:

```powershell
copy .env.example .env
# edit .env with your DATABASE_URL
npm install
npm run dev
```

The dashboard is at `/` and single-link stats are at `/code/:code`.
