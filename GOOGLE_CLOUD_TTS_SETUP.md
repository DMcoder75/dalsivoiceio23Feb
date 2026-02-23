# Google Cloud Text-to-Speech API Setup Guide

This guide will help you set up Google Cloud Text-to-Speech API for Dalsi Voice in 10 minutes.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)

1. Click on the project dropdown at the top

1. Click **NEW PROJECT**

1. Enter project name: `dalsi-voice-tts`

1. Click **CREATE**

1. Wait for the project to be created (1-2 minutes)

## Step 2: Enable Text-to-Speech API

1. In the Google Cloud Console, search for **"Text-to-Speech API"**

1. Click on **Cloud Text-to-Speech API**

1. Click **ENABLE**

1. Wait for it to be enabled (30 seconds)

## Step 3: Create a Service Account

1. In the left sidebar, go to **APIs & Services** → **Credentials**

1. Click **+ CREATE CREDENTIALS**

1. Select **Service Account**

1. Fill in the form:
  - **Service account name**: `dalsi-voice-tts`
  - **Service account ID**: (auto-filled)
  - Click **CREATE AND CONTINUE**

1. On the next page (Grant roles):
  - Click **SELECT A ROLE**
  - Search for and select: **Cloud Text-to-Speech Client**
  - Click **CONTINUE**

1. On the final page:
  - Click **DONE**

## Step 4: Create and Download Service Account Key

1. In **Credentials** page, find your service account under "Service Accounts"

1. Click on the service account name (`dalsi-voice-tts@...`)

1. Go to the **KEYS** tab

1. Click **ADD KEY** → **Create new key**

1. Select **JSON**

1. Click **CREATE**

1. A JSON file will automatically download - **Save this file safely!**

## Step 5: Upload the Key to Your Project

1. Rename the downloaded JSON file to: `google-cloud-key.json`

1. Place it in your project root directory: `/home/ubuntu/dalsi-voice/`

## Step 6: Add Environment Variable

The key will be automatically used by the backend. No additional setup needed!

## Verify Setup

To verify everything is working:

```bash
# Check if the key file exists
ls -la /home/ubuntu/dalsi-voice/google-cloud-key.json

# You should see the file listed
```

## What's Next?

Once you have the key file in place:

1. I'll update the backend to use Google Cloud Text-to-Speech

1. Add voice samples for each narrator

1. Implement real text-to-speech conversion

1. Deploy everything to Firebase

## Troubleshooting

**Q: I can't find the Text-to-Speech API**

- Make sure you're in the correct Google Cloud project

- Try searching for "Cloud Text-to-Speech API"

**Q: The API won't enable**

- You may need to enable billing on your Google Cloud account

- Go to **Billing** in the left sidebar and add a payment method

**Q: I lost my JSON key file**

- Go back to the service account KEYS tab

- Click **ADD KEY** and create a new one

## Free Tier Limits

Google Cloud Text-to-Speech offers:

- **First 1 million characters per month**: FREE

- After that: $16 per million characters

- Perfect for testing and small projects!

---

**Once you have the ****`google-cloud-key.json`**** file, let me know and I'll integrate it into the project!**

