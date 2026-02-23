import fetch from 'node-fetch';

const voiceIds = [1, 2, 3, 4, 5, 6, 7];
const baseUrl = 'http://localhost:3000/api/trpc/voice.generateSample';

async function seedSamples() {
  console.log('Starting voice sample generation...');
  
  for (const voiceId of voiceIds) {
    try {
      console.log(`Generating sample for voice ${voiceId}...`);
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          json: { voiceProfileId: voiceId },
          meta: { values: ['undefined'] }
        })
      });
      
      const data = await response.json();
      if (data.result?.data?.success) {
        console.log(`✓ Sample generated for voice ${voiceId}`);
      } else {
        console.log(`✗ Failed to generate sample for voice ${voiceId}:`, data);
      }
    } catch (error) {
      console.error(`Error generating sample for voice ${voiceId}:`, error.message);
    }
  }
  
  console.log('Voice sample generation complete!');
}

seedSamples();
