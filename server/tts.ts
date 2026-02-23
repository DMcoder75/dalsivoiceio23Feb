import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { storagePut } from "./storage";
import * as fs from "fs";
import * as path from "path";

// Initialize TTS client
let ttsClient: TextToSpeechClient | null = null;

function getTTSClient() {
  if (!ttsClient) {
    const keyPath = path.join(process.cwd(), "google-cloud-key.json");
    
    if (!fs.existsSync(keyPath)) {
      throw new Error("Google Cloud credentials file not found at " + keyPath);
    }

    ttsClient = new TextToSpeechClient({
      keyFilename: keyPath,
    });
  }
  return ttsClient;
}

// Map voice profiles to Google Cloud voices
const voiceMapping: Record<number, { languageCode: string; name: string; ssmlGender: string }> = {
  1: { languageCode: "en-US", name: "en-US-Neural2-A", ssmlGender: "MALE" }, // US Young Male
  2: { languageCode: "en-US", name: "en-US-Neural2-C", ssmlGender: "FEMALE" }, // US Professional Female
  3: { languageCode: "en-GB", name: "en-GB-Neural2-B", ssmlGender: "MALE" }, // UK Mature Male
  4: { languageCode: "en-GB", name: "en-GB-Neural2-F", ssmlGender: "FEMALE" }, // UK Casual Female
  5: { languageCode: "en-AU", name: "en-AU-Neural2-B", ssmlGender: "MALE" }, // Australian Casual Male
  6: { languageCode: "en-IN", name: "en-IN-Neural2-B", ssmlGender: "FEMALE" }, // Indian Professional Female
  7: { languageCode: "en-US", name: "en-US-Neural2-E", ssmlGender: "FEMALE" }, // Non-binary Young
};

// Voice sample texts for preview
const voiceSampleTexts: Record<number, string> = {
  1: "Hello! I'm Alex, a friendly and energetic young American voice.",
  2: "Good morning. I'm Emma, bringing professional expertise to your projects.",
  3: "Right then, I'm James, your sophisticated British narrator.",
  4: "Hey there! I'm Sophie, your casual and approachable British companion.",
  5: "G'day mate! I'm Jake, bringing authentic Australian charm to your content.",
  6: "Namaste! I'm Priya, your professional Indian voice guide.",
  7: "Hi everyone! I'm Alex, your inclusive and modern voice option.",
};

export async function generateSpeech(
  text: string,
  voiceProfileId: number
): Promise<string> {
  try {
    const client = getTTSClient();
    const voiceConfig = voiceMapping[voiceProfileId];

    if (!voiceConfig) {
      throw new Error(`Voice profile ${voiceProfileId} not found`);
    }

    const request = {
      input: { text },
      voice: {
        languageCode: voiceConfig.languageCode,
        name: voiceConfig.name,
        ssmlGender: voiceConfig.ssmlGender as any,
      },
      audioConfig: {
        audioEncoding: "MP3" as any,
        pitch: 0,
        speakingRate: 1,
      },
    };

    const [response] = await client.synthesizeSpeech(request);
    const audioContent = response.audioContent;

    if (!audioContent) {
      throw new Error("No audio content generated");
    }

    // Upload to S3
    const fileName = `voice-${voiceProfileId}-${Date.now()}.mp3`;
    const { url } = await storagePut(
      `tts-audio/${fileName}`,
      audioContent as Buffer,
      "audio/mpeg"
    );

    return url;
  } catch (error) {
    console.error("TTS Generation Error:", error);
    throw error;
  }
}

export async function generateVoiceSample(voiceProfileId: number): Promise<string> {
  try {
    const sampleText = voiceSampleTexts[voiceProfileId];
    if (!sampleText) {
      throw new Error(`No sample text for voice profile ${voiceProfileId}`);
    }

    return await generateSpeech(sampleText, voiceProfileId);
  } catch (error) {
    console.error("Voice Sample Generation Error:", error);
    throw error;
  }
}

export function getVoiceMapping() {
  return voiceMapping;
}

export function getVoiceSampleTexts() {
  return voiceSampleTexts;
}
