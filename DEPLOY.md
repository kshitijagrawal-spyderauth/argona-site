# Deploying to Cloudflare Pages

This is a static site — no build step required.

## First deploy

1. Push this folder to a GitHub/GitLab repo (or use `wrangler pages deploy .` directly).
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**, pick the repo.
3. Build settings:
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: `/`
4. Add your custom domain under **Custom domains** once the first deploy succeeds.

## Enabling the "Get a Quote" form

The form posts to `/api/quote`, a Cloudflare Pages Function that emails submissions via [Resend](https://resend.com).

1. Create a free Resend account and verify a sending domain (or use their shared test domain while testing).
2. In Cloudflare Pages → your project → **Settings → Environment variables**, add:
   - `RESEND_API_KEY` — your Resend API key
   - `QUOTE_TO_EMAIL` — the inbox that should receive quote requests (e.g. `sales@arvonachemicals.com`)
3. Redeploy. Until these are set, the form will show a friendly "not configured yet" error instead of failing silently.

## Before going live

- Replace the placeholder phone number (`+91 00000 00000`) in `index.html` with a real number.
- Add real product photos — the product cards currently use a placeholder icon in place of photography.
- Confirm `sales@arvonachemicals.com` is the correct contact address, and that the domain in that address matches whatever you register.
