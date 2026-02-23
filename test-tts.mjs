import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import * as fs from "fs";
import * as path from "path";

async function testTTS() {
  try {
    const keyPath = path.join(process.cwd(), "google-cloud-key.json");
    console.log("Key path:", keyPath);
    console.log("Key exists:", fs.existsSync(keyPath));

    const client = new TextToSpeechClient({
      keyFilename: keyPath,
    });

    console.log("Client created successfully");

    const request = {
      input: { text: "Hello! This is a test of the text to speech system." },
      voice: {
        languageCode: "en-US",
        name: "en-US-Neural2-C",
        ssmlGender: "MALE",
      },
      audioConfig: {
        audioEncoding: "MP3",
        pitch: 0,
        speakingRate: 1,
      },
    };

    console.log("Sending request to Google Cloud TTS...");
    const [response] = await client.synthesizeSpeech(request);
    
    if (response.audioContent) {
      console.log("✓ TTS Generation successful!");
      console.log("Audio content size:", response.audioContent.length, "bytes");
      
      // Save to file for testing
      fs.writeFileSync("test-audio.mp3", response.audioContent);
      console.log("✓ Audio saved to test-audio.mp3");
    } else {
      console.log("✗ No audio content returned");
    }
  } catch (error) {
    console.error("✗ TTS Error:", error.message);
    console.error("Full error:", error);
  }
}

testTTS();
