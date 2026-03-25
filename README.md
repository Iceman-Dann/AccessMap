# AccessMap
### AI-powered ADA compliance intelligence. One photo. Every violation. Zero guessing.

> **INNOSpark '26 · HackHazards '26**  
> Built with Gemini 2.5 Flash Vision · Node.js · Vanilla JS

---

## The Problem

4,195 ADA lawsuits were filed in the United States in 2023 alone — up 320% over the past decade. The average settlement costs a business $50,000. A repeat violation triggers federal fines up to $181,071.

The businesses getting sued aren't negligent corporations. They're restaurants, gyms, clinics, barbershops, and corner stores — small businesses run by people who had no practical way to know their space was non-compliant.

**The existing solution is broken.** An ADA compliance consultant charges $5,000, takes three weeks to show up, and hands you a PDF you don't know what to do with. For a small business owner running on thin margins, that's not a solution — it's a luxury.

We talked to 14 business owners and operators before building this. The same pattern kept coming up:

- A deli owner in Queens whose contractor signed off on a renovation, but never flagged that the bathroom turn radius was still non-compliant
- A gym owner in Brooklyn whose members had been complaining about a curb for months — he didn't know it was an ADA issue
- A property manager in Jersey City who needed a way to screen which locations were worth a formal audit before new tenants moved in
- An urgent care admin in Manhattan who wanted a fast first pass before calling an expensive specialist

**The law exists. The standards exist. What doesn't exist is a way for an ordinary business owner to know — in real time, from their own phone — whether their space is putting someone in a wheelchair on the other side of a door they can't open.**

---

## Why This Matters To Us

My uncle has used a wheelchair his entire life. We tried to take him to a new restaurant. He couldn't get through the front door. Two inches too narrow. The owner had no idea.

That wasn't an isolated incident. It was a symptom of a systemic gap: 61 million Americans live with a disability, and the infrastructure meant to protect their access to public spaces is invisible to the very businesses responsible for maintaining it. We built AccessMap to close that gap — not to exploit the lawsuit problem, but to end it.

---

## The Solution

**AccessMap is the first visual ADA compliance scanner powered by AI.**

Upload a photo of any physical space. In under 30 seconds, AccessMap:

1. Classifies the scene type (parking lot, entrance, restroom, corridor, ramp, sidewalk, elevator, retail counter)
2. Runs a targeted ADA checklist for that specific space type against 847 federal standards
3. Flags every visible violation with exact ADA 2010 citation, severity rating, and fix cost estimate
4. Generates a step-by-step contractor remediation guide per finding
5. Scores your legal exposure from 0–100
6. Lets you query an AI chat assistant about your specific report

No consultant. No site visit. No invoice. Just a photo.

---

## What Makes It Different

| Traditional ADA Inspection | AccessMap |
|---|---|
| $5,000 consultant fee | Free |
| 3-week wait for site visit | 30 seconds |
| Generic PDF report | Scene-specific findings with exact citations |
| No follow-up support | AI chat for every question about your report |
| No remediation guidance | Per-finding contractor brief generated instantly |

No tool on the market does this visually. Every existing solution requires a human on-site. AccessMap is the first to replace that with a phone camera and a 3-pass AI pipeline.

---

## Technical Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PHOTO UPLOAD  │───▶│ SCENE CLASSIFIER│───▶│  ADA ANALYSIS   │
│  Client-side    │    │ Gemini 2.5 Flash│    │ Gemini 2.5 Flash│
│  preprocessing  │    │ 8 scene types   │    │ 847-rule DB     │
└─────────────────┘    └─────────────────┘    └────────┬────────┘
                                                        │
┌─────────────────┐    ┌─────────────────┐    ┌────────▼────────┐
│  REPORT OUTPUT  │◀───│  BBOX LOCALIZER │◀───│   NORMALIZER    │
│  PDF + AI Chat  │    │ Gemini 2.5 Flash│    │ Severity engine │
│  Fix guides     │    │ Tight overlays  │    │ Risk scorer     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**3-pass Gemini pipeline:**

