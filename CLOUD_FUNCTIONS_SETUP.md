# Firebase Cloud Functions - Quick Setup

## What's Included

The `functions/` directory contains a complete Firebase Cloud Functions backend for Dalsi Voice:

- **functions/src/index.ts** - Main Cloud Function handler with all API endpoints
- **functions/package.json** - Dependencies (Firebase Functions, Express, etc.)
- **functions/tsconfig.json** - TypeScript configuration
- **firebase.json** - Firebase configuration with hosting + functions setup

## Quick Deploy

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Authenticate
```bash
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/dalsivoiceio-firebase-adminsdk-fbsvc-fd1bcf795c.json
firebase login:use-service-account --key-file=/path/to/dalsivoiceio-firebase-adminsdk-fbsvc-fd1bcf795c.json
```

### 3. Build & Deploy
```bash
cd dalsi-voice

# Build frontend
npm run build

# Build functions
cd functions
npm install
npm run build
cd ..

# Deploy everything
firebase deploy --project dalsivoiceio
```

### 4. Test
Visit: https://dalsivoiceio.web.app

## File Locations

- **Frontend**: `dist/public/` (automatically built)
- **Cloud Functions**: `functions/src/index.ts`
- **Configuration**: `firebase.json`

## API Endpoints

All endpoints are available at: `https://dalsivoiceio.web.app/api/trpc/`

- `GET /health` - Health check
- `GET /voice.getAllProfiles` - Get voice profiles
- `POST /voice.initSession` - Create session
- `POST /voice.getSession` - Get session info
- `POST /voice.generate` - Generate voice

## Troubleshooting

**Permission denied?**
1. Go to: https://console.cloud.google.com/iam-admin/iam?project=dalsivoiceio
2. Add `Cloud Functions Developer` role to the service account
3. Wait 2-3 minutes and retry

**Build fails?**
```bash
cd functions
rm -rf node_modules dist
npm install
npm run build
```

**Need to redeploy only functions?**
```bash
firebase deploy --project dalsivoiceio --only functions
```

## Next: Real TTS Integration

To use actual Google Cloud Text-to-Speech:

1. Enable the API in Google Cloud Console
2. Update `functions/src/index.ts` to call the TTS API
3. Add credentials to Cloud Functions environment variables
4. Redeploy

See `FIREBASE_DEPLOYMENT.md` for detailed instructions.
