# AccessMap

> One photo in. ADA risk signals out.

AccessMap is a hackathon-built concept app for quickly reviewing physical spaces for possible ADA compliance issues from a single image. It combines a landing page, a scan/report UI, and a lightweight Node server that powers the analysis flow.

[![License](https://img.shields.io/badge/license-MIT-D4960A?style=for-the-badge&logoColor=black)](LICENSE)
[![Node](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![INNOSpark](https://img.shields.io/badge/INNOSpark%20'26-Submission-D4960A?style=for-the-badge)](https://devpost.com)
## Highlights

- Landing page in `public/index.html`
- Analyzer UI in `public/annalyzer.html`
- Node backend in `src/server.js`
- Cleaner folder structure for frontend vs backend
- Built as a submission project for the INNOSpark Pitch Competition

## Project Layout

```text
AccessMap/
|-- public/
|   |-- index.html
|   `-- annalyzer.html
|-- src/
|   `-- server.js
|-- .gitignore
|-- LICENSE
|-- package.json
|-- package-lock.json
`-- README.md
```

## Why This Layout Is Better

- `public/` groups the UI files together, so visual work is easier to find.
- `src/` keeps backend logic away from presentation files.
- The repo root stays clean and easier to scan on GitHub.

## Quick Start

```bash
git clone https://github.com/Iceman-Dann/AccessMap.git
cd AccessMap
npm install
npm start
```

Then open `http://127.0.0.1:3000`.

## Scripts

```bash
npm start
```

This runs:

```bash
node src/server.js
```

## Notes

- Static pages are served from `public/`.
- API routes are handled by `src/server.js`.
- Local-only files like `.env` and `node_modules/` are ignored by git.

## License

MIT. See [LICENSE](LICENSE).
