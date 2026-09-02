# WorkerDeck site

The public landing page for [WorkerDeck](https://github.com/temidayoxyz/workerdeck).

## Local development

```bash
npm install
npm run dev
```

## Quality gate

```bash
npm run lint
npm run typecheck
npm run build
```

## Deployment

Every push to `main` builds and deploys the site to GitHub Pages through the workflow in
`.github/workflows/pages.yml`.

The site is a static Vite application and can also be deployed to Cloudflare Workers Static Assets
or any standards-compliant static host.
