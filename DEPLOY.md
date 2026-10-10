# Deploying Tradot Academy

Static Astro site on **Cloudflare Pages** (free tier). No server code.

## 1. Push the code to GitHub

The repo must be on GitHub (or GitLab) for Cloudflare to build it.

## 2. Create the Cloudflare Pages project

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → pick the repo.
2. Build settings:
   | Setting | Value |
   |---|---|
   | Framework preset | Astro |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Production branch | `main` |
3. **Environment variables** (Production and Preview):
   | Name | Value |
   |---|---|
   | `NODE_VERSION` | `22` |
   | `SITE_URL` | `https://<the-real-domain>` (e.g. `https://tradotacademy.com`) |
4. Save and deploy. You get a `*.pages.dev` URL to check.

`SITE_URL` sets canonical URLs, Open Graph links, `sitemap.xml`, `robots.txt`, and where the news fallback reads
the last good headlines from. Without it the build uses the placeholder in `astro.config.mjs`.

## 3. Connect the client's domain

1. Pages project → **Custom domains** → **Set up a custom domain** → enter the domain (and `www.` if wanted).
2. If the domain's DNS is on Cloudflare, records are added automatically. Otherwise add the CNAME Cloudflare shows
   at the client's registrar.
3. Wait for the SSL certificate to become **Active**.
4. Set `SITE_URL` to the final domain and redeploy.

## 4. Scheduled rebuilds for Market News

Headlines are fetched at build time, so the site must rebuild to refresh them.

1. Pages project → **Settings** → **Builds & deployments** → **Deploy hooks** → **Add deploy hook** (branch `main`).
   Copy the URL.
2. GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:
   `CF_DEPLOY_HOOK` = the hook URL.
3. `.github/workflows/rebuild-news.yml` then triggers a rebuild every 30 minutes during market hours on weekdays and
   once each evening (about 360 builds/month; the free tier allows 500). Run it by hand from the **Actions** tab to test.

If both feeds fail during a build, the site reuses the headlines from the live `/news.json`; if that also fails,
it shows "News unavailable". A feed failure never fails the build.

## 5. After going live

- Submit `https://<domain>/sitemap.xml` in Google Search Console.
- Test a link preview (WhatsApp / LinkedIn) to check the Open Graph image.
- Check the contact form opens WhatsApp on a phone.
