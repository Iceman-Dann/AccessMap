<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=D4960A&height=200&section=header&text=ACCESSMAP&fontSize=80&fontColor=000000&fontAlignY=38&desc=ADA%20Compliance%20Intelligence%20Platform&descAlignY=60&descSize=20&descColor=000000" width="100%"/>

<br/>

[![License](https://img.shields.io/badge/license-MIT-D4960A?style=for-the-badge&logoColor=black)](LICENSE)
[![Node](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![INNOSpark](https://img.shields.io/badge/INNOSpark%20'26-Submission-D4960A?style=for-the-badge)](https://devpost.com)

<br/>

```
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█  ONE PHOTO. 847 STANDARDS. 30 SECONDS. $0.          █
█  The first visual ADA compliance scanner on earth.  █
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
```

</div>

---

## ⚡ What Is This

AccessMap is the **first AI-powered visual ADA compliance scanner** in existence. Upload a photo of any physical space. In under 30 seconds, Gemini Vision cross-references it against 847 federal ADA standards, flags every violation with exact legal citations, estimates remediation costs, scores your legal exposure from 0–100, and generates a step-by-step contractor fix guide.

No consultant. No site visit. No $5,000 invoice. **Just a photo.**

<div align="center">

| 🏛️ Traditional ADA Inspection | ⚡ AccessMap |
|:---:|:---:|
| $5,000 consultant fee | **$0** |
| 3-week wait for site visit | **< 30 seconds** |
| Generic PDF nobody understands | **Scene-specific findings + exact ADA citations** |
| No follow-up support | **AI chat — ask anything about your report** |
| No remediation guidance | **Per-finding contractor brief, generated instantly** |
| One location at a time | **Unlimited scans, any space, any device** |

</div>

---

## 🚨 The Problem

<div align="center">

```
╔══════════════════════════════════════════════════════════════╗
║  4,195 ADA lawsuits filed in 2023                           ║
║  ↑ 320% increase over the past decade                       ║
║  $50,000 average settlement cost                            ║
║  $181,071 maximum federal fine (repeat violation)           ║
║  7,500,000 commercial spaces in America never properly      ║
║            checked                                          ║
╚══════════════════════════════════════════════════════════════╝
```

</div>

The businesses getting sued aren't negligent corporations. They're **restaurants, gyms, clinics, barbershops, and corner stores** — run by people who had no practical way to know their space was non-compliant.

> *"I thought once the contractor signed off, we were good."*
> — Deli owner, Queens (interviewed during development)

> *"Yeah, people mention that curb all the time."*
> — Gym owner, Brooklyn (tested prototype on-site)

> *"If something can tell me where the obvious risk is, that's useful."*
> — Property manager, Jersey City

> *"I'd use this first so we're not wasting audit time on obvious stuff."*
> — Urgent care admin, Manhattan

---

## 💡 Why We Built This

My uncle has used a wheelchair his entire life. We tried to take him to a new restaurant downtown. He couldn't get through the front door — two inches too narrow. The owner had no idea.

That wasn't an isolated story. It was a symptom. **61 million Americans live with a disability.** The infrastructure meant to protect their access is invisible to the businesses responsible for maintaining it. We built AccessMap to close that gap — not to exploit the lawsuit problem, but to end it.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ACCESSMAP PIPELINE                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   📸 PHOTO UPLOAD          🔍 PASS 1: SCENE CLASSIFIER                 │
│   ─────────────            ───────────────────────────                  │
│   • Client-side      ───▶  • Gemini 2.5 Flash                          │
│     preprocessing          • 8 scene types detected:                   │
│   • EXIF extraction          parking_lot | entrance | corridor          │
│   • Orientation              restroom | ramp | sidewalk                 │
│     correction               elevator | retail_counter                  │
│                                                                         │
│                              ▼                                          │
│                                                                         │
│   🧠 PASS 2: DEEP ADA ANALYSIS                                         │
│   ─────────────────────────────                                         │
│   • Scene-targeted checklist (847 ADA standards indexed)               │
│   • Dynamic obstruction detection (vehicles blocking access)            │
│   • Severity classification with ground-truth override rules           │
│   • Legal risk scoring (0-100)                                         │
│   • Fix cost estimation in USD                                         │
│   • Contractor type assignment per finding                             │
│                                                                         │
│                              ▼                                          │
│                                                                         │
│   📦 PASS 3: BOUNDING BOX LOCALIZATION                                 │
│   ──────────────────────────────────────                                │
│   • Tight bbox per finding (% coordinates)                             │
│   • Measurement label overlay                                          │
│   • Multi-format bbox normalization                                    │
│   • Up to 14 simultaneous annotations                                  │
│                                                                         │
│                              ▼                                          │
│                                                                         │
│   📊 REPORT OUTPUT                                                     │
│   ─────────────────                                                     │
│   • Violation cards with REQUIRED / DETECTED / COST / PRIORITY        │
│   • Animated risk gauge (0-100)                                        │
│   • Cost bar charts per finding                                        │
│   • Fix priority queue                                                  │
│   • AI Fix Guide (on demand, per finding)                              │
│   • AI Chat Panel (full report context)                                │
│   • PDF export + share link                                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🧠 Severity Resolution Engine

The core of AccessMap's reliability is a **deterministic severity resolver** that overrides model output with ground-truth rules. Gemini can't soft-pedal a critical violation.

```js
// Ground-truth override rules — these fire regardless of what Gemini returns

isBlockingObstruction(text)    → CRITICAL, priority >= 9
// Vehicle/object blocking accessible space, aisle, ramp, route, or doorway

isImpassableSurface(text)      → CRITICAL, priority >= 8
// Severely deteriorated ramp/curb/path that cannot be safely traversed

isAbsentRoute(text)            → CRITICAL, priority >= 8
// No ramp, no curb cut, no accessible route present

isMissingGrabBar(text)         → CRITICAL, priority >= 8
// Required grab bar absent in restroom

isFadedMarking(text)           → WARNING cap, priority <= 7
// Faded stripes/ISA symbol — never CRITICAL

isUnverifiableSignHeight(text) → LOW WARNING cap, priority <= 4
// Sign present but height unconfirmable — never inflated
```

**Risk score is always the higher of model output vs. derived score** — the model can never low-ball a serious scene.

---

## 🗂️ Scene-Specific ADA Checklists

Each scene type gets a dedicated checklist. No generic analysis.

<details>
<summary><b>🅿️ Parking Lot</b> — 14 checks</summary>

```
□ Accessible space count vs total lot (ADA 208.2)
□ Van-accessible space presence and dimensions (ADA 502.2)
□ Access aisle width: 60in car / 96in van (ADA 502.3)
□ Access aisle diagonal stripe condition (ADA 502.3.3)
□ Dynamic obstructions in space or aisle
□ ISA pavement symbol condition (ADA 502.6)
□ Vertical sign: ISA, mounting height >=60in, van text (ADA 502.6)
□ Penalty/fine text per local code
□ Surface: stable, firm, slip-resistant (ADA 302.1)
□ Running slope <=2% (ADA 502.4)
□ Cross slope <=2% (ADA 502.4)
□ Connection to accessible route (ADA 502.7)
□ Wheel stops or barriers blocking ramp deployment
□ Lighting adequacy
```
</details>

<details>
<summary><b>🚪 Building Entrance</b> — 11 checks</summary>

```
□ Door clear width >=32in at 90 degrees (ADA 404.2.3)
□ Maneuvering clearances pull/push side (ADA 404.2.4)
□ Threshold height <=1/2in, beveled if >1/4in (ADA 404.2.5)
□ Hardware: lever/loop/push, no tight grip (ADA 404.2.7)
□ Opening force <=5 lbf interior (ADA 404.2.9)
□ Accessible route from parking to entrance (ADA 402)
□ Ramp presence if elevated: slope <=1:12, width >=36in (ADA 405)
□ Handrails if ramp rise >6in (ADA 505)
□ Level landing >=60in deep at door (ADA 404.2.4)
□ Signage for non-primary accessible entrance (ADA 216.6)
□ Protruding objects at head height (ADA 307)
```
</details>

<details>
<summary><b>🚻 Restroom</b> — 12 checks</summary>

```
□ Accessible stall: 60in wide x 56in deep minimum (ADA 604.3)
□ Toilet centerline 16-18in from side wall (ADA 604.2)
□ Seat height 17-19in AFF (ADA 604.4)
□ Grab bars: rear 36in / side 42in at 33-36in AFF (ADA 604.5)
□ 60in diameter turning radius (ADA 603.2)
□ Lavatory knee clearance 27x30x19in (ADA 606.2)
□ Lavatory height <=34in to rim (ADA 606.3)
□ Insulated pipes under lavatory (ADA 606.5)
□ Mirror bottom <=40in AFF (ADA 603.3)
□ Faucet: no tight grip required (ADA 606.4)
□ Accessories reach range 15-48in (ADA 308)
□ Stall door: 32in clear, hardware operable (ADA 404.2.3)
```
</details>

<details>
<summary><b>♿ Sidewalk / Crosswalk</b> — 12 checks</summary>

```
□ Curb ramp presence at each corner (ADA 406)
□ Curb ramp slope <=1:12 (ADA 406.2)
□ Curb ramp width >=36in (ADA 406.5)
□ Detectable warnings: 24in deep, full width, contrasting (ADA 705)
□ Detectable warning condition — not cracked/faded/missing
□ Crosswalk markings present and visible
□ Curb ramp surface condition
□ Transition flush, no lip >1/2in
□ Running slope <=5% (ADA 403.3)
□ Cross slope <=2% (ADA 403.3)
□ Clear width >=36in (ADA 403.5)
□ Overhead clearance >=80in (ADA 307.4)
```
</details>

<details>
<summary><b>🛗 Elevator | 🏗️ Ramp/Stair | 🏪 Retail Counter | 🏢 Corridor</b></summary>

Each with 10-12 dedicated checks covering dimensions, surfaces, hardware, clearances, signage, and dynamic obstructions.
</details>

---

## ✨ Features

<div align="center">

| Feature | Description |
|:---|:---|
| 🔍 **3-Pass Gemini Pipeline** | Scene classification → Deep ADA analysis → Bounding box localization |
| 🎯 **Scene-Aware Analysis** | 8 dedicated checklists, not a generic prompt |
| 🚗 **Obstruction Detection** | Explicitly checks for vehicles blocking accessible features |
| 📦 **Bounding Box Overlays** | Tight annotation boxes rendered on the uploaded image |
| 🤖 **AI Fix Guide** | Per-finding remediation guide with materials, steps, compliance checklist |
| 💬 **AI Chat Panel** | Full report context — ask about fines, DIY fixes, contractor briefs |
| ⚖️ **Legal Risk Score** | 0-100 animated gauge calibrated to actual violation severity |
| 📊 **Cost Visualization** | Animated bar charts per finding, total remediation range |
| 📷 **Camera Capture** | Scan directly from device camera |
| 🖥️ **Fullscreen Overlay** | Inspect bounding boxes at full resolution |
| 📄 **PDF Export** | Full printable report for contractor handoff |
| 📋 **Copy Per Finding** | Copy any violation card as plain text |
| 🔗 **Share Links** | Shareable encoded report URL |

</div>

---

## 📊 Market

<div align="center">

```
ADA LAWSUIT FILINGS — 10 YEAR TREND
─────────────────────────────────────────────────────
2014  ████░░░░░░░░░░░░░░░░░░░░░░░░░░  ~1,000
2016  ██████░░░░░░░░░░░░░░░░░░░░░░░░  ~1,500
2018  ████████████░░░░░░░░░░░░░░░░░░  ~2,500 (+150%)
2020  ██████████████░░░░░░░░░░░░░░░░  ~3,000
2022  ████████████████████░░░░░░░░░░  ~3,800
2023  █████████████████████████░░░░░   4,195 (+320% vs 2014)
─────────────────────────────────────────────────────
The trend does not reverse itself.
```

```
TOTAL ADDRESSABLE MARKET
─────────────────────────────────────────────────────
7,500,000   Commercial spaces in the US
x    $29/mo  AccessMap Pro subscription
─────────────────────────────────────────────────────
= $2.6B     Annual recurring revenue potential

Even 0.1% penetration = $2.6M ARR
```

</div>

**Target customers:**
- 🍽️ Restaurants & food service
- 🏋️ Gyms & fitness studios
- 🏥 Medical & dental offices
- 🏨 Hotels & hospitality
- 🏬 Retail stores
- 🏢 Property management firms *(highest LTV — 50+ locations)*
- 🏛️ Insurance underwriters *(white-label API)*

---

## 📈 Traction

<div align="center">

```
╔═══════╦══════════════════════════════════════════════════╗
║  14   ║ Owner/operator conversations before building     ║
╠═══════╬══════════════════════════════════════════════════╣
║   6   ║ Real commercial spaces reviewed with prototype   ║
╠═══════╬══════════════════════════════════════════════════╣
║   4   ║ Owners who asked to see the next version         ║
╠═══════╬══════════════════════════════════════════════════╣
║  5+   ║ Scene types validated in the wild                ║
╠═══════╬══════════════════════════════════════════════════╣
║   2   ║ Active hackathon submissions                     ║
╚═══════╩══════════════════════════════════════════════════╝
```

</div>

Real business types tested: delis, gyms, urgent care clinics, property management offices, barbershops. Real phone photos, not polished demo images.

---

## 🚀 Quick Start

**Requirements:** Node.js 18+, Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

```bash
# Clone
git clone https://github.com/Iceman-Dann/accessmap
cd accessmap

# Install
npm install

# Configure
echo "GEMINI_API_KEY=your_key_here" > .env

# Run
npm start
# Open http://127.0.0.1:3000
```

---

## 📁 Project Structure

```
accessmap/
│
├── 🌐 index.html          # Landing page — full marketing site
├── 🔬 annalyzer.html      # Main analysis UI (3-step scan flow)
│
├── ⚙️  server.js           # Core pipeline
│   ├── Scene classifier    # Pass 1 — Gemini scene detection
│   ├── ADA analyzer        # Pass 2 — 847-standard deep scan
│   ├── BBox localizer      # Pass 3 — annotation coordinates
│   ├── Severity resolver   # Ground-truth override engine
│   ├── Risk scorer         # 0-100 legal exposure model
│   └── Static file server  # Zero-dependency HTTP server
│
├── 📦 package.json
└── 🔒 .env                 # API key (never committed)
```

---

## 🔌 API Reference

```
GET  /api/status    → { configured: bool, model: string }
POST /api/analyze   → Full analysis JSON
```

**POST /api/analyze payload:**
```json
{
  "mimeType": "image/jpeg",
  "imageBase64": "<base64>",
  "apiKey": "optional-browser-override",
  "isDemoMode": false
}
```

**Response shape:**
```json
{
  "summary": {
    "headline": "Critical ADA Violations Detected",
    "overview": "...",
    "immediateActions": ["...", "..."]
  },
  "report": {
    "riskScore": 90,
    "riskVerdict": "HIGH LEGAL EXPOSURE",
    "costSummary": { "low": 3000, "high": 9500, "display": "$3,000 - $9,500" },
    "priorityQueue": [...],
    "nextSteps": [...],
    "certification": { "status": "VIOLATIONS FLAGGED", "note": "..." }
  },
  "findings": [
    {
      "id": "F1",
      "type": "critical",
      "element": "Curb Ramp",
      "standard": "ADA 405.2, 302.1",
      "title": "Severely Damaged and Impassable Curb Ramp",
      "required": "Ramp surfaces shall be stable, firm, and slip resistant...",
      "detected": "Surface is broken, uneven, with multiple vertical changes...",
      "fixCost": "$2,500 - $7,500",
      "contractor": "Concrete/Paving Contractor",
      "timeline": "2-4 weeks",
      "priority": 9,
      "bbox": { "x": 15, "y": 45, "width": 60, "height": 40 }
    }
  ]
}
```

---

## 🛡️ Tech Stack

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Gemini%202.5%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)

</div>

**Zero runtime dependencies.** Node.js standard library only — no Express, no framework, no bloat. The entire server is a single `server.js` file.

---

## 💰 Revenue Model

```
FREE TIER            PRO ($29/mo)           ENTERPRISE (custom)
──────────────       ─────────────          ────────────────────
✓ Unlimited scans    ✓ Everything free      ✓ White-label API
✓ Basic report       ✓ AI Fix Guides        ✓ Bulk location scan
✓ Risk score         ✓ AI Chat Panel        ✓ Insurance integration
                     ✓ PDF export           ✓ Property mgmt portal
                     ✓ History & storage    ✓ SLA + support
```

One property management firm managing 50 locations = **$50,000/year contract.**

---

## 📜 ADA Standards Coverage

| Standard | Description |
|:---|:---|
| ADA 208 | Parking spaces — count requirements |
| ADA 302-303 | Floor surfaces and level changes |
| ADA 304 | Turning space |
| ADA 307 | Protruding objects |
| ADA 308 | Reach ranges |
| ADA 402-403 | Accessible routes |
| ADA 404 | Doors and doorways |
| ADA 405-406 | Ramps and curb ramps |
| ADA 502 | Parking spaces (dimensions, signage) |
| ADA 504 | Stairways |
| ADA 505 | Handrails |
| ADA 603-608 | Restroom fixtures and clearances |
| ADA 703 | Signs |
| ADA 705 | Detectable warning surfaces |
| ADA 902 | Dining and work surfaces |
| ADA 904 | Sales and service counters |

---

## 📄 License

MIT — see [LICENSE](LICENSE)

---

<div align="center">

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ACCESSMAP — ADA COMPLIANCE INTELLIGENCE                    ║
║   Built with Gemini 2.5 Flash Vision                        ║
║   INNOSpark '26  ·  HackHazards '26                         ║
║                                                              ║
║   Every restaurant. Every gym. Every hotel.                  ║
║   Every space. Compliant. In 30 seconds.                    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

<img src="https://capsule-render.vercel.app/api?type=waving&color=D4960A&height=120&section=footer" width="100%"/>

</div>
