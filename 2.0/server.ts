import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { SCHOLARSHIPS } from "./src/data";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy initialize Google GenAI client to prevent startup crash if GEMINI_API_KEY is missing
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return null;
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // API Endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Hilas Quest Server is healthy." });
  });

  app.get("/api/scholarships", async (req, res) => {
    try {
      const currentDate = new Date();
      
      const updatedScholarships = SCHOLARSHIPS.map((scholarship: any) => {
        // Parse the deadline (e.g., "Dec 1, 2024")
        const deadlineDate = new Date(scholarship.deadline);
        const updatedScholarship = { ...scholarship };
        
        // Auto-renew the scholarship if the deadline has passed
        if (!isNaN(deadlineDate.getTime()) && deadlineDate < currentDate) {
          const currentYear = currentDate.getFullYear();
          deadlineDate.setFullYear(currentYear);
          
          if (deadlineDate < currentDate) {
            // If the date in the current year has already passed, move to next year
            deadlineDate.setFullYear(currentYear + 1);
          }
          
          updatedScholarship.deadline = deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          updatedScholarship.status = "Open";
          
          // Also update timeline dates to match the new year if they exist
          if (updatedScholarship.timeline && Array.isArray(updatedScholarship.timeline)) {
            updatedScholarship.timeline = updatedScholarship.timeline.map((event: any) => {
              if (event.date) {
                // Try to replace the year in the timeline string
                const oldYear = new Date(scholarship.deadline).getFullYear().toString();
                const newYear = deadlineDate.getFullYear().toString();
                event.date = event.date.replace(oldYear, newYear);
              }
              return event;
            });
          }
        }
        
        return updatedScholarship;
      });

      res.json({ scholarships: updatedScholarships });
    } catch (error) {
      console.error("Error fetching scholarships:", error);
      res.status(500).json({ error: "Failed to fetch scholarships" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, previousInteractionId } = req.body;
      if (!message) {
        res.status(400).json({ error: "Message is required." });
        return;
      }

      const client = getGeminiClient();
      if (!client) {
        // Mock fallback response if GEMINI_API_KEY is not defined
        console.warn("GEMINI_API_KEY missing - running fallback chatbot.");
        const fallbackText = getFallbackResponse(message);
        res.json({ text: fallbackText });
        return;
      }

      const response = await client.models.generateContent({
        model: "gemini-flash-latest",
        contents: message,
        config: {
          systemInstruction: "You are the Hilas Quest AI Academic Advisor. Your goal is to guide students in securing scholarships, choosing universities, and refining application requirements. You evaluate student credentials (GPA, major, extracurriculars, country) and provide direct, actionable scholarship matching suggestions. Be professional, empathetic, clear, and highly supportive. Avoid self-praising fluff. Use markdown list formatting for scannability."
        }
      });

      res.json({ 
        text: response.text || "I couldn't formulate a response.", 
        interactionId: "session-" + Date.now()
      });
    } catch (error: any) {
      console.error("Error in /api/chat:", error);
      res.status(500).json({ error: error.message || "Failed to process chat message." });
    }
  });

  // Simple local fallback engine to keep the app functional even if API key is not configured yet
  function getFallbackResponse(input: string): string {
    const query = input.toLowerCase();
    if (query.includes("gpa") || query.includes("grade") || query.includes("eligible")) {
      return `### Academic Profile Matcher\n\nBased on your query, here are the standard eligibility parameters for Hilas Quest scholarships:\n- **Global Tech Excellence Scholarship:** Minimum GPA of 3.8/4.0. Requires STEM major.\n- **Global Leaders Fellowship (Stanford):** Minimum GPA of 3.7/4.0. Strong leadership record.\n- **DAAD Excellence (Germany):** Minimum GPA of 3.5/4.0. Open to international STEM students.\n\n*Would you like me to help draft a checklist for one of these?*`;
    }
    if (query.includes("stanford") || query.includes("california")) {
      return `### Stanford University Spotlight\n\nStanford is ranked **#2 nationally** with a **94% graduation rate**.\n\nKey Opportunities:\n1. **Global Leaders Fellowship** ($85,000 full tuition + stipend)\n2. **Stanford Fund Scholarship** ($15,000/yr undergraduate award)\n3. **Knight-Hennessy Scholars** (Full tuition graduate fellowship)\n\nYou can explore these and apply directly in our portal under the **Universities > Stanford** tab!`;
    }
    if (query.includes("essay") || query.includes("sop") || query.includes("statement of purpose")) {
      return `### Statement of Purpose (SOP) Tips\n\nA great SOP for competitive scholarships should contain:\n1. **The Hook:** A vivid personal anecdote introducing your academic passion.\n2. **Academic Alignment:** Direct correlation between your past research and your target degree.\n3. **Vision of Impact:** How this funding enables you to give back and lead.\n\n*If you paste a draft, I can review its structure and tone for you!*`;
    }
    return `Hello! I am your **Hilas Quest AI Advisor**. How can I help you today?\n\nI can:\n- **Evaluate your profile** for specific scholarship matches.\n- Provide insights on top universities like **Stanford**, **Oxford**, or **MIT**.\n- Review your **Statement of Purpose** or guide your document preparation.\n- Help you plan your application timeline.`;
  }

  app.post("/api/admin/generate-scholarships", async (req, res) => {
    try {
      const { topic, count } = req.body;
      const client = getGeminiClient();
      
      if (!client) {
        res.status(500).json({ error: "Gemini API key is required to use the AI Finder." });
        return;
      }

      const prompt = `Generate a JSON array of ${count || 3} real-world, fully funded or highly valuable scholarships related to "${topic || 'General'}". 
      IMPORTANT: Return ONLY raw JSON. No markdown backticks, no markdown blocks, no intro text.
      The output MUST be a valid JSON array matching this TypeScript interface exactly:
      [{
        "id": "unique-string-id",
        "title": "Scholarship Name",
        "university": "University or Foundation Name",
        "country": "Country Name",
        "amount": "e.g. $50,000 or Full Tuition",
        "level": "e.g. Undergraduate / Masters",
        "summary": "1-2 sentence compelling summary",
        "tags": ["Tag1", "Tag2", "Deadline: Month Day"],
        "deadline": "Month Day, Year",
        "status": "Open",
        "logoUrl": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&h=200&fit=crop",
        "fieldOfStudy": "e.g. STEM, Humanities",
        "degreeLevel": "e.g. Masters",
        "studentStatus": "International or Domestic",
        "category": "Generated",
        "isFullFunding": true,
        "detailedDescription": "A full paragraph describing the scholarship.",
        "requiredDocuments": [
          {"title": "Transcript", "desc": "Official transcript"},
          {"title": "Essay", "desc": "Statement of purpose"}
        ],
        "timeline": [
          {"label": "Application Open", "date": "Current Phase", "description": "Submit documents", "current": true}
        ]
      }]`;

      const response = await client.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt
      });

      let text = response.text || "[]";
      // Clean up markdown block if present
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const scholarships = JSON.parse(text);
      res.json({ scholarships });
    } catch (error: any) {
      console.error("Error generating scholarships:", error);
      res.status(500).json({ error: error.message || "Failed to generate scholarships" });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Hilas Quest Server running on http://localhost:${PORT}`);
  });
}

startServer();
