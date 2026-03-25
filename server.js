'use strict';

const http = require('http');
const fs   = require('fs');
const path = require('path');

const HOST          = '127.0.0.1';
const PORT          = Number(process.env.PORT) || 3000;
const ROOT          = __dirname;
const GEMINI_MODEL  = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const MAX_RETRIES   = 2;

loadEnvFile(path.join(ROOT, '.env'));

// ─────────────────────────────────────────────────────────────
//  MIME
// ─────────────────────────────────────────────────────────────
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon'
};

// ─────────────────────────────────────────────────────────────
//  GEMINI JSON SCHEMA
// ─────────────────────────────────────────────────────────────
const FINDING_SCHEMA = {
  type: 'object',
  properties: {
    id:               { type: 'string' },
    type:             { type: 'string', enum: ['critical', 'warning', 'compliant'] },
    element:          { type: 'string' },
    standard:         { type: 'string' },
    title:            { type: 'string' },
    description:      { type: 'string' },
    required:         { type: 'string' },
    detected:         { type: 'string' },
    fixCost:          { type: 'string' },
    contractor:       { type: 'string' },
    timeline:         { type: 'string' },
    priority:         { type: 'number' },
    measurementLabel: { type: 'string' },
    bbox: {
      type: 'object',
      properties: {
        x:      { type: 'number' },
        y:      { type: 'number' },
        width:  { type: 'number' },
        height: { type: 'number' }
      },
      required: ['x', 'y', 'width', 'height']
    }
  },
  required: ['id', 'type', 'element', 'title', 'description', 'detected', 'priority']
};

const ANALYSIS_SCHEMA = {
  type: 'object',
  required: ['summary', 'report', 'findings'],
  properties: {
    summary: {
      type: 'object',
      required: ['headline', 'overview', 'immediateActions'],
      properties: {
        headline:         { type: 'string' },
        overview:         { type: 'string' },
        immediateActions: { type: 'array', items: { type: 'string' } }
      }
    },
    report: {
      type: 'object',
      required: ['title', 'riskScore', 'riskVerdict', 'riskSummary'],
      properties: {
        title:       { type: 'string' },
        riskScore:   { type: 'number' },
        riskVerdict: { type: 'string' },
        riskSummary: { type: 'string' },
        costSummary: {
          type: 'object',
          properties: {
            low:     { type: 'number' },
            high:    { type: 'number' },
            display: { type: 'string' },
            notes:   { type: 'string' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  label:  { type: 'string' },
                  amount: { type: 'string' }
                }
              }
            }
          }
        },
        priorityQueue: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              findingId: { type: 'string' },
              label:     { type: 'string' },
              reason:    { type: 'string' }
            }
          }
        },
        nextSteps: { type: 'array', items: { type: 'string' } },
        certification: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            note:   { type: 'string' }
          }
        }
      }
    },
    findings: { type: 'array', items: FINDING_SCHEMA }
  }
};

const LOCALIZATION_SCHEMA = {
  type: 'object',
  properties: {
    boxes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id:               { type: 'string' },
          measurementLabel: { type: 'string' },
          bbox: {
            type: 'object',
            properties: {
              x:      { type: 'number' },
              y:      { type: 'number' },
              width:  { type: 'number' },
              height: { type: 'number' }
            },
            required: ['x', 'y', 'width', 'height']
          }
        }
      }
    }
  }
};

// ─────────────────────────────────────────────────────────────
//  SERVER
// ─────────────────────────────────────────────────────────────
http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') return sendEmpty(res, 204);

    const host = req.headers.host || `${HOST}:${PORT}`;
    const url  = new URL(req.url, `http://${host}`);

    if (req.method === 'GET'  && url.pathname === '/api/status')  return handleStatus(res);
    if (req.method === 'POST' && url.pathname === '/api/analyze') return handleAnalyze(req, res);
    if (req.method === 'POST' && url.pathname === '/api/chat')    return handleChat(req, res);
    if (req.method === 'POST' && url.pathname === '/api/fix-guide') return handleFixGuide(req, res);
    if (req.method === 'GET'  || req.method === 'HEAD')           return serveStatic(url.pathname, res, req.method === 'HEAD');

    return sendJson(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    console.error('[server] unhandled error:', err);
    return sendJson(res, 500, { error: 'Internal server error' });
  }
}).listen(PORT, HOST, () => {
  console.log(`\n  AccessMap ▸  http://${HOST}:${PORT}/\n`);
});

// ─────────────────────────────────────────────────────────────
//  HANDLERS
// ─────────────────────────────────────────────────────────────
function handleStatus(res) {
  return sendJson(res, 200, {
    configured: Boolean(process.env.GEMINI_API_KEY),
    model: GEMINI_MODEL
  });
}

async function handleAnalyze(req, res) {
  let payload;
  try {
    payload = await readJsonBody(req);
  } catch {
    return sendJson(res, 400, { error: 'Invalid JSON payload' });
  }

  const mimeType    = payload?.mimeType;
  const imageBase64 = payload?.imageBase64;
  const apiKey      = payload?.apiKey || process.env.GEMINI_API_KEY;
  const isDemoMode  = Boolean(payload?.isDemoMode);

  if (!apiKey)      return sendJson(res, 400, { error: 'Gemini API key not configured. Add GEMINI_API_KEY to .env' });
  if (!mimeType || !imageBase64) return sendJson(res, 400, { error: 'Image payload required.' });

  try {
    const analysis = await runFullAnalysis({ apiKey, mimeType, imageBase64, isDemoMode });
    return sendJson(res, 200, analysis);
  } catch (err) {
    console.error('[analyze] error:', err.publicMessage || err.message);
    return sendJson(res, err.statusCode || 502, {
      error:   err.publicMessage || err.message || 'Analysis failed',
      details: err.details || undefined
    });
  }
}

