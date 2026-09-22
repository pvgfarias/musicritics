# MusiCritics 🎵

> Rate and discover new music.

**Live demo:** [musicritics.vercel.app](https://musicritics.vercel.app)

MusiCritics is a social platform for rating and discovering music — [1–2 sentences on the core idea: e.g. "users can rate albums, write reviews, follow other listeners, and build a public profile of their taste."]

## Features

- 🔐 **Authentication** — secure sign-up/login via `better-auth`
- ⭐ **Ratings & reviews** — [describe: rate albums/tracks/artists, leave written reviews]
- 👥 **Social layer** — [describe: follow users, activity feed, comments — fill in what actually exists]
- 🖼️ **Media uploads** — image handling via Cloudinary
- 📧 **Email notifications** — transactional email via Brevo
- 🔎 **Search** — [describe how users find albums/artists — command palette (⌘K) noted on the live site]
- 🌗 **Light/dark theme**

## Tech Stack

**Frontend**

- [Next.js 16](https://nextjs.org/) (App Router) + React 19
- Tailwind CSS 4
- Radix UI / `@base-ui` primitives, `class-variance-authority`
- `react-hook-form` + `Zod` for form validation
- Motion for animation

**Backend & Data**

- Prisma ORM 7 with the Neon serverless Postgres adapter
- `better-auth` for authentication
- Cloudinary for image storage/optimization
- Brevo for transactional email

**Tooling**

- TypeScript, ESLint, Prettier
- pnpm workspaces

## Architecture Notes

A few decisions worth calling out:

- **Neon + Prisma's serverless adapter** over a traditional connection pool — chosen for cold-start performance on Vercel's serverless functions
- **better-auth** over NextAuth — better for modern applications

## Getting Started

```bash
# clone the repo
git clone https://github.com/pvgfarias/musicritics.git
cd musicritics

# install dependencies
pnpm install

# set up environment variables
cp .env.example .env
# fill in DATABASE_URL, auth secrets, Cloudinary keys, Brevo API key, etc.

# run database migrations
pnpm prisma migrate dev

# (optional) seed the database
pnpm prisma db seed

# start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Screenshots

## License

[Add a license, e.g. MIT, or note "Personal project — not licensed for reuse" if you'd rather keep it closed.]
