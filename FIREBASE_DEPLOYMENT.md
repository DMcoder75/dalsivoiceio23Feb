# Dalsi Voice - Firebase Cloud Functions Deployment Guide

## Overview

This guide explains how to deploy the Dalsi Voice backend to Firebase Cloud Functions and connect it with the Firebase Hosting frontend.

## Prerequisites

1. **Firebase Project**: `dalsivoiceio` (already created)
2. **Firebase CLI**: Install with `npm install -g firebase-tools`
3. **Service Account Key**: You already have `dalsivoiceio-firebase-adminsdk-fbsvc-fd1bcf795c.json`
4. **Node.js 20+**: Required for Cloud Functions runtime

## Project Structure

```
dalsi-voice/
├── functions/                    # Cloud Functions backend
│   ├── src/
│   │   └── index.ts             # Main Cloud Function handler
│   ├── dist/                    # Compiled JavaScript (auto-generated)
│   ├── package.json             # Dependencies
│   └── tsconfig.json            # TypeScript config
├── dist/public/                 # Frontend static files
├── firebase.json                # Firebase configuration
└── client/                       # React frontend source
```

## Deployment Steps

### Step 1: Set Up Firebase CLI Authentication

```bash
# Set the Google Application Credentials environment variable
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/dalsivoiceio-firebase-adminsdk-fbsvc-fd1bcf795c.json

# Verify authentication
firebase projects:list
```

### Step 2: Build the Application

```bash
# Build the frontend
npm run build

# Build the Cloud Functions
cd functions
npm install
npm run build
cd ..
```

### Step 3: Deploy to Firebase

```bash
# Deploy both hosting and functions
firebase deploy --project dalsivoiceio

# Or deploy only functions
firebase deploy --project dalsivoiceio --only functions

# Or deploy only hosting
firebase deploy --project dalsivoiceio --only hosting
```

### Step 4: Verify Deployment

After deployment, you should see:
- Hosting URL: `https://dalsivoiceio.web.app`
- Cloud Function URL: `https://us-central1-dalsivoiceio.cloudfunctions.net/api`

Test the API:
```bash
curl https://us-central1-dalsivoiceio.cloudfunctions.net/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-22T10:00:00.000Z"
}
```

## Firebase Configuration (firebase.json)

The `firebase.json` file is already configured to:

1. **Serve frontend** from `dist/public`
2. **Route API calls** to Cloud Functions via rewrites
3. **Handle SPA routing** by rewriting all non-API requests to `index.html`

```json
{
  "hosting": {
    "public": "dist/public",
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs20"
  }
}
```

## Cloud Functions Structure

The main Cloud Function (`functions/src/index.ts`) provides:

### Endpoints

1. **GET /health** - Health check
   ```
   Response: { status: "ok", timestamp: "..." }
   ```

2. **GET /api/trpc/voice.getAllProfiles** - Get all voice profiles
   ```
   Response: { result: { data: [...] } }
   ```

3. **POST /api/trpc/voice.initSession** - Create a new session
   ```
   Response: { result: { data: { sessionToken: "..." } } }
   ```

4. **POST /api/trpc/voice.getSession** - Get session info
   ```
   Response: { result: { data: { id, generationCount, remainingGenerations, canGenerate } } }
   ```

5. **POST /api/trpc/voice.generate** - Generate voice audio
   ```
   Response: { result: { data: { success, audioUrl, voiceProfile } } }
   ```

## Environment Variables

Currently, the Cloud Functions use mock data. To integrate with a real database:

1. Add environment variables in Firebase Console:
   - `DATABASE_URL`: Your database connection string
   - `API_KEY`: Any API keys needed

2. Update `functions/src/index.ts` to use these variables:
   ```typescript
   const dbUrl = process.env.DATABASE_URL;
   ```

3. Redeploy:
   ```bash
   firebase deploy --project dalsivoiceio --only functions
   ```

## Troubleshooting

### Permission Error: "Caller does not have required permission"

**Solution**: Update IAM roles in Google Cloud Console:
1. Go to https://console.cloud.google.com/iam-admin/iam?project=dalsivoiceio
2. Find the service account: `firebase-adminsdk-fbsvc@dalsivoiceio.iam.gserviceaccount.com`
3. Add these roles:
   - `Cloud Functions Developer`
   - `Cloud Build Service Account`
   - `Service Usage Consumer`
4. Wait 2-3 minutes for permissions to propagate
5. Retry deployment

### Build Fails with TypeScript Errors

**Solution**: Ensure TypeScript is compiled:
```bash
cd functions
npm install
npm run build
cd ..
```

### Frontend Shows "Cannot GET /api/..."

**Solution**: Ensure `firebase.json` has the correct rewrites configuration and redeploy:
```bash
firebase deploy --project dalsivoiceio
```

## Frontend Configuration

The frontend is configured to call the Cloud Functions API at:
- Development: `http://localhost:3000/api`
- Production: `https://dalsivoiceio.web.app/api`

The tRPC client automatically handles the routing.

## Next Steps

1. **Deploy**: Follow the deployment steps above
2. **Test**: Visit `https://dalsivoiceio.web.app` and test the voice generator
3. **Integrate Real TTS**: Replace mock audio with actual Google Cloud Text-to-Speech API
4. **Add Database**: Connect to Firestore or Cloud SQL for persistent data
5. **Custom Domain**: Configure `dalsivoice.io` in Firebase Hosting settings

## Support

For Firebase-specific issues:
- Firebase Documentation: https://firebase.google.com/docs
- Cloud Functions Guide: https://firebase.google.com/docs/functions
- Hosting Guide: https://firebase.google.com/docs/hosting

For Dalsi Voice-specific issues:
- Check the GitHub repository: https://github.com/DMcoder75/dalsivoiceio23Feb
- Review the application code in the `server/` and `client/` directories