async function handleChat(req, res) {
  let payload;
  try {
    payload = await readJsonBody(req);
  } catch {
    return sendJson(res, 400, { error: 'Invalid JSON payload' });
  }

  const apiKey      = payload?.apiKey || process.env.GEMINI_API_KEY;
  const chatContext = typeof payload?.chatContext === 'string' ? payload.chatContext.trim() : '';
  const history     = Array.isArray(payload?.history) ? payload.history : [];

  if (!apiKey) return sendJson(res, 400, { error: 'Gemini API key not configured. Add GEMINI_API_KEY to .env' });
  if (!chatContext) return sendJson(res, 400, { error: 'Chat context is required.' });
  if (!history.length) return sendJson(res, 400, { error: 'Chat history is required.' });

  try {
    const contents = [
      { role: 'user', parts: [{ text: chatContext }] },
      { role: 'model', parts: [{ text: 'Understood. I will answer follow-up questions using this accessibility report as the source of truth.' }] },
      ...history
        .filter(msg => msg && (msg.role === 'user' || msg.role === 'ai') && typeof msg.content === 'string' && msg.content.trim())
        .map(msg => ({
          role: msg.role === 'ai' ? 'model' : 'user',
          parts: [{ text: msg.content.trim() }]
        }))
    ];

    const reply = await requestGeminiText({
      apiKey,
      contents,
      temperature: 0.35,
      maxOutputTokens: 900
    });

    return sendJson(res, 200, { reply });
  } catch (err) {
    console.error('[chat] error:', err.publicMessage || err.message);
    return sendJson(res, err.statusCode || 502, {
      error: err.publicMessage || err.message || 'Chat failed',
      details: err.details || undefined
    });
  }
}

async function handleFixGuide(req, res) {
  let payload;
  try {
    payload = await readJsonBody(req);
  } catch {
    return sendJson(res, 400, { error: 'Invalid JSON payload' });
  }

  const apiKey  = process.env.GEMINI_API_KEY;
  const finding = payload?.finding;

  if (!apiKey) return sendJson(res, 400, { error: 'Gemini API key not configured. Add GEMINI_API_KEY to .env' });
  if (!finding || typeof finding !== 'object') return sendJson(res, 400, { error: 'Finding payload is required.' });

  const prompt = buildFixGuidePrompt(finding);

  try {
    const reply = await requestGeminiText({
      apiKey,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      temperature: 0.3,
      maxOutputTokens: 1200
    });

    return sendJson(res, 200, { guide: reply });
  } catch (err) {
    console.error('[fix-guide] error:', err.publicMessage || err.message);
    return sendJson(res, err.statusCode || 502, {
      error: err.publicMessage || err.message || 'Fix guide failed',
      details: err.details || undefined
    });
  }
}

// ─────────────────────────────────────────────────────────────
//  FULL ANALYSIS PIPELINE
// ─────────────────────────────────────────────────────────────
async function runFullAnalysis({ apiKey, mimeType, imageBase64, isDemoMode }) {
  // ── PASS 1: scene classification ──────────────────────────
  const sceneType = await classifyScene({ apiKey, mimeType, imageBase64 });
  console.log(`[analyze] scene detected: ${sceneType}`);

  // ── PASS 2: deep ADA analysis ────────────────────────────
  const rawAnalysis = await requestGeminiJson({
    apiKey, mimeType, imageBase64,
    prompt:          buildAnalysisPrompt(sceneType, isDemoMode),
    schema:          ANALYSIS_SCHEMA,
    temperature:     isDemoMode ? 0.25 : 0.10,
    maxOutputTokens: 8000
  });

  const analysis = normalizeAnalysis(rawAnalysis, sceneType);

  // ── PASS 3: bounding-box localization ────────────────────
  try {
    const localized = await requestGeminiJson({
      apiKey, mimeType, imageBase64,
      prompt:          buildLocalizationPrompt(analysis.findings),
      schema:          LOCALIZATION_SCHEMA,
      temperature:     0.05,
      maxOutputTokens: 2000
    });
    applyLocalizedBoxes(analysis.findings, localized?.boxes);
  } catch (err) {
    console.warn('[localize] skipped:', err.publicMessage || err.message);
  }

  return analysis;
}

// ─────────────────────────────────────────────────────────────
//  SCENE CLASSIFIER
//  One tiny Gemini call — returns a short scene label so the
//  analysis prompt can be hyper-targeted to the actual space.
// ─────────────────────────────────────────────────────────────
const SCENE_CLASSIFIER_SCHEMA = {
  type: 'object',
  properties: { scene: { type: 'string' } },
  required: ['scene']
};

async function classifyScene({ apiKey, mimeType, imageBase64 }) {
  try {
    const result = await requestGeminiJson({
      apiKey, mimeType, imageBase64,
      prompt: [
        'Identify the primary space or built environment shown in this image.',
        'Return a single short label from this list, choosing the best match:',
        'parking_lot | entrance_exterior | interior_corridor | restroom | ramp_stairway | sidewalk_crosswalk | elevator | retail_counter | reception_desk | office_space | playground | pool_area | hotel_room | bus_stop_transit | unknown',
        'Return JSON only. Example: {"scene":"parking_lot"}'
      ].join('\n'),
      schema:          SCENE_CLASSIFIER_SCHEMA,
      temperature:     0.05,
      maxOutputTokens: 80
    });
    return result?.scene || 'unknown';
  } catch {
    return 'unknown';
  }
}

