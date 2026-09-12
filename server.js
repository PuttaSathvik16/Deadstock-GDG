require('dotenv').config();
const express = require('express');
const { Vonage } = require('@vonage/server-sdk');
const fs = require('fs');

const vonage = new Vonage({
  applicationId: process.env.VONAGE_APPLICATION_ID,
  privateKey: fs.readFileSync(process.env.VONAGE_PRIVATE_KEY_PATH),
});

const app = express();
app.use(express.static('public'));

let sessionId; // one shared room for the demo

app.get('/api/credentials', async (req, res) => {
  try {
    if (!sessionId) {
      const session = await vonage.video.createSession({ mediaMode: 'routed' });
      sessionId = session.sessionId;
    }
    const token = vonage.video.generateClientToken(sessionId, { role: 'publisher' });
    res.json({ applicationId: process.env.VONAGE_APPLICATION_ID, sessionId, token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
app.use(express.json({ limit: '10mb' }));

const MODEL = 'gemini-3.6-flash';

// 1. Frame -> material inventory
app.post('/api/scan', async (req, res) => {
  try {
    const r = await ai.models.generateContent({
      model: MODEL,
      contents: [{
        role: 'user',
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: req.body.image } },
          { text: `You are a textile inventory assistant. Identify each distinct fabric, trim, or garment piece visible.
Rules: describe only what is visible. Never state fiber composition as fact; use "visual cue suggests". Quantity is an estimate.
Return JSON only.` }
        ]
      }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            materials: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  label: { type: 'string' },
                  category: { type: 'string' },
                  form: { type: 'string', enum: ['roll','panel','scrap','garment','trim','accessory'] },
                  dominant_color: { type: 'string' },
                  pattern: { type: 'string' },
                  texture_cue: { type: 'string' },
                  quantity_estimate: { type: 'string' },
                  confidence: { type: 'number' }
                },
                required: ['id','label','category','form','dominant_color','confidence']
              }
            }
          },
          required: ['materials']
        }
      }
    });
    const data = JSON.parse(r.text);
    data.materials.forEach((m, i) => { m.id = `MAT-${String(i + 1).padStart(3, '0')}`; m.approved = true; });
    res.json(data);
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
});

// 2. Approved materials -> constrained concepts
app.post('/api/generate', async (req, res) => {
  try {
    const approved = req.body.materials.filter(m => m.approved);
    const ids = approved.map(m => m.id);
    const brief = req.body.brief || '3 looks, wearable, no new fabric';
    const r = await ai.models.generateContent({
      model: MODEL,
      contents: `Design a capsule collection using ONLY these materials. Brief: ${brief}.
Approved inventory: ${JSON.stringify(approved)}
Hard rules: every garment element must map to an approved material ID. Do not invent materials. If the brief cannot be fully met, say so in warnings.
Return JSON only.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            concepts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  silhouette: { type: 'string' },
                  description: { type: 'string' },
                  uses: { type: 'array', items: { type: 'string' } },
                  material_map: { type: 'array', items: { type: 'object', properties: {
                    zone: { type: 'string' }, material_id: { type: 'string' } }, required: ['zone','material_id'] } },
                  warnings: { type: 'array', items: { type: 'string' } }
                },
                required: ['title','silhouette','description','uses','material_map']
              }
            }
          },
          required: ['concepts']
        }
      }
    });
    const data = JSON.parse(r.text);
    // Server-side guardrail: reject any concept referencing unapproved IDs
    data.concepts.forEach(c => {
      const bad = c.uses.filter(id => !ids.includes(id));
      c.valid = bad.length === 0;
      if (bad.length) c.warnings = [...(c.warnings || []), `References unapproved: ${bad.join(', ')}`];
    });
    res.json(data);
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
});

app.listen(3000, () => console.log('http://localhost:3000'));