- **Pass 1 — Scene Classification:** identifies the space type before analysis so the ADA checklist is targeted, not generic
- **Pass 2 — Deep ADA Analysis:** scene-specific checklist, dynamic obstruction detection (vehicles blocking accessible spaces), severity classification, cost estimation, risk scoring
- **Pass 3 — Bounding Box Localization:** draws tight annotation boxes over each finding in the actual uploaded image

**Severity resolver** enforces ground-truth rules regardless of model output:
- Vehicle blocking accessible space or aisle → always CRITICAL, priority 9+
- Physically impassable surface → always CRITICAL
- Absent accessible route → always CRITICAL
- Faded markings → capped at WARNING, never CRITICAL
- Unverifiable sign height → capped at LOW

**Risk score** takes `max(model_score, derived_score)` so the model can never low-ball a serious scene.

---

## Features

- **Scene-aware analysis** — 8 dedicated checklists: parking lots, building entrances, corridors, restrooms, ramps/stairs, sidewalks/crosswalks, elevators, retail counters
- **Dynamic obstruction detection** — explicitly checks for vehicles, equipment, or objects blocking accessible features
- **Bounding box overlays** — annotated findings rendered directly on the uploaded image
- **AI Fix Guide** — per-finding remediation guide with materials list, step-by-step instructions, and ADA compliance checklist, generated on demand
- **AI Chat Panel** — ask anything about your report: fine exposure, DIY fixes, contractor briefs, owner letters
- **Legal risk score** — 0–100 score with animated gauge, calibrated to actual violation severity
- **Cost visualization** — animated bar charts per finding, total remediation range
- **Camera capture** — scan a space directly from your device camera without leaving the app
- **Fullscreen overlay view** — inspect bounding boxes at full resolution
- **PDF export** — full report printable for contractor handoff or record keeping
- **Copy per finding** — copy any violation card as plain text for documentation

---

## Traction

- 14 conversations with real business owners and operators before building (delis, gyms, clinics, salons, retail)
- 6 real commercial spaces reviewed with working prototype using actual phone photos
- 4 owners who asked to be notified when the next version was ready
- Submitted to HackHazards '26 (169 participants, $4,997 prize pool)
- Tested across 5+ scene types: parking lots, curb ramps, building entrances, restrooms, sidewalks
- Consistent output validated across multiple image conditions and lighting levels

---

## Market

- **7.5 million** commercial spaces in the United States
- **61 million** Americans living with a disability
- **$490 billion** annual spending power of people with disabilities
- **4,195** ADA lawsuits filed in 2023, up 320% over a decade
- **$50,000** average settlement cost per lawsuit

**Revenue model:**
- Free tier: unlimited scans, basic report
- Pro ($29/mo): AI chat, fix guides, PDF export, history
- Enterprise: white-label API for property management firms, insurance underwriters, and facility management companies managing multiple locations — one mid-sized property management firm managing 50 buildings is a $50k annual contract

---

## Run Locally

**Requirements:** Node.js 18+, Gemini API key

```bash
git clone https://github.com/Iceman-Dann/accessmap
cd accessmap
npm install
```

Create `.env`:
```env
GEMINI_API_KEY=your_key_here
```

Start:
```bash
npm start
```

Open: `http://127.0.0.1:3000`

---

## Project Structure

```
accessmap/
├── index.html          # Landing page
├── annalyzer.html      # Main analysis UI
├── server.js           # 3-pass Gemini pipeline + API server
├── package.json
└── .env                # API key (not committed)
```

---

## The Ask

AccessMap works. The market is real. The problem is urgent.

We're looking for:
- **Mentorship** on go-to-market — specifically reaching property managers, insurance underwriters, and facility compliance teams
- **Connections** to legal tech investors and accessibility advocacy organizations
- **Funding** to scale infrastructure, acquire first paying customers, and expand scene coverage

---

## Built With

- Gemini 2.5 Flash Vision API
- Node.js (zero framework dependencies)
- Vanilla JS + HTML/CSS
- IBM Plex Mono · Barlow Condensed · Barlow

---

*AccessMap — ADA Compliance Intelligence*  
*INNOSpark '26 · HackHazards '26*