// ─────────────────────────────────────────────────────────────
//  ANALYSIS PROMPT — scene-aware, hyper-detailed
// ─────────────────────────────────────────────────────────────
const SCENE_FOCUS = {
  parking_lot: `
PARKING-SPECIFIC CHECKS (inspect every one):
- Accessible parking space count vs total lot (ADA 208.2 table)
- Van-accessible space presence and dimensions — 11 ft wide + 5 ft aisle or 8 ft wide + 8 ft aisle (ADA 502.2)
- Access aisle width: 60 in minimum for car spaces, 96 in for van spaces (ADA 502.3)
- Access aisle diagonal stripe pattern and visibility (ADA 502.3.3)
- Obstructions IN or blocking the access aisle or parking space (vehicles, carts, cones, barriers)
- ISA pavement symbol condition — faded, cracked, missing (ADA 502.6)
- Vertical sign presence, ISA, mounting height ≥60 in to bottom, van-accessible text (ADA 502.6, 703.7.2)
- Penalty/fine text on sign per local code
- Surface condition: stable, firm, slip-resistant (ADA 302.1)
- Running slope of space and aisle ≤2% (ADA 502.4)
- Cross slope ≤2% (ADA 502.4)
- Connection to accessible route from space to building entrance (ADA 502.7)
- Wheel stops, curbs, or barriers that would block a ramp deployment
`,
  entrance_exterior: `
ENTRANCE-SPECIFIC CHECKS:
- Door clear width ≥32 in when open 90°, ideally ≥36 in (ADA 404.2.3)
- Maneuvering clearances at pull and push side (ADA 404.2.4)
- Threshold height ≤1/2 in, beveled if >1/4 in (ADA 404.2.5)
- Door hardware: lever, loop, or push — no tight grip or twist required (ADA 404.2.7)
- Opening force ≤5 lbf interior, fire doors up to 15 lbf (ADA 404.2.9)
- Automatic door presence where manual force is non-compliant
- Accessible route from parking/public way to entrance (ADA 402)
- Ramp presence if entrance is elevated — slope ≤1:12, width ≥36 in (ADA 405)
- Handrails on ramps if rise >6 in (ADA 505)
- Level landing at door — 60 in deep minimum (ADA 404.2.4)
- Signage for accessible entrance if this is not the primary entrance (ADA 216.6)
- Protruding objects at head height along approach (ADA 307)
`,
  interior_corridor: `
CORRIDOR-SPECIFIC CHECKS:
- Minimum 36 in clear width, 60 in at passing spaces (ADA 403.5)
- Obstacles or clutter reducing clear width
- Floor surface: stable, firm, slip-resistant; carpet pile ≤1/2 in (ADA 302)
- Level changes: flush ≤1/4 in, beveled ≤1/2 in, ramp for anything greater (ADA 303)
- Protruding objects: wall-mounted items between 27-80 in AFF must not protrude >4 in (ADA 307.2)
- Overhead clearance ≥80 in (ADA 307.4)
- Handrail continuity if corridor is a ramp
- Lighting adequacy for low-vision navigation (best practice)
- Accessible route to all rooms / amenities
- Emergency egress signage and visibility
`,
  restroom: `
RESTROOM-SPECIFIC CHECKS:
- Accessible stall: 60 in wide × 56 in deep minimum for wall-hung toilet, 59 in for floor-mounted (ADA 604.3)
- Toilet centerline 16-18 in from side wall (ADA 604.2)
- Toilet seat height 17-19 in AFF (ADA 604.4)
- Grab bars: rear wall 36 in min at 33-36 in AFF, side wall 42 in min (ADA 604.5)
- Turning radius: 60 in diameter clear floor space in restroom (ADA 603.2)
- Lavatory knee clearance 27 in high × 30 in wide × 19 in deep (ADA 606.2)
- Lavatory height ≤34 in to rim (ADA 606.3)
- Insulated pipes under lavatory (ADA 606.5)
- Mirror bottom ≤40 in AFF or full-length (ADA 603.3)
- Faucet: operable without tight grip, lever or sensor preferred (ADA 606.4)
- Dispensers, hand dryers, accessories at reach range 15-48 in (ADA 308)
- Door: 32 in clear width, outswing preferred or 18 in latch side clearance (ADA 404.2.3)
- Stall door hardware and latch operability
`,
  ramp_stairway: `
RAMP/STAIR-SPECIFIC CHECKS:
- Ramp slope ≤1:12 (8.33%) — measure visible run vs rise visually (ADA 405.2)
- Ramp width ≥36 in clear (ADA 405.5)
- Handrails both sides if ramp rise >6 in, at 34-38 in AFF (ADA 505.4)
- Handrail extensions 12 in horizontal at top, 1 slope length + 12 in at bottom (ADA 505.10)
- Edge protection: curb, barrier, or extended surface to prevent wheel rolloff (ADA 405.9)
- Landings at top and bottom ≥60 in × 60 in (ADA 405.7)
- Cross slope ≤2% (ADA 405.3)
- Surface: stable, firm, slip-resistant with visual contrast at top/bottom (ADA 302, 405.4)
- Detectable warning surfaces at bottom of ramp if it enters a vehicular way (ADA 705)
- Stair nosing: non-abrupt profile, no projection >1.5 in (ADA 504.5)
- Stair handrails: graspable profile, continuous, 34-38 in AFF (ADA 504.6)
- Alternative accessible route present if stairs only (ADA 206.2)
`,
  sidewalk_crosswalk: `
SIDEWALK/CROSSWALK-SPECIFIC CHECKS:
- Curb ramp presence at each corner (ADA 406)
- Curb ramp slope ≤1:12 (ADA 406.2)
- Curb ramp width ≥36 in (ADA 406.5)
- Detectable warning surface (truncated domes): 24 in deep, full ramp width, contrasting color (ADA 705)
- Detectable warning condition — not cracked, faded, or missing domes
- Crosswalk markings presence and visibility
- Curb ramp surface condition — broken, cracked, heaved, or obstructed
- Transition from ramp to street — flush, no lip >1/2 in
- Running slope of sidewalk ≤5% for accessible route (ADA 403.3)
- Cross slope ≤2% (ADA 403.3)
- Clear width ≥36 in unobstructed (ADA 403.5)
- Overhanging vegetation or signage creating overhead hazards (ADA 307.4)
- Obstructions: utility poles, bollards, street furniture in path
- Pedestrian signal (APS) presence and reachability
`,
  elevator: `
ELEVATOR-SPECIFIC CHECKS:
- Car dimensions: ≥80 in deep × 68 in wide for center-opening doors (ADA 407.4)
- Door clear width ≥36 in (ADA 407.3.3)
- Door reopening device — sensor at 5 in and 29 in AFF (ADA 407.3.3)
- Control buttons: ≥3/4 in, raised or flush, braille adjacent (ADA 407.4.6)
- Control reach range: 15-48 in AFF side approach (ADA 308)
- Floor indicator inside car and over door outside (ADA 407.4.7)
- Emergency controls at bottom, ≥35 in AFF (ADA 407.4.6)
- Handrail on at least one wall at 34-38 in AFF (ADA 407.4.8)
- Floor surface non-slip, stable (ADA 407.4.4)
- Two-way communication system (ADA 407.4.9)
- Call button height outside: 15-48 in AFF (ADA 407.2.1)
- Lobby turning space ≥60 in diameter (ADA 407.2.2)
`,
  retail_counter: `
RETAIL/SERVICE COUNTER CHECKS:
- Counter height ≤36 in for accessible portion — minimum 36 in wide section (ADA 904.4)
- Knee clearance at sit-down counters: 27 in high × 30 in wide × 19 in deep (ADA 306)
- Reach ranges for merchandise, checkout: 15-48 in (ADA 308)
- Aisle width between fixtures ≥36 in, 44 in preferred (ADA 403.5)
- Floor surface transition at entry mats (ADA 302)
- Point-of-sale terminal reach and operability (ADA 707)
- Seating for waiting: accessible seating options (ADA 902)
`,
  unknown: `
GENERAL CHECKS — apply all that are visible:
- Accessible route continuity and width (ADA 402, 403)
- Floor/ground surface quality (ADA 302)
- Level changes and transitions (ADA 303)
- Protruding objects (ADA 307)
- Reach ranges for controls and operable parts (ADA 308)
- Signage mounting and legibility (ADA 703)
- Parking if visible (ADA 502)
- Ramps if visible (ADA 405)
- Doors if visible (ADA 404)
- Restroom fixtures if visible (ADA 603-608)
- Dynamic obstructions blocking any accessible feature
`
};

