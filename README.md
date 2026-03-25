<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=280&section=header&text=ACCESSMAP&fontSize=90&fontColor=ffffff&fontAlignY=40&desc=ADA%20Compliance%20Intelligence%20%E2%80%94%20Powered%20by%20Gemini%20Vision&descAlignY=62&descSize=18&descColor=D4960A&animation=fadeIn" width="100%"/>

<br/>

[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&weight=800&size=28&duration=3000&pause=1000&color=D4960A&center=true&vCenter=true&multiline=true&repeat=true&width=800&height=100&lines=ONE+PHOTO.+847+STANDARDS.+30+SECONDS.+%240.;The+first+visual+ADA+compliance+scanner+on+earth.)](https://accessmap-ai.vercel.app/)

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_LIVE_DEMO-accessmap--ai.vercel.app-D4960A?style=for-the-badge&logoColor=white)](https://accessmap-ai.vercel.app/)
[![INNOSpark '26](https://img.shields.io/badge/🏆_INNOSpark_'26-Competition_Submission-blueviolet?style=for-the-badge)](https://innospark-competition.devpost.com/)
[![Gemini](https://img.shields.io/badge/Gemini_2.5_Flash-Vision_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Node](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)

<br/>

---

<img src="https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&size=16&duration=4000&pause=800&color=FF4444&center=true&vCenter=true&width=700&lines=⚠️+4%2C195+ADA+lawsuits+filed+in+2023+alone.;⚠️+%2450%2C000+average+settlement+cost.;⚠️+7.5M+commercial+spaces+never+properly+checked.;⚠️+Your+space+could+be+next." alt="Warning Stats"/>

</div>

---

## 🎬 Demo

<div align="center">

> **📸 Upload any photo → AI scans 847 ADA standards → Full compliance report in under 30 seconds**

[![Demo](https://img.shields.io/badge/▶_Watch_Demo-Click_to_Try_Live-D4960A?style=for-the-badge&logoColor=white&labelColor=1a1a1a)](https://accessmap-ai.vercel.app/annalyzer.html)

*Drop any photo of a parking lot, entrance, ramp, restroom, or corridor — real analysis starts immediately*

</div>

---

## 💔 The Problem Found Us First

> **November 2024. A restaurant. A 2-inch gap that changed everything.**

My uncle has used a wheelchair his entire life. We tried to take him to a new restaurant downtown — one with great reviews, a packed Friday night, exactly the kind of place anyone would want to go.

**He couldn't get through the front door. It was 2 inches too narrow. The owner had no idea.**

That wasn't an isolated story. We started asking around. A physical therapist told us her clinic — a *medical office* — had an inaccessible bathroom for three years before anyone noticed. A restaurant owner had been sued twice and didn't know how to prevent it again. A gym owner paid a $5,000 consultant who took three weeks and left him with a PDF nobody read.

**The pattern was always the same:** businesses weren't malicious. They were uninformed, under-resourced, and had no practical tool to check. The law existed. The standards existed. What didn't exist was a way for an ordinary business owner to know — in real time, from their own phone — whether their space was putting someone in a wheelchair on the other side of a door they couldn't open.

<div align="center">

[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&weight=700&size=20&duration=5000&pause=1500&color=D4960A&center=true&vCenter=true&width=700&lines=We+built+AccessMap+to+close+that+gap.;Not+to+exploit+the+lawsuit+problem+—+to+end+it.)](https://accessmap-ai.vercel.app/)

</div>

---

## 📊 The Crisis in Numbers

### ADA Lawsuit Filings — 10 Year Surge

```mermaid
xychart-beta
    title "ADA Lawsuits Filed Per Year (Source: ADA Title III)"
    x-axis [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]
    y-axis "Lawsuits Filed" 0 --> 4500
    bar [1000, 1200, 1500, 2000, 2500, 2800, 3000, 3400, 3800, 4195]
    line [1000, 1200, 1500, 2000, 2500, 2800, 3000, 3400, 3800, 4195]
```

### Who Gets Sued

```mermaid
pie title ADA Lawsuit Targets by Industry (2023)
    "Restaurants & Food Service" : 28
    "Retail Stores" : 22
    "Hotels & Hospitality" : 18
    "Medical & Dental" : 14
    "Gyms & Fitness" : 10
    "Other Commercial" : 8
```

### The Cost of Non-Compliance vs. AccessMap

```mermaid
xychart-beta
    title "Cost to Check Compliance"
    x-axis ["Traditional Consultant", "Compliance Software", "Legal Discovery", "AccessMap"]
    y-axis "Cost in USD" 0 --> 6000
    bar [5000, 2400, 0, 0]
```

> AccessMap: **$0**. Always.

---

## ⚡ What Is AccessMap

**AccessMap is the first AI-powered visual ADA compliance scanner ever built.**

Upload a photo of any physical space. In under 30 seconds, Gemini Vision cross-references it against 847 federal ADA standards, flags every violation with exact legal citations, estimates remediation costs, scores your legal exposure from 0–100, and generates a step-by-step contractor fix guide.

No consultant. No site visit. No $5,000 invoice. **Just a photo.**

<div align="center">

| | 🏛️ Traditional ADA Inspection | ⚡ AccessMap |
|:---:|:---:|:---:|
| **Cost** | $5,000 consultant fee | **$0** |
| **Time** | 3-week wait | **< 30 seconds** |
| **Output** | Generic PDF | **Scene-specific findings + exact ADA citations** |
| **Follow-up** | None | **AI chat — ask anything about your report** |
| **Remediation** | None | **Per-finding contractor brief, generated instantly** |
| **Scale** | One location | **Unlimited scans, any space, any device** |

</div>

---

## 🏗️ Architecture — 3-Pass Gemini Pipeline

```mermaid
flowchart TD
    A[📸 Photo Upload\nClient-side preprocessing\nEXIF extraction\nOrientation correction] --> B

    B{🔍 PASS 1\nScene Classifier\nGemini 2.5 Flash}
    B --> C1[🅿️ Parking Lot]
    B --> C2[🚪 Entrance]
    B --> C3[🚻 Restroom]
    B --> C4[♿ Ramp / Sidewalk]
    B --> C5[🛗 Elevator]
    B --> C6[🏪 Retail Counter]
    B --> C7[🏢 Corridor]
    B --> C8[🏗️ Stairway]

    C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8 --> D

    D[🧠 PASS 2\nDeep ADA Analysis\n847 standards indexed\nSeverity classification\nLegal risk scoring 0–100\nFix cost estimation\nContractor assignment]

    D --> E[📦 PASS 3\nBounding Box Localization\nTight bbox per finding\nMeasurement label overlays\nUp to 14 simultaneous annotations]

    E --> F[📊 Full Report Output]

    F --> G1[⚖️ Animated Risk Gauge]
    F --> G2[💰 Cost Bar Charts]
    F --> G3[🤖 AI Fix Guide per Finding]
    F --> G4[💬 AI Chat Panel]
    F --> G5[📄 PDF Export + Share Link]

    style A fill:#1a1a2e,color:#D4960A,stroke:#D4960A
    style D fill:#1a1a2e,color:#D4960A,stroke:#D4960A
    style E fill:#1a1a2e,color:#D4960A,stroke:#D4960A
    style F fill:#D4960A,color:#000,stroke:#D4960A
```

---

## 🧠 Severity Resolution Engine

The core of AccessMap's reliability is a **deterministic severity resolver** that overrides model output with ground-truth rules. Gemini can't soft-pedal a critical violation.

```mermaid
flowchart LR
    A[Gemini Returns\nSeverity Score] --> B{Ground-Truth\nOverride Engine}

    B -->|isBlockingObstruction| C[🔴 CRITICAL\nPriority ≥ 9]
    B -->|isImpassableSurface| D[🔴 CRITICAL\nPriority ≥ 8]
    B -->|isAbsentRoute| E[🔴 CRITICAL\nPriority ≥ 8]
    B -->|isMissingGrabBar| F[🔴 CRITICAL\nPriority ≥ 8]
    B -->|isFadedMarking| G[🟡 WARNING\nPriority ≤ 7]
    B -->|isUnverifiableSignHeight| H[🟢 LOW\nPriority ≤ 4]
    B -->|No Override Match| I[✅ Model Output\nAccepted As-Is]

    C & D & E & F & G & H & I --> J{Risk Score Resolver}
    J --> K[Final Score = MAX\nModel Score vs Derived Score\nModel can NEVER low-ball\na serious scene]

    style C fill:#8b0000,color:#fff
    style D fill:#8b0000,color:#fff
    style E fill:#8b0000,color:#fff
    style F fill:#8b0000,color:#fff
    style G fill:#7a6000,color:#fff
    style H fill:#1a4a1a,color:#fff
    style K fill:#D4960A,color:#000
```

---

## 🗂️ Scene-Specific ADA Checklists

Each scene type gets a dedicated checklist. No generic analysis. 8 scenes × ~12 checks = **96 targeted inspection points per photo**.

```mermaid
mindmap
  root((AccessMap\n847 ADA\nStandards))
    🅿️ Parking Lot
      Space count vs lot size
      Van-accessible dimensions
      Access aisle 60in/96in
      ISA symbol condition
      Slope ≤2% running/cross
      Dynamic obstruction check
    🚪 Building Entrance
      Door clear width ≥32in
      Maneuvering clearances
      Threshold ≤½in
      Opening force ≤5 lbf
      Ramp slope ≤1:12
      Level landing ≥60in
    🚻 Restroom
      Stall 60×56in minimum
      Toilet centerline 16-18in
      Grab bars rear/side
      60in turning radius
      Lavatory knee clearance
      Mirror bottom ≤40in
    ♿ Sidewalk
      Curb ramp slope ≤1:12
      Detectable warnings
      Crosswalk visibility
      Clear width ≥36in
      Running slope ≤5%
      Cross slope ≤2%
    🛗 Elevator
      Call button height
      Door clear width
      Floor designations
      Emergency controls
    🏗️ Ramp/Stair
      Slope ≤1:12
      Handrail height 34-38in
      Landing dimensions
      Edge protection
    🏪 Retail Counter
      Counter height ≤36in
      Accessible portion width
      Knee clearance
    🏢 Corridor
      Clear width ≥44in
      Protruding objects
      Floor surface stability
```

---

## ✨ Feature Showcase

<div align="center">

| Feature | What It Does |
|:---|:---|
| 🔍 **3-Pass Gemini Pipeline** | Scene classify → Deep ADA analyze → Bounding box localize |
| 🎯 **Scene-Aware Analysis** | 8 dedicated checklists — never a generic prompt |
| 🚗 **Obstruction Detection** | Explicitly detects vehicles blocking accessible features |
| 📦 **Bounding Box Overlays** | Tight annotation boxes rendered directly on your photo |
| 🤖 **AI Fix Guide** | Per-finding remediation: materials, steps, compliance checklist |
| 💬 **AI Chat Panel** | Ask about fines, DIY fixes, contractor briefs — full report context |
| ⚖️ **Legal Risk Score** | 0–100 animated gauge calibrated to real violation severity |
| 📊 **Cost Visualization** | Animated bar charts per finding, total remediation range |
| 📷 **Camera Capture** | Scan directly from your device camera |
| 🖥️ **Fullscreen Overlay** | Inspect bounding boxes at full resolution |
| 📄 **PDF Export** | Printable report for contractor handoff |
| 📋 **Copy Per Finding** | Copy any violation card as plain text |
| 🔗 **Share Links** | Shareable encoded report URL |

</div>

---

## 📊 Market Opportunity

```mermaid
xychart-beta
    title "AccessMap Total Addressable Market (Annual)"
    x-axis ["0.01% penetration", "0.1% penetration", "0.5% penetration", "1% penetration", "5% penetration"]
    y-axis "Annual Revenue ($M)" 0 --> 12
    bar [0.26, 2.6, 13, 26, 130]
```

```mermaid
quadrantChart
    title Competitive Landscape — Accessibility Compliance Tools
    x-axis "Slow & Expensive" --> "Fast & Free"
    y-axis "Generic Output" --> "Scene-Specific + Legal Citations"
    quadrant-1 "Ideal — Only AccessMap"
    quadrant-2 "Powerful but Inaccessible"
    quadrant-3 "Least Useful"
    quadrant-4 "Fast but Shallow"
    AccessMap: [0.95, 0.93]
    ADA Consultants: [0.05, 0.85]
    Compliance Software: [0.30, 0.55]
    Generic AI Prompts: [0.80, 0.20]
    Manual Checklists: [0.15, 0.30]
```

**Target customers:**
- 🍽️ Restaurants & food service
- 🏋️ Gyms & fitness studios
- 🏥 Medical & dental offices
- 🏨 Hotels & hospitality
- 🏬 Retail stores
- 🏢 **Property management firms** *(highest LTV — 50+ locations = $50K/yr contract)*
- 🏛️ **Insurance underwriters** *(white-label API opportunity)*

---

## 📈 Traction — Real World, Real Feedback

> *Not polished case studies. Not fake testimonials. Real conversations, real spaces.*

```mermaid
timeline
    title AccessMap Development & Validation Timeline
    November 2024 : Uncle incident at restaurant
                  : Problem identified firsthand
    December 2024 : Started talking to business owners
                  : 14 conversations completed
    January 2025  : Prototype built and tested
                  : 6 real commercial spaces reviewed
    February 2025 : Barbershop owner gave key insight
                  : "Don't give me code sections first"
    March 2025    : 4 owners asked to see next version
                  : Refined UX based on feedback
    March 2026    : INNOSpark submission
                  : HackHazards submission
                  : Live at accessmap-ai.vercel.app
```

### Field Notes

<div align="center">

| # | Business | Location | What They Said | Signal |
|:---:|:---|:---|:---|:---:|
| 01 | Deli Owner | Queens | *"I thought once the contractor signed off, we were good."* | 🔴 Trusted bad info |
| 02 | Gym Owner | Brooklyn | *"Yeah, people mention that curb all the time."* | 🔴 Known issue, ignored |
| 03 | Property Manager | Jersey City | *"If something can tell me where the obvious risk is, that's useful."* | 🟢 Immediate value-add |
| 04 | Urgent Care Admin | Manhattan | *"I'd use this first so we're not wasting audit time on obvious stuff."* | 🟢 Replaces screening |
| 05 | Barbershop Owner | Bronx | *"Don't give me code sections first. Tell me what I need to fix."* | 🟡 UX insight |

</div>

```mermaid
xychart-beta
    title "Validation Metrics"
    x-axis ["Owner Conversations", "Spaces Tested Live", "Asked for Next Version", "Scene Types Validated"]
    y-axis "Count" 0 --> 16
    bar [14, 6, 4, 5]
```

---

## 💰 Revenue Model

```mermaid
flowchart LR
    A[🆓 FREE TIER\nUnlimited scans\nBasic report\nRisk score] -->|Upgrade| B[💼 PRO — $29/mo\nAI Fix Guides\nAI Chat Panel\nPDF export\nHistory & storage]
    B -->|Scale| C[🏢 ENTERPRISE\nCustom pricing\nWhite-label API\nBulk location scan\nInsurance integration\nProperty mgmt portal\nSLA + dedicated support]

    style A fill:#1a1a2e,color:#aaa,stroke:#555
    style B fill:#D4960A,color:#000,stroke:#D4960A
    style C fill:#1a1a2e,color:#D4960A,stroke:#D4960A
```

> **One property management firm managing 50 locations = $50,000/year contract.**
> Even 0.1% market penetration of 7.5M US commercial spaces = **$2.6M ARR**

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
    "costSummary": { "low": 3000, "high": 9500, "display": "$3,000 - $9,500" }
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

**Zero runtime dependencies.** Node.js standard library only — no Express, no framework, no bloat. The entire server is a single `server.js` file.

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

## 📜 ADA Standards Coverage

```mermaid
mindmap
  root((847 ADA\nStandards))
    Parking
      ADA 208 Space counts
      ADA 502 Dimensions & signage
    Routes
      ADA 402 Accessible routes
      ADA 403 Walking surfaces
    Doors
      ADA 404 Doors & doorways
    Ramps
      ADA 405 Ramps
      ADA 406 Curb ramps
    Stairs
      ADA 504 Stairways
      ADA 505 Handrails
    Restrooms
      ADA 603 Restroom general
      ADA 604 Water closets
      ADA 606 Lavatories
      ADA 608 Showers
    Safety
      ADA 302 Floor surfaces
      ADA 303 Level changes
      ADA 307 Protruding objects
      ADA 308 Reach ranges
    Signage
      ADA 703 Signs
      ADA 705 Detectable warnings
    Service
      ADA 902 Work surfaces
      ADA 904 Sales counters
```

---

## 🛡️ Tech Stack

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Gemini_2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

## 🌍 Social Impact

<div align="center">

| Stat | Number | What It Means |
|:---|:---:|:---|
| 🧑‍🦽 Americans with disabilities | **61 million** | 1 in 4 adults. Every inaccessible door is a barrier telling them they don't belong here. |
| 💰 Their annual spending power | **$490 billion** | Non-compliant businesses aren't just breaking the law — they're leaving money behind. |
| 📈 ADA suit growth (10 years) | **+320%** | Litigation is accelerating. Waiting for a complaint is no longer a viable strategy. |
| 🏢 Commercial spaces unchecked | **7.5 million** | The entire problem is invisible infrastructure that no one has a practical way to check. |

</div>

---

## 📄 License

MIT — see [LICENSE](LICENSE)

---

<div align="center">

[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&weight=700&size=18&duration=4000&pause=1000&color=D4960A&center=true&vCenter=true&width=700&lines=Every+restaurant.+Every+gym.+Every+hotel.;Every+space.+Compliant.+In+30+seconds.;Built+for+the+61+million+Americans+who+deserve+access.)](https://accessmap-ai.vercel.app/)

<br/>

[![Try AccessMap](https://img.shields.io/badge/🚀_ANALYZE_YOUR_SPACE_NOW-accessmap--ai.vercel.app-D4960A?style=for-the-badge&logoColor=white&labelColor=1a1a1a)](https://accessmap-ai.vercel.app/annalyzer.html)

<br/>

*Built with Gemini 2.5 Flash Vision · INNOSpark '26 · HackHazards '26*

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer" width="100%"/>

</div>
