# Sr 007 Chronospace

Marketing site for Sr 007 Chronospace. Next.js, styled with Tailwind CSS, statically generated and hosted on Vercel.

|           |                        |
| --------- | ---------------------- |
| Framework | Next.js + Tailwind CSS |
| Hosting   | Vercel                 |
| Analytics | None                   |
| Forms     | None                   |

## Before you start

You need Node.js 20 or newer and a code editor. That is it.

If you only want to change text or swap an image, you can do that on GitHub in the browser and skip the local setup entirely — see "Editing without installing anything" below. To add whole new pages, see "Building new pages with AI".

## Running the site locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The page reloads as you save files.

Two other commands worth knowing:

```bash
npm run build   # production build, the same one Vercel runs
npm run lint    # catches the mistakes that would fail the build
```

If `npm run build` passes locally, the deployment passes too.

## Changing content

The copy lives in the section components under `src/components/`. Each section of the page is its own component, so a text change rarely touches more than one file. Edit the text, save, done.

**Images** live in `public/`. To swap one, drop the new file in with the same name, or add a new file and update the path where it is used. Prefer `.webp` where you can and keep images under 500 KB so the page stays fast.

**Page title, description and social preview** (the image shown when the link is shared) are set in the exported `metadata` object at the top of each `page.tsx`. Update these before any campaign — they are what people see in search results and on social.

## Editing without installing anything

For small text changes:

1. Open the file on GitHub
2. Click the pencil icon
3. Make your change and click "Commit changes"
4. Choose "Create a new branch and start a pull request"

You get a preview link within a minute or two to check the result. Merge the pull request when it looks right and it goes live. If it looks wrong, close the pull request and nothing happens to the live site.

## Adding a page

Create `src/app/<route>/page.tsx`. The App Router turns it into `/<route>`. Copy an existing page as your starting point — it already has the layout, metadata and styling wired up. Add a link to it in the navigation and the footer, and give it its own title and description.

## Adding a section to an existing page

Sections are components in `src/components/`. Copy the closest existing one, rename it, add its content, and place it in the page in the order you want it to appear. Reaching for a copy before writing something from scratch is what keeps the site visually consistent.

## Building new pages with AI

Two context files ship in the repo root so an AI coding tool can extend this site without inventing its own style:

| File        | What is in it                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------ |
| `design.md` | Colours, typography scale, spacing, breakpoints, and the component rules the site is built on          |
| `spec.md`   | What the site is, what each section is for, the voice and positioning, technical setup and constraints |

Open the repo in your AI coding tool of choice and reference them in your prompt:

```
Read design.md and spec.md.
Add a pricing page with three tiers, following the existing components and tone.
```

The output comes back matching the rest of the site instead of looking like a generic template. Two habits worth keeping:

- **Review the diff before merging.** Open it as a pull request, look at the preview URL, then merge. That is the whole safety net you need.
- **Keep the two files current.** If your positioning or palette changes, update `design.md` and `spec.md` first — everything generated afterwards inherits the change.

## Deploying

The repo is connected to Vercel:

- **Push to `main`** and it deploys to production automatically, usually in under two minutes.
- **Open a pull request** and you get a preview URL for that branch. Nothing reaches the live site until the pull request is merged.
- **Rolling back**: in the Vercel dashboard open Deployments, find the last good one and click "Promote to Production". Takes seconds and needs no developer.

## Environment variables

If the project uses any, copy `.env.example` to `.env.local` for local development. The same variables are set in Vercel under Settings → Environment Variables. After changing one in Vercel you have to redeploy for it to take effect.

## Forms

_No form provider is wired up yet._ When you add one (Formspree, Basin, a serverless route, …), note here where submissions go and, if it sends email, that the sending-domain DNS records must move with the domain if you ever change DNS providers — otherwise submissions stop arriving.

## Analytics

_No analytics is installed yet._ When you add a tool (Vercel Analytics, Plausible, GA4, …), note it here and how to track a new event, so the next person does not have to reverse-engineer it. If it collects personal data, add the cookie/consent notice the law in your market requires.

## Something is wrong

**Build fails on Vercel.** Open the failing deployment and read the log — the error is usually the last few lines and names the file. Running `npm run build` locally reproduces it.

**An image does not show up.** Check the path. A file at `public/logo.svg` is referenced as `/logo.svg`, without `public`.

**A change is not visible on the live site.** Check that the deployment finished in Vercel, then hard refresh. If the deployment is green and the change is still missing, you are probably looking at a preview URL rather than production.

## What this project is not

- There is no CMS. Content changes go through this repo, as described above.
- There are no user accounts, database or backend.
- The site is statically generated, so it is fast and there is nothing to patch on a schedule.

Extending any of this is straightforward — it just was not part of the original scope.

## Questions

_Add a contact here for whoever maintains this site._