function buildAnalysisPrompt(sceneType, isDemoMode) {
  const sceneFocus = SCENE_FOCUS[sceneType] || SCENE_FOCUS.unknown;

  return `You are the most thorough ADA accessibility inspector in the country. Your job is to produce a field-grade remediation report from a single photograph. Real facilities managers, disability rights attorneys, and ADA compliance specialists will act on your findings. Be exhaustive, specific, and honest.

━━━ CORE RULES ━━━
1. Analyze ONLY what is visible. Never hallucinate dimensions. If you cannot visually confirm a measurement, say so explicitly.
2. Identify EVERY visible accessibility element — compliant, non-compliant, and partially compliant.
3. For EVERY element you identify, produce a finding. Do not bundle multiple issues into one finding.
4. Use real ADA 2010 Standards for Accessible Design section numbers.
5. Costs must be realistic US contractor USD ranges. Do not guess wildly.
6. Priority is 1-10 integer. 9-10 = immediate safety/legal crisis. 7-8 = clear violation. 5-6 = moderate. 3-4 = low/unverifiable. 1-2 = compliant note.
7. Every finding MUST have a unique id like F1, F2, F3...
8. For every finding, the "required" field must quote the specific ADA 2010 standard requirement verbatim or paraphrase it precisely - never leave it empty. Example: "Ramp slopes shall not exceed 1:12 (8.33%). ADA 405.2"
9. Return JSON only. No markdown, no prose outside JSON.

━━━ SEVERITY DEFINITIONS — FOLLOW EXACTLY ━━━
type = "critical" when ANY of these are true:
  - A vehicle, object, or person is physically blocking an accessible parking space, access aisle, curb ramp, accessible route, doorway, or maneuvering clearance
  - A ramp, curb ramp, or accessible path surface is so damaged, broken, or deteriorated that a wheelchair could not safely traverse it
  - A required accessible route is completely absent or physically impassable
  - A required grab bar is absent in a restroom stall
  - A door clearly cannot be operated without tight grasping or has a non-compliant threshold that would stop a wheelchair
  - Any condition that poses immediate physical danger to a person with a disability

type = "warning" when:
  - A condition likely violates ADA but cannot be fully confirmed from the image alone (unverifiable dimensions)
  - Markings or signage are faded, damaged, or partially non-compliant
  - A dimension appears non-compliant but needs field measurement to confirm
  - A required element appears present but has unverifiable details (sign height, aisle width)

type = "compliant" when:
  - An element is clearly present and appears to meet ADA requirements from visible evidence

━━━ DYNAMIC OBSTRUCTION CHECK — MANDATORY ━━━
Before producing any other finding, scan the image for:
  - Any vehicle parked in or touching an accessible parking space or access aisle → CRITICAL, priority 10
  - Any vehicle, equipment, or stored items blocking a curb ramp → CRITICAL, priority 10
  - Any object blocking a doorway or accessible route → CRITICAL, priority 9
  - Any cone, chain, or temporary barrier blocking accessible features → CRITICAL, priority 9

━━━ SCENE-SPECIFIC CHECKLIST ━━━
Scene detected: ${sceneType.replace(/_/g, ' ').toUpperCase()}
${sceneFocus}

━━━ BOUNDING BOX RULES ━━━
- x, y = top-left corner of the box as % of image width/height (0-100)
- width, height = size as % of image dimensions (0-100)
- Be tight. Box the actual element, not the whole image.
- For obstructing vehicles: box the vehicle itself.
- For faded markings: box the marking area on the ground.
- If you cannot localize the finding, set all bbox values to 0.

━━━ REPORT QUALITY RULES ━━━
- riskScore must be an integer 0-100, calibrated to the severity of actual violations. A blocked accessible space = 85-95. Faded markings only = 40-60. All compliant = 5-15.
- costSummary.items must list EACH non-compliant finding separately with its own cost range.
- priorityQueue must reference real finding ids from your findings array, ordered highest priority first.
- nextSteps must be specific, actionable, and addressed to the right party (contractor type, facilities management, property owner).
- certification.status: use "VIOLATIONS FLAGGED" if any critical, "NON-COMPLIANT" if any warning without critical, "COMPLIANT" only if no issues.
${isDemoMode ? '\nBe maximally exhaustive — surface every possible finding the image supports.' : ''}`;
}

// ─────────────────────────────────────────────────────────────
//  LOCALIZATION PROMPT
// ─────────────────────────────────────────────────────────────
function buildLocalizationPrompt(findings) {
  const lines = findings.map(f =>
    `- ${f.id} [${f.type.toUpperCase()}]: ${f.element}. ${f.detected || f.description}`
  );
  return [
    'For each finding below, return a tight bounding box around the exact visible element or area in the uploaded image.',
    'x, y = top-left corner as % of image (0-100). width, height = size as % of image (0-100).',
    'If the finding targets an obstructing vehicle, box the vehicle. If it targets a marking, box the marking area.',
    'If a finding cannot be localized, return 0 for all bbox values.',
    'measurementLabel: short human-readable label like "~28in clear" or "vehicle in aisle" or "faded ISA".',
    'Return JSON only.',
    '',
    'Findings:',
    ...lines
  ].join('\n');
}

