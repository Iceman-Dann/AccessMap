# AccessMap

AccessMap is a hackathon-built concept app for reviewing physical spaces for likely ADA compliance issues from a single image.

It now supports:
- local Node development with `src/server.js`
- static frontend delivery from `public/`
- Vercel deployment with serverless API routes in `api/`

## Structure

```text
AccessMap/
|-- api/
|   |-- analyze.js
|   |-- chat.js
|   |-- fix-guide.js
|   `-- status.js
|-- public/
|   |-- annalyzer.html
|   `-- index.html
|-- src/
|   `-- server.js
|-- .gitignore
|-- LICENSE
|-- package-lock.json
|-- package.json
|-- README.md
`-- vercel.json
```

## Local Development

```bash
npm install
npm start
```

Then open:

```text
http://127.0.0.1:3000
```

For local Gemini access, set:

```powershell
$env:GEMINI_API_KEY="your_real_key_here"
npm start
```

## Vercel Deployment

This repo is structured to work on Vercel:
- `public/` serves the frontend
- `api/*.js` exposes the backend endpoints
- `vercel.json` rewrites `/analyze` to `/annalyzer.html`

Set this environment variable in Vercel:

```text
GEMINI_API_KEY
```

After deployment, these routes should work:
- `/`
- `/annalyzer.html`
- `/analyze`
- `/api/status`
- `/api/analyze`
- `/api/chat`
- `/api/fix-guide`

## Notes

- The frontend already talks to `/api/...` when hosted over HTTP/HTTPS.
- `src/server.js` exports the same handlers used by the Vercel API routes.
- `.env` is ignored and not required for Vercel.

## License

MIT. See [LICENSE](LICENSE).
