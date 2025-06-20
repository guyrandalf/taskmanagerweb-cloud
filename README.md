This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Video Link

https://youtu.be/Y4XvM01F_-8

## Overview

As a software engineer, I’m documenting my development process to build scalable web applications. I created a task management web dashboard where users can log in/out with session checks in cloud storage (supabase), view and complete tasks also from local shorage with strike-through indicators and toast alerts, and add new tasks, all with a responsive UI styled using custom CSS.

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

## Development Environment

I used Visual Studio Code for coding and Git/GitHub for version control. The programming language is TypeScript with NextJS 15 as the framework, and I utilized libraries like @supabase/supabase-js for database interaction and Prisma for ORM, managed with pnpm.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Useful Websites

- [Supabase Documentation](https://supabase.com)
- [Prisma Documentation](https://prisma.io)
- [Nextjs Documentation](https://nextjs.org)

# Future Work

- Enhance error handling for network issues with Supabase.
- Add user profile management via Supabase Auth.
- Implement task deletion confirmation dialogs.