// ─────────────────────────────────────────────────────────────
//  NORMALIZATION PIPELINE
// ─────────────────────────────────────────────────────────────
function normalizeAnalysis(raw, sceneType) {
  const findings = Array.isArray(raw?.findings)
    ? raw.findings.map((f, i) => normalizeFinding(f, i)).filter(Boolean)
    : [];

  if (!findings.length) {
    throw apiError(502, 'Gemini returned no findings for this image. Try a clearer photo.');
  }

  const summary = normalizeSummary(raw?.summary, findings);
  const report  = normalizeReport(raw?.report, findings, summary, sceneType);

  if (!summary.immediateActions.length) {
    summary.immediateActions = report.nextSteps.slice(0, 3);
  }

  return { summary, report, findings };
}

function normalizeSummary(raw, findings) {
  return {
    headline:         str(raw?.headline, buildFallbackHeadline(findings)),
    overview:         str(raw?.overview,  buildFallbackOverview(findings)),
    immediateActions: strList(raw?.immediateActions, 6)
  };
}

function normalizeReport(raw, findings, summary, sceneType) {
  const modelScore   = nullInt(raw?.riskScore);
  const derivedScore = deriveRiskScore(findings);
  // Take whichever is higher — never let the model low-ball a serious scene
  const riskScore    = modelScore === null
    ? derivedScore
    : Math.min(100, Math.max(derivedScore, clamp(modelScore, 0, 100)));

  const costSummary   = normalizeCostSummary(raw?.costSummary, findings);
  const priorityQueue = normalizePriorityQueue(raw?.priorityQueue, findings);
  const nextSteps     = strList(raw?.nextSteps, 8);
  const certStatus    = str(raw?.certification?.status,
    findings.some(f => f.type === 'critical') ? 'VIOLATIONS FLAGGED'
    : findings.some(f => f.type === 'warning') ? 'NON-COMPLIANT'
    : 'COMPLIANT');

  return {
    title:       str(raw?.title, summary.headline),
    riskScore,
    riskVerdict: deriveRiskVerdict(riskScore),
    riskSummary: str(raw?.riskSummary, buildFallbackRiskSummary(findings)),
    costSummary,
    priorityQueue,
    nextSteps:   nextSteps.length ? nextSteps : buildFallbackNextSteps(findings),
    certification: {
      status: certStatus,
      note:   str(raw?.certification?.note,
        'AI-generated from visible conditions only. Always confirm dimensions and ADA interpretation with a qualified accessibility specialist before construction or legal proceedings.')
    }
  };
}

function normalizeFinding(raw, idx) {
  if (!raw || typeof raw !== 'object') return null;

  const rawType = String(raw.type || '').toLowerCase();
  const baseType = ['critical', 'warning', 'compliant'].includes(rawType) ? rawType : 'warning';
  const rawPriority = clamp(toInt(raw.priority, baseType === 'critical' ? 8 : baseType === 'warning' ? 5 : 2), 1, 10);

  // Severity overrides — we enforce these regardless of what the model says
  const severity = resolveSeverity({
    type:        baseType,
    priority:    rawPriority,
    element:     raw.element,
    title:       raw.title,
    description: raw.description,
    detected:    raw.detected,
    required:    raw.required,
    standard:    raw.standard
  });

  return {
    id:               normalizeFindingId(raw.id, idx),
    type:             severity.type,
    element:          str(raw.element,     'Unlabeled element'),
    standard:         str(raw.standard,    ''),
    title:            str(raw.title,       raw.element || `Finding ${idx + 1}`),
    description:      str(raw.description, ''),
    required:         str(raw.required,    ''),
    detected:         str(raw.detected,    ''),
    fixCost:          nullStr(raw.fixCost),
    contractor:       nullStr(raw.contractor),
    timeline:         nullStr(raw.timeline),
    priority:         severity.priority,
    measurementLabel: nullStr(raw.measurementLabel),
    bbox:             normalizeBBox(raw.bbox)
  };
}

// ─────────────────────────────────────────────────────────────
//  SEVERITY RESOLVER
//  This is the core enforcement layer. It overrides whatever
//  the model returned with ground-truth rules.
// ─────────────────────────────────────────────────────────────
function resolveSeverity({ type, priority, element, title, description, detected, required, standard }) {
  const text = `${element} ${title} ${description} ${detected} ${required} ${standard}`.toLowerCase();

  // ── CRITICAL UPGRADES ───────────────────────────────────
  // 1. Vehicle or object blocking ANY accessible feature
  if (isBlockingObstruction(text)) {
    return { type: 'critical', priority: Math.max(priority, 9) };
  }

  // 2. Physically impassable surface on an accessible route
  if (isImpassableSurface(text)) {
    return { type: 'critical', priority: Math.max(priority, 8) };
  }

  // 3. Complete absence of a required accessible route
  if (isAbsentRoute(text)) {
    return { type: 'critical', priority: Math.max(priority, 8) };
  }

  // 4. Missing grab bar in restroom
  if (isMissingGrabBar(text)) {
    return { type: 'critical', priority: Math.max(priority, 8) };
  }

  // 5. Non-operable door (stuck, requires excessive force, wrong hardware)
  if (isNonOperableDoor(text)) {
    return { type: 'critical', priority: Math.max(priority, 7) };
  }

  // ── WARNING CAPS ────────────────────────────────────────
  // Faded/worn markings are never more than a warning
  if (isFadedMarking(text)) {
    const safeType = type === 'compliant' ? 'warning' : type;
    return { type: safeType, priority: clamp(priority, 3, 7) };
  }

  // Unverifiable sign details are LOW warnings — don't inflate
  if (isUnverifiableSignHeight(text)) {
    return { type: type === 'critical' ? 'warning' : type, priority: clamp(priority, 1, 4) };
  }

  // ── COMPLIANT GUARD ─────────────────────────────────────
  // Never let a compliant finding get promoted to critical/warning by accident
  if (type === 'compliant') {
    return { type: 'compliant', priority: clamp(priority, 1, 3) };
  }

  return { type, priority };
}

