import express from "express";
import path from "path";
import multer from "multer";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: "10mb" }));

  // AI Analysis Endpoint
  app.post("/api/analyze", (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      } else if (err) {
        return res.status(500).json({ error: `Unknown upload error: ${err.message}` });
      }
      next();
    });
  }, async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const mimeType = req.file.mimetype;
      const base64Data = req.file.buffer.toString("base64");

      const prompt = `Analyze this thumbnail for click potential on platforms like YouTube, Facebook, or TikTok.
Evaluate visual clarity, composition, color contrast, subject focus, emotional impact, text readability, mobile friendliness, branding consistency, and curiosity factor.
Return a structured JSON response only. Do not wrap it in markdown block. Return raw JSON.

Structure:
{
  "overall_score": number (0-100),
  "clarity": number (0-10),
  "contrast": number (0-10),
  "color_balance": number (0-10),
  "brightness": number (0-10),
  "focus": number (0-10),
  "subject_visibility": number (0-10),
  "facial_expression": number (0-10) or null if no face,
  "emotion": string,
  "visual_hierarchy": number (0-10),
  "text_readability": number (0-10) or null if no text,
  "text_size": string,
  "background_complexity": number (0-10),
  "branding": number (0-10),
  "mobile_visibility": number (0-10),
  "curiosity": number (0-10),
  "thumbnail_hook": string,
  "strengths": string[],
  "weaknesses": string[],
  "recommendations": string[],
  "summary": string
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64Data
                }
              },
              {
                text: prompt
              }
            ]
          }
        ],
        config: {
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text || "{}";
      const result = JSON.parse(responseText);

      res.json(result);
    } catch (error: any) {
      console.error("AI Analysis Error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze image" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
