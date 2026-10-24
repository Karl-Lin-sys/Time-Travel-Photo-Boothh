import { localApiOnly } from './local-api-guard.mjs';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
app.use('/api', localApiOnly(() => PORT));
  const PORT = 3000;

  // Allow high payloads for base64 image data from camera & uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Helper to get GoogleGenAI client with standard User-Agent header
  function getGeminiClient(): GoogleGenAI {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Parse image into clean base64 data and mimeType
  function parseBase64Image(dataUri: string): { data: string; mimeType: string } {
    if (dataUri.startsWith('data:')) {
      const match = dataUri.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        return {
          mimeType: match[1],
          data: match[2],
        };
      }
    }
    // Fallback if raw base64
    return {
      mimeType: 'image/jpeg',
      data: dataUri,
    };
  }

  // API Health Check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasKey: Boolean(process.env.GEMINI_API_KEY),
      time: new Date().toISOString(),
    });
  });

  // Feature: Analyze photo with gemini-3.1-pro-preview
  app.post('/api/analyze-photo', async (req: Request, res: Response) => {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({ error: 'Image data is required.' });
      }

      const ai = getGeminiClient();
      const { data, mimeType } = parseBase64Image(image);

      const prompt = `You are an expert historical portraitist, art historian, and facial aesthetician in a Time-Travel Photo Booth.
Analyze the user's uploaded portrait face. Provide a rich, insightful, engaging analysis.

Return ONLY a valid JSON object matching this schema:
{
  "summary": "A 2-sentence description of the person's portrait features, lighting, and natural expression",
  "expression": "e.g. Warm and serene, intense and noble, or witty and charismatic",
  "lighting": "e.g. Soft studio key light, dramatic directional light, ambient warmth",
  "personaKeywords": ["Regal", "Visionary", "Audacious", "Scholarly"],
  "eraMatches": [
    {
      "eraId": "id from: ancient-egypt, renaissance-florence, roaring-twenties, victorian-london, feudal-japan, apollo-moon-landing, medieval-knight, wild-west, studio-54-disco, cyberpunk-2150",
      "eraName": "Name of the historical era",
      "role": "Distinctive role in that era (e.g. Renaissance Cartographer, Pharaoh's Royal Architect)",
      "matchScore": 96,
      "reason": "Specific reasons why their face shape, gaze, expression, or bone structure suits this epoch",
      "customPromptAdjustment": "A tailored adjustment for the transformation prompt"
    }
  ]
}
Include at least 4 era matches with matchScores between 78 and 99, ordered by score descending.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data,
                mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '{}';
      const parsedAnalysis = JSON.parse(responseText.trim());

      res.json({
        success: true,
        analysis: parsedAnalysis,
      });
    } catch (error: any) {
      console.error('Error analyzing photo with gemini-3.1-pro-preview:', error);
      res.status(500).json({
        error: error.message || 'Failed to analyze portrait photo.',
      });
    }
  });

  // Feature: Create & Insert face into historical scenes using gemini-3.1-flash-image-preview
  app.post('/api/time-travel', async (req: Request, res: Response) => {
    try {
      const { image, scenePrompt, eraName, eraYear, role, userCustomText } = req.body;
      if (!image) {
        return res.status(400).json({ error: 'Source portrait image is required.' });
      }

      const ai = getGeminiClient();
      const { data, mimeType } = parseBase64Image(image);

      let fullPrompt = scenePrompt || '';
      if (userCustomText && userCustomText.trim()) {
        fullPrompt += ` Additional user guidance: ${userCustomText.trim()}.`;
      }
      fullPrompt += ' Ensure the person\'s face, eyes, and likeness are seamlessly transplanted into this scene while preserving their identity and natural facial proportions.';

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data,
                mimeType,
              },
            },
            {
              text: fullPrompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: '1:1',
          },
        },
      });

      let generatedImageUrl: string | null = null;
      let textNote = '';

      if (response.candidates && response.candidates.length > 0) {
        const parts = response.candidates[0].content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          } else if (part.text) {
            textNote += part.text;
          }
        }
      }

      if (!generatedImageUrl) {
        return res.status(502).json({
          error: 'Model did not return image data.',
          details: textNote,
        });
      }

      res.json({
        success: true,
        imageUrl: generatedImageUrl,
        notes: textNote,
        eraName,
        eraYear,
        role,
      });
    } catch (error: any) {
      console.error('Error generating time-travel portrait with gemini-3.1-flash-image-preview:', error);
      res.status(500).json({
        error: error.message || 'Failed to travel through time and generate portrait.',
      });
    }
  });

  // Feature: Edit generated image using text prompts with gemini-3.1-flash-image-preview
  app.post('/api/edit-image', async (req: Request, res: Response) => {
    try {
      const { currentImage, editPrompt } = req.body;
      if (!currentImage || !editPrompt) {
        return res.status(400).json({ error: 'Current image and edit prompt are required.' });
      }

      const ai = getGeminiClient();
      const { data, mimeType } = parseBase64Image(currentImage);

      const instruction = `Edit and modify this historical portrait according to these exact instructions: "${editPrompt}".
Maintain the character's facial likeness and overall composition while applying the requested changes with photographic and artistic realism.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data,
                mimeType,
              },
            },
            {
              text: instruction,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: '1:1',
          },
        },
      });

      let generatedImageUrl: string | null = null;
      let textNote = '';

      if (response.candidates && response.candidates.length > 0) {
        const parts = response.candidates[0].content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          } else if (part.text) {
            textNote += part.text;
          }
        }
      }

      if (!generatedImageUrl) {
        return res.status(502).json({
          error: 'Image editing did not produce an image.',
          details: textNote,
        });
      }

      res.json({
        success: true,
        imageUrl: generatedImageUrl,
        notes: textNote,
      });
    } catch (error: any) {
      console.error('Error editing image with gemini-3.1-flash-image-preview:', error);
      res.status(500).json({
        error: error.message || 'Failed to edit historical image.',
      });
    }
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '127.0.0.1', () => {
    console.log(`Time-Travel Photo Booth server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