// ── Pattern matchers ──────────────────────────────────────
function isBlockingObstruction(t) {
  const hasVehicle  = /(vehicle|car|truck|van|suv|automobile|sedan|wagon|pickup)/.test(t);
  const hasBlock    = /(block|blocking|obstruct|obstruction|parked in|parked on|occupi|encroach)/.test(t);
  const hasFeature  = /(access aisle|accessible space|accessible parking|parking space|stall|curb ramp|accessible route|doorway|maneuvering|path of travel|ramp|sidewalk)/.test(t);
  const hasObject   = /(stored|equipment|dumpster|cart|cone|bollard|furniture|barrier|chain|lock|gate)/.test(t);
  const hasObjBlock = hasObject && hasBlock && hasFeature;
  return (hasVehicle && hasBlock && hasFeature) || hasObjBlock;
}

function isImpassableSurface(t) {
  const hasBad  = /(severely|completely|entirely|totally|heavily|extremely|significant|major|large|extensive)/.test(t);
  const hasVerb = /(deteriorat|broken|destroyed|collapse|impassable|unusable|hazardous|crumbl|sever crack|spall|heav|sunken|missing chunk|rubble|debris|displaced)/.test(t);
  const hasItem = /(ramp|curb ramp|curb cut|sidewalk|path|route|surface|walkway|pavement|concrete|asphalt)/.test(t);
  return hasBad && hasVerb && hasItem;
}

function isAbsentRoute(t) {
  return /(no accessible route|accessible route is absent|no ramp|no curb cut|no curb ramp|missing ramp|missing curb|no path|inaccessible entrance|no accessible entrance)/.test(t);
}

function isMissingGrabBar(t) {
  return /(grab bar|grab rail)/.test(t) && /(missing|absent|not present|no grab|none visible|required but)/.test(t);
}

function isNonOperableDoor(t) {
  return /(door|entrance|entry)/.test(t)
    && /(cannot be opened|requires tight|knob only|round knob|excessive force|non-operable|inoperable|stuck|locked|no hardware|no handle)/.test(t);
}

function isFadedMarking(t) {
  return /(faded|worn|barely visible|nearly invisible|weathered|unclear marking)/.test(t)
    && /(marking|stripe|stripes|paint|painted|symbol|isa|logo|pattern)/.test(t);
}

function isUnverifiableSignHeight(t) {
  return /(sign|signage)/.test(t)
    && /(height|mounting height|bottom of sign)/.test(t)
    && /(cannot verify|not visible|unverifiable|unable to|unclear|not measurable|cannot be confirmed|cannot confirm)/.test(t);
}

// ─────────────────────────────────────────────────────────────
//  RISK SCORING
// ─────────────────────────────────────────────────────────────
function deriveRiskScore(findings) {
  const base = findings.reduce((sum, f) => {
    if (f.type === 'critical') return sum + f.priority * 7;
    if (f.type === 'warning')  return sum + f.priority * 3;
    return sum;
  }, 0);
  return clamp(Math.round(base), 0, 100);
}

function deriveRiskVerdict(score) {
  if (score >= 75) return 'HIGH LEGAL EXPOSURE';
  if (score >= 45) return 'MODERATE RISK';
  if (score >= 20) return 'LOWER RISK — REVIEW REQUIRED';
  return 'MINIMAL RISK';
}

// ─────────────────────────────────────────────────────────────
//  PRIORITY QUEUE
// ─────────────────────────────────────────────────────────────
function normalizePriorityQueue(raw, findings) {
  const validIds = new Set(findings.map(f => f.id));
  const queue    = Array.isArray(raw) ? raw : [];

  const normalized = queue.map(item => {
    if (!item || typeof item !== 'object') return null;
    const findingId = str(item.findingId, '');
    if (!findingId || !validIds.has(findingId)) return null;
    const match = findings.find(f => f.id === findingId);
    return {
      findingId,
      label:  str(item.label,  match?.element || findingId),
      reason: str(item.reason, match?.title   || '')
    };
  }).filter(Boolean).slice(0, 6);

  if (normalized.length) return normalized;

  // Fallback: auto-generate from findings sorted by severity + priority
  return findings
    .filter(f => f.type !== 'compliant')
    .sort((a, b) => {
      const typeScore = v => v.type === 'critical' ? 1000 : 0;
      return (typeScore(b) + b.priority) - (typeScore(a) + a.priority);
    })
    .slice(0, 6)
    .map(f => ({
      findingId: f.id,
      label:     f.element,
      reason:    f.title || f.standard || 'Highest visible remediation priority.'
    }));
}

// ─────────────────────────────────────────────────────────────
//  COST SUMMARY
// ─────────────────────────────────────────────────────────────
function normalizeCostSummary(raw, findings) {
  const items = Array.isArray(raw?.items)
    ? raw.items.map(item => {
        if (!item || typeof item !== 'object') return null;
        const label  = str(item.label,  '');
        const amount = str(item.amount, '');
        return label && amount ? { label, amount } : null;
      }).filter(Boolean).slice(0, 10)
    : [];

  let low  = nullInt(raw?.low);
  let high = nullInt(raw?.high);

  if (low === null || high === null) {
    const totals = sumCostRanges(findings);
    if (low  === null) low  = totals.low;
    if (high === null) high = totals.high;
  }
  if (low !== null && high !== null && high < low) high = low;

  return {
    low,
    high,
    display: str(raw?.display, formatCost(low, high)),
    notes:   str(raw?.notes,
      low !== null
        ? 'Estimates reflect visible-condition remediation only. Permitting, finish specs, and field conditions affect final cost.'
        : 'Insufficient visible detail to generate a cost estimate for all findings.'),
    items: items.length ? items : findings
      .filter(f => f.type !== 'compliant' && f.fixCost)
      .slice(0, 10)
      .map(f => ({ label: f.element, amount: f.fixCost }))
  };
}

function sumCostRanges(findings) {
  let low = 0, high = 0, any = false;
  findings.forEach(f => {
    const r = parseCostRange(f.fixCost);
    if (!r) return;
    any = true; low += r.low; high += r.high;
  });
  return any ? { low, high } : { low: null, high: null };
}

function parseCostRange(input) {
  if (!input) return null;
  const nums = String(input).match(/[\d,]+/g);
  if (!nums || !nums.length) return null;
  const lo = parseInt(nums[0].replace(/,/g, ''), 10);
  const hi = parseInt((nums[1] || nums[0]).replace(/,/g, ''), 10);
  if (!isFinite(lo) || !isFinite(hi)) return null;
  return { low: lo, high: Math.max(lo, hi) };
}

