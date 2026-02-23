import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import * as fs from "fs";
import * as path from "path";

async function testTTS() {
  try {
    const keyPath = path.join(process.cwd(), "google-cloud-key.json");

    const client = new TextToSpeechClient({
      keyFilename: keyPath,
    });

    console.log("Testing all 7 voices...\n");

    const voices = [
      { id: 1, name: "en-US-Neural2-A", gender: "MALE", text: "Hello! I'm Alex, a friendly and energetic young American voice." },
      { id: 2, name: "en-US-Neural2-C", gender: "FEMALE", text: "Good morning. I'm Emma, bringing professional expertise to your projects." },
      { id: 3, name: "en-GB-Neural2-B", gender: "MALE", text: "Right then, I'm James, your sophisticated British narrator." },
      { id: 4, name: "en-GB-Neural2-F", gender: "FEMALE", text: "Hey there! I'm Sophie, your casual and approachable British companion." },
      { id: 5, name: "en-AU-Neural2-B", gender: "MALE", text: "G'day mate! I'm Jake, bringing authentic Australian charm to your content." },
      { id: 6, name: "en-IN-Neural2-C", gender: "FEMALE", text: "Namaste! I'm Priya, your professional Indian voice guide." },
      { id: 7, name: "en-US-Neural2-E", gender: "FEMALE", text: "Hi everyone! I'm Alex, your inclusive and modern voice option." },
    ];

    for (const voice of voices) {
      try {
        const langCode = voice.name.includes("GB") ? "en-GB" : voice.name.includes("AU") ? "en-AU" : voice.name.includes("IN") ? "en-IN" : "en-US";
        
        const request = {
          input: { text: voice.text },
          voice: {
            languageCode: langCode,
            name: voice.name,
            ssmlGender: voice.gender,
          },
          audioConfig: {
            audioEncoding: "MP3",
            pitch: 0,
            speakingRate: 1,
          },
        };

        const [response] = await client.synthesizeSpeech(request);
        
        if (response.audioContent) {
          fs.writeFileSync(`voice-${voice.id}.mp3`, response.audioContent);
          console.log(`✓ Voice ${voice.id} (${voice.name}): ${response.audioContent.length} bytes`);
        }
      } catch (error) {
        console.log(`✗ Voice ${voice.id}: ${error.message}`);
      }
    }

    console.log("\n✓ All voices tested!");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testTTS();
