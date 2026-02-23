const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const { TextToSpeechClient } = require("@google-cloud/text-to-speech");
const CloudStorage = require("@google-cloud/storage");

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

// Initialize TTS Client
let ttsClient: any = null;
let storageClient: any = null;

function getTTSClient() {
  if (!ttsClient) {
    ttsClient = new TextToSpeechClient();
  }
  return ttsClient;
}

function getStorageClient() {
  if (!storageClient) {
    storageClient = new CloudStorage.Storage();
  }
  return storageClient;
}

// Voice mappings
const voiceMapping: Record<number, { languageCode: string; name: string; ssmlGender: string }> = {
  1: { languageCode: "en-US", name: "en-US-Neural2-A", ssmlGender: "MALE" },
  2: { languageCode: "en-US", name: "en-US-Neural2-C", ssmlGender: "FEMALE" },
  3: { languageCode: "en-GB", name: "en-GB-Neural2-B", ssmlGender: "MALE" },
  4: { languageCode: "en-GB", name: "en-GB-Neural2-F", ssmlGender: "FEMALE" },
  5: { languageCode: "en-AU", name: "en-AU-Neural2-B", ssmlGender: "MALE" },
  6: { languageCode: "en-IN", name: "en-IN-Neural2-B", ssmlGender: "FEMALE" },
  7: { languageCode: "en-US", name: "en-US-Neural2-E", ssmlGender: "FEMALE" },
};

const voiceSampleTexts: Record<number, string> = {
  1: "Hello! I'm Alex, a friendly and energetic young American voice.",
  2: "Good morning. I'm Emma, bringing professional expertise to your projects.",
  3: "Right then, I'm James, your sophisticated British narrator.",
  4: "Hey there! I'm Sophie, your casual and approachable British companion.",
  5: "G'day mate! I'm Jake, bringing authentic Australian charm to your content.",
  6: "Namaste! I'm Priya, your professional Indian voice guide.",
  7: "Hi everyone! I'm Alex, your inclusive and modern voice option.",
};

const voiceProfiles = [
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
];

// Health check
app.get("/health", (req: any, res: any) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Get all voice profiles
app.get("/api/trpc/voice.getAllProfiles", (req: any, res: any) => {
  res.json({
    result: {
      data: voiceProfiles,
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

// Generate voice with real TTS
app.post("/api/trpc/voice.generate", async (req: any, res: any) => {
  try {
    const { json } = req.body;
    const { text, voiceProfileId } = json;

    if (!text || !voiceProfileId) {
      return res.status(400).json({
        result: {
          error: "Missing text or voiceProfileId",
        },
      });
    }

    const voiceConfig = voiceMapping[voiceProfileId];
    if (!voiceConfig) {
      return res.status(400).json({
        result: {
          error: "Invalid voice profile",
        },
      });
    }

    const client = getTTSClient();

    const request = {
      input: { text },
      voice: {
        languageCode: voiceConfig.languageCode,
        name: voiceConfig.name,
        ssmlGender: voiceConfig.ssmlGender,
      },
      audioConfig: {
        audioEncoding: "MP3",
        pitch: 0,
        speakingRate: 1,
      },
    };

    const [response] = await client.synthesizeSpeech(request);
    const audioContent = response.audioContent;

    if (!audioContent) {
      return res.status(500).json({
        result: {
          error: "No audio content generated",
        },
      });
    }

    // Upload to Cloud Storage
    const bucket = getStorageClient().bucket(process.env.FIREBASE_STORAGE_BUCKET || "dalsivoiceio.appspot.com");
    const fileName = `tts-audio/voice-${voiceProfileId}-${Date.now()}.mp3`;
    const file = bucket.file(fileName);

    await file.save(audioContent, {
      metadata: {
        contentType: "audio/mpeg",
      },
    });

    // Make file public and get URL
    await file.makePublic();
    const audioUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    const voiceProfile = voiceProfiles.find(v => v.id === voiceProfileId);

    res.json({
      result: {
        data: {
          success: true,
          audioUrl,
          voiceProfile,
        },
      },
    });
  } catch (error: any) {
    console.error("TTS Generation Error:", error);
    res.status(500).json({
      result: {
        error: error.message || "Failed to generate speech",
      },
    });
  }
});

// Generate voice sample
app.post("/api/trpc/voice.generateSample", async (req: any, res: any) => {
  try {
    const { json } = req.body;
    const { voiceProfileId } = json;

    if (!voiceProfileId) {
      return res.status(400).json({
        result: {
          error: "Missing voiceProfileId",
        },
      });
    }

    const voiceConfig = voiceMapping[voiceProfileId];
    if (!voiceConfig) {
      return res.status(400).json({
        result: {
          error: "Invalid voice profile",
        },
      });
    }

    const sampleText = voiceSampleTexts[voiceProfileId];
    if (!sampleText) {
      return res.status(400).json({
        result: {
          error: "No sample text for this voice",
        },
      });
    }

    const client = getTTSClient();

    const request = {
      input: { text: sampleText },
      voice: {
        languageCode: voiceConfig.languageCode,
        name: voiceConfig.name,
        ssmlGender: voiceConfig.ssmlGender,
      },
      audioConfig: {
        audioEncoding: "MP3",
        pitch: 0,
        speakingRate: 1,
      },
    };

    const [response] = await client.synthesizeSpeech(request);
    const audioContent = response.audioContent;

    if (!audioContent) {
      return res.status(500).json({
        result: {
          error: "No audio content generated",
        },
      });
    }

    // Upload to Cloud Storage
    const bucket = getStorageClient().bucket(process.env.FIREBASE_STORAGE_BUCKET || "dalsivoiceio.appspot.com");
    const fileName = `tts-samples/voice-sample-${voiceProfileId}.mp3`;
    const file = bucket.file(fileName);

    await file.save(audioContent, {
      metadata: {
        contentType: "audio/mpeg",
      },
    });

    // Make file public and get URL
    await file.makePublic();
    const audioUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    res.json({
      result: {
        data: {
          success: true,
          audioUrl,
          message: "Sample generated successfully",
        },
      },
    });
  } catch (error: any) {
    console.error("Sample Generation Error:", error);
    res.status(500).json({
      result: {
        error: error.message || "Failed to generate sample",
      },
    });
  }
});

// Export as Cloud Function
exports.api = functions.https.onRequest(app);