function formatCost(low, high) {
  if (low === null || high === null) return 'N/A';
  return `$${low.toLocaleString()} - $${high.toLocaleString()}`;
}

// ─────────────────────────────────────────────────────────────
//  BOUNDING BOX NORMALIZATION
// ─────────────────────────────────────────────────────────────
function normalizeBBox(raw) {
  if (!raw || typeof raw !== 'object') return null;

  let x = pick(raw, 'x', 'left', 'minX', 'xMin');
  let y = pick(raw, 'y', 'top',  'minY', 'yMin');
  let w = pick(raw, 'width', 'w');
  let h = pick(raw, 'height', 'h');

  const right  = pick(raw, 'right',  'maxX', 'xMax');
  const bottom = pick(raw, 'bottom', 'maxY', 'yMax');

  if ((w === undefined || h === undefined) && right !== undefined && bottom !== undefined) {
    w = Number(right)  - Number(x || 0);
    h = Number(bottom) - Number(y || 0);
  }

  let vals = [x, y, w, h].map(Number);
  if (!vals.every(Number.isFinite)) return null;

  const max = Math.max(...vals);
  if      (max <= 1)    vals = vals.map(v => v * 100);
  else if (max > 100)   vals = vals.map(v => v / (max <= 1000 ? 10 : 1));

  let [nx, ny, nw, nh] = vals.map(v => clamp(v, 0, 100));
  if (nw < 2 || nh < 2 || nx >= 100 || ny >= 100) return null;

  return {
    x:      Math.min(nx, 98),
    y:      Math.min(ny, 98),
    width:  Math.min(nw, 100 - nx),
    height: Math.min(nh, 100 - ny)
  };
}

function applyLocalizedBoxes(findings, rawBoxes) {
  if (!Array.isArray(rawBoxes)) return;
  const byId = new Map();
  rawBoxes.forEach(item => {
    if (!item || typeof item !== 'object') return;
    const id = str(item.id, '');
    if (id) byId.set(id, {
      bbox:             normalizeBBox(item.bbox),
      measurementLabel: nullStr(item.measurementLabel)
    });
  });
  findings.forEach(f => {
    const loc = byId.get(f.id);
    if (!loc) return;
    if (loc.bbox)             f.bbox             = loc.bbox;
    if (loc.measurementLabel) f.measurementLabel = loc.measurementLabel;
  });
}

// ─────────────────────────────────────────────────────────────
//  FALLBACK TEXT BUILDERS
// ─────────────────────────────────────────────────────────────
function buildFallbackHeadline(findings) {
  const crits  = findings.filter(f => f.type === 'critical').length;
  const warns  = findings.filter(f => f.type === 'warning').length;
  if (crits)  return `${crits} Critical ADA Violation${crits > 1 ? 's' : ''} Require Immediate Attention`;
  if (warns)  return `${warns} ADA Warning${warns > 1 ? 's' : ''} Identified — Verification Required`;
  return 'Accessibility Conditions Review';
}

function buildFallbackOverview(findings) {
  const crits = findings.filter(f => f.type === 'critical').length;
  const warns = findings.filter(f => f.type === 'warning').length;
  const oks   = findings.filter(f => f.type === 'compliant').length;
  return `Gemini identified ${crits} critical violation${crits !== 1 ? 's' : ''}, ${warns} warning${warns !== 1 ? 's' : ''}, and ${oks} compliant element${oks !== 1 ? 's' : ''} from visible conditions.`;
}

function buildFallbackRiskSummary(findings) {
  const top = [...findings]
    .filter(f => f.type !== 'compliant')
    .sort((a, b) => {
      const ts = v => v.type === 'critical' ? 1000 : 0;
      return (ts(b) + b.priority) - (ts(a) + a.priority);
    })[0];
  if (!top) return 'No significant compliance issues were visible in this image based on available evidence.';
  return `${top.element} represents the highest visible remediation priority. Overall legal exposure is driven by the combination of finding severity and quantity in the scene.`;
}

function buildFallbackNextSteps(findings) {
  return [...findings]
    .filter(f => f.type !== 'compliant')
    .sort((a, b) => {
      const ts = v => v.type === 'critical' ? 1000 : 0;
      return (ts(b) + b.priority) - (ts(a) + a.priority);
    })
    .slice(0, 5)
    .map(f => {
      const actor = f.contractor || 'Facilities management';
      return `${actor}: address "${f.element}" — ${f.title}`;
    });
}

// ─────────────────────────────────────────────────────────────
//  GEMINI API WRAPPER
// ─────────────────────────────────────────────────────────────
async function requestGeminiJson({ apiKey, mimeType, imageBase64, prompt, schema, temperature, maxOutputTokens }) {
  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    let useSchema = attempt === 0 ? schema : null; // fallback: drop schema on retry

    let upstream;
    try {
      upstream = await callGeminiApi({ apiKey, mimeType, imageBase64, prompt, schema: useSchema, temperature, maxOutputTokens });
    } catch (fetchErr) {
      lastError = fetchErr;
      continue;
    }

    const data = await upstream.json().catch(() => ({}));

    // Handle "too many states" — retry without schema
    if (!upstream.ok && String(data.error?.message || '').includes('too many states')) {
      useSchema = null;
      const retried = await callGeminiApi({ apiKey, mimeType, imageBase64, prompt, schema: null, temperature, maxOutputTokens }).catch(() => null);
      if (retried) {
        const d2 = await retried.json().catch(() => ({}));
        if (retried.ok) {
          return parseGeminiResponse(d2);
        }
      }
    }

    if (!upstream.ok) {
      const msg = data.error?.message || `Gemini API error ${upstream.status}`;
      lastError = apiError(upstream.status >= 500 ? 502 : upstream.status, msg);
      lastError.details = data;
      // Don't retry auth errors
      if (upstream.status === 401 || upstream.status === 403) break;
      continue;
    }

    try {
      return parseGeminiResponse(data);
    } catch (parseErr) {
      lastError = parseErr;
      // Retry on parse failure
    }
  }

  throw lastError || apiError(502, 'Gemini analysis failed after retries');
}

