const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

// Initialize Firebase Admin
admin.initializeApp();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req: any, res: any, next: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check
app.get("/health", (req: any, res: any) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Mock voice profiles endpoint
app.get("/api/trpc/voice.getAllProfiles", (req: any, res: any) => {
  res.json({
    result: {
      data: [
        {
          id: 1,
          name: "Alex - US Young",
          accent: "US",
          gender: "male",
          voiceType: "young",
          avatarUrl: "https://private-us-east-1.manuscdn.com/sessionFile/OoWlj0YQ06ufsiBUe8NVUB/sandbox/MycS8b1Rygga3ACV4fJK8M-img-1_1771770678000_na1fn_YXZhdGFyLXVzLW1hbGUteW91bmcu.png",
          description: "Friendly and energetic young American voice",
        },
        {
          id: 2,
          name: "Emma - US Professional",
          accent: "US",
          gender: "female",
          voiceType: "professional",
          avatarUrl: "https://private-us-east-1.manuscdn.com/sessionFile/OoWlj0YQ06ufsiBUe8NVUB/sandbox/MycS8b1Rygga3ACV4fJK8M-img-2_1771770682000_na1fn_YXZhdGFyLXVzLWZlbWFsZS1wcm9mZXNzaW9uYWw.png",
          description: "Professional and confident American voice",
        },
        {
          id: 3,
          name: "James - UK Mature",
          accent: "UK",
          gender: "male",
          voiceType: "mature",
          avatarUrl: "https://private-us-east-1.manuscdn.com/sessionFile/OoWlj0YQ06ufsiBUe8NVUB/sandbox/MycS8b1Rygga3ACV4fJK8M-img-3_1771770681000_na1fn_YXZhdGFyLXVrLW1hbGUtbWF0dXJl.png",
          description: "Sophisticated and distinguished British voice",
        },
        {
          id: 4,
          name: "Sophie - UK Casual",
          accent: "UK",
          gender: "female",
          voiceType: "casual",
          avatarUrl: "https://private-us-east-1.manuscdn.com/sessionFile/OoWlj0YQ06ufsiBUe8NVUB/sandbox/MycS8b1Rygga3ACV4fJK8M-img-4_1771770682000_na1fn_YXZhdGFyLXVrLWZlbWFsZS1jYXN1YWw.png",
          description: "Friendly and approachable British voice",
        },
        {
          id: 5,
          name: "Liam - Australian Casual",
          accent: "Australian",
          gender: "male",
          voiceType: "casual",
          avatarUrl: "https://private-us-east-1.manuscdn.com/sessionFile/OoWlj0YQ06ufsiBUe8NVUB/sandbox/MycS8b1Rygga3ACV4fJK8M-img-5_1771770680000_na1fn_YXZhdGFyLWF1c3RyYWxpYW4tbWFsZS1jYXN1YWw.png",
          description: "Relaxed and friendly Australian voice",
        },
        {
          id: 6,
          name: "Priya - Indian Professional",
          accent: "Indian",
          gender: "female",
          voiceType: "professional",
          avatarUrl: "https://private-us-east-1.manuscdn.com/sessionFile/OoWlj0YQ06ufsiBUe8NVUB/sandbox/TC9UdSj0Guxl93g4Vj2L2q-img-1_1771770709000_na1fn_YXZhdGFyLWluZGlhbi1mZW1hbGUtcHJvZmVzc2lvbmFs.png",
          description: "Professional and articulate Indian voice",
        },
        {
          id: 7,
          name: "Casey - Non-binary Young",
          accent: "US",
          gender: "non-binary",
          voiceType: "young",
          avatarUrl: "https://private-us-east-1.manuscdn.com/sessionFile/OoWlj0YQ06ufsiBUe8NVUB/sandbox/TC9UdSj0Guxl93g4Vj2L2q-img-2_1771770709000_na1fn_YXZhdGFyLW5vbmJpbmFyeS15b3VuZw.png",
          description: "Contemporary and inclusive voice",
        },
      ],
    },
  });
});

// Session initialization
app.post("/api/trpc/voice.initSession", (req: any, res: any) => {
  const sessionToken = "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  res.json({
    result: {
      data: {
        sessionToken,
      },
    },
  });
});

// Get session info
app.post("/api/trpc/voice.getSession", (req: any, res: any) => {
  res.json({
    result: {
      data: {
        id: 1,
        generationCount: 0,
        remainingGenerations: 2,
        canGenerate: true,
      },
    },
  });
});

// Generate voice (mock)
app.post("/api/trpc/voice.generate", (req: any, res: any) => {
  const mockAudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
  res.json({
    result: {
      data: {
        success: true,
        audioUrl: mockAudioUrl,
        voiceProfile: {
          id: 1,
          name: "Alex - US Young",
          accent: "US",
          gender: "male",
          voiceType: "young",
          avatarUrl: "https://private-us-east-1.manuscdn.com/sessionFile/OoWlj0YQ06ufsiBUe8NVUB/sandbox/MycS8b1Rygga3ACV4fJK8M-img-1_1771770678000_na1fn_YXZhdGFyLXVzLW1hbGUteW91bmcu.png",
        },
      },
    },
  });
});

// Export as Cloud Function
exports.api = functions.https.onRequest(app);