async function callGeminiApi({ apiKey, mimeType, imageBase64, prompt, schema, temperature, maxOutputTokens }) {
  const genConfig = {
    temperature,
    maxOutputTokens,
    responseMimeType: 'application/json'
  };
  if (schema) genConfig.responseJsonSchema = schema;

  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`,
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType, data: imageBase64 } }
          ]
        }],
        generationConfig: genConfig
      })
    }
  );
}

async function requestGeminiText({ apiKey, contents, temperature, maxOutputTokens }) {
  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    let upstream;
    try {
      upstream = await callGeminiTextApi({ apiKey, contents, temperature, maxOutputTokens });
    } catch (fetchErr) {
      lastError = fetchErr;
      continue;
    }

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      const msg = data.error?.message || `Gemini API error ${upstream.status}`;
      lastError = apiError(upstream.status >= 500 ? 502 : upstream.status, msg);
      lastError.details = data;
      if (upstream.status === 401 || upstream.status === 403) break;
      continue;
    }

    const text = parseGeminiText(data);
    if (text) return text;
    lastError = apiError(502, 'Gemini returned an empty chat response');
  }

  throw lastError || apiError(502, 'Gemini chat failed after retries');
}

async function callGeminiTextApi({ apiKey, contents, temperature, maxOutputTokens }) {
  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature,
          maxOutputTokens
        }
      })
    }
  );
}

function parseGeminiResponse(data) {
  const parts = data?.candidates?.[0]?.content?.parts;
  const raw   = Array.isArray(parts)
    ? parts.map(p => (typeof p?.text === 'string' ? p.text : '')).join('').trim()
    : '';

  if (!raw) {
    throw apiError(502, 'Gemini returned an empty response');
  }

  // Try direct parse
  try { return JSON.parse(raw); } catch {}

  // Try extracting JSON object from text
  const first = raw.indexOf('{');
  const last  = raw.lastIndexOf('}');
  if (first !== -1 && last > first) {
    try { return JSON.parse(raw.slice(first, last + 1)); } catch {}
  }

  const err = apiError(502, 'Gemini response could not be parsed as JSON');
  err.raw = raw.slice(0, 500);
  throw err;
}

function parseGeminiText(data) {
  const parts = data?.candidates?.[0]?.content?.parts;
  const text  = Array.isArray(parts)
    ? parts.map(p => (typeof p?.text === 'string' ? p.text : '')).join('').trim()
    : '';

  if (!text) {
    throw apiError(502, 'Gemini returned an empty response');
  }

  return text;
}

function buildFixGuidePrompt(finding) {
  return `You are an expert ADA accessibility consultant. Produce a practical step-by-step remediation guide for the following finding.

FINDING: ${String(finding.element || 'Unknown')}
ADA STANDARD: ${String(finding.standard || 'N/A')}
ISSUE: ${String(finding.title || 'N/A')}
DETECTED: ${String(finding.detected || 'N/A')}
REQUIRED: ${String(finding.required || 'N/A')}
ESTIMATED COST: ${String(finding.fixCost || 'Unknown')}
CONTRACTOR: ${String(finding.contractor || 'General contractor')}

Write a guide with these sections, using plain text (no markdown):

OVERVIEW
2-3 sentences explaining the violation and its impact on users with disabilities.

STEP-BY-STEP REMEDIATION
Numbered steps a contractor would follow to fix this. Be specific about dimensions, materials, and methods.

MATERIALS & SPECIFICATIONS
List what is needed: materials, dimensions, products.

ADA COMPLIANCE CHECKLIST
Bullet list of what to verify after remediation to confirm compliance.

COST BREAKDOWN
Realistic labor and material cost ranges for each major step.

Keep it practical, specific, and actionable.`;
}

// ─────────────────────────────────────────────────────────────
//  STATIC FILE SERVING
// ─────────────────────────────────────────────────────────────
const ROUTES = {
  '/':              'index.html',
  '/index.html':    'index.html',
  '/analyze':       'annalyzer.html',
  '/annalyzer.html':'annalyzer.html'
};

function serveStatic(reqPath, res, headOnly) {
  const target   = ROUTES[reqPath] || reqPath.replace(/^\/+/, '');
  const filePath = path.resolve(ROOT, target);

  if (!filePath.startsWith(ROOT)) {
    return sendJson(res, 403, { error: 'Forbidden' });
  }

  fs.readFile(filePath, (err, buf) => {
    if (err) {
      const status = err.code === 'ENOENT' ? 404 : 500;
      res.writeHead(status, apiHeaders({ 'Content-Type': 'text/plain; charset=utf-8' }));
      res.end(status === 404 ? 'Not found' : 'Internal server error');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, apiHeaders({
      'Content-Type':   MIME[ext] || 'application/octet-stream',
      'Content-Length': buf.length
    }));
    if (!headOnly) res.end(buf);
    else           res.end();
  });
}

// ─────────────────────────────────────────────────────────────
//  UTILITIES
// ─────────────────────────────────────────────────────────────
function apiHeaders(extra = {}) {
  return {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age':       '86400',
    ...extra
  };
}

function sendEmpty(res, code) {
  res.writeHead(code, apiHeaders({ 'Content-Length': 0 }));
  res.end();
}

function sendJson(res, code, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(code, apiHeaders({
    'Content-Type':   'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body)
  }));
  res.end(body);
}

async function readJsonBody(req) {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 25 * 1024 * 1024) throw new Error('Request too large');
  }
  return body ? JSON.parse(body) : {};
}

function apiError(statusCode, publicMessage) {
  const err = new Error(publicMessage);
  err.statusCode    = statusCode;
  err.publicMessage = publicMessage;
  return err;
}

function str(value, fallback) {
  const t = typeof value === 'string' ? value.trim() : String(value ?? '').trim();
  return t || fallback;
}

function nullStr(value) {
  const t = str(value, '');
  return t || null;
}

function strList(value, limit) {
  return Array.isArray(value)
    ? value.map(v => str(v, '')).filter(Boolean).slice(0, limit)
    : [];
}

function nullInt(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : null;
}

function toInt(value, fallback) {
  const n = nullInt(value);
  return n !== null ? n : fallback;
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

function pick(obj, ...keys) {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return undefined;
}

function normalizeFindingId(value, idx) {
  const clean = str(value, '').toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  return clean || `F${idx + 1}`;
}

function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return;
  fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach(rawLine => {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) return;
    const idx = line.indexOf('=');
    if (idx === -1) return;
    const key   = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key && !process.env[key]) process.env[key] = value;
  });
}
