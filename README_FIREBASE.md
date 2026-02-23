# Dalsi Voice - Firebase Deployment Package

## 📦 What You're Getting

This package contains everything needed to deploy Dalsi Voice to Firebase Hosting + Cloud Functions:

```
├── functions/                          # Cloud Functions backend
│   ├── src/index.ts                   # Express app with all API endpoints
│   ├── package.json                   # Node.js dependencies
│   ├── tsconfig.json                  # TypeScript config
│   └── dist/                          # Compiled JavaScript (generated)
│
├── dist/public/                        # Frontend static files
│   ├── index.html                     # React app entry point
│   ├── assets/                        # CSS, JS bundles
│   └── ...                            # Other static assets
│
├── firebase.json                       # Firebase configuration
├── FIREBASE_DEPLOYMENT.md              # Detailed deployment guide
├── CLOUD_FUNCTIONS_SETUP.md            # Quick setup instructions
└── README_FIREBASE.md                  # This file
```

## 🚀 Quick Start (3 Steps)

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Authenticate with Service Account
```bash
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/dalsivoiceio-firebase-adminsdk-fbsvc-fd1bcf795c.json
```

### Step 3: Deploy
```bash
cd dalsi-voice
firebase deploy --project dalsivoiceio
```

**Done!** Your app is live at: https://dalsivoiceio.web.app

## 📋 What Gets Deployed

### Frontend (Hosting)
- React application
- All UI components
- Static assets
- Automatically served from `dist/public/`

### Backend (Cloud Functions)
- Express.js API server
- Voice profile endpoints
- Session management
- Audio generation endpoints
- CORS enabled for all origins

### Configuration
- Automatic routing of `/api/**` requests to Cloud Functions
- SPA routing (all non-API requests go to index.html)
- CORS headers configured

## 🔌 API Endpoints

After deployment, these endpoints are available:

```
https://dalsivoiceio.web.app/api/trpc/voice.getAllProfiles    [GET]
https://dalsivoiceio.web.app/api/trpc/voice.initSession       [POST]
https://dalsivoiceio.web.app/api/trpc/voice.getSession        [POST]
https://dalsivoiceio.web.app/api/trpc/voice.generate          [POST]
https://dalsivoiceio.web.app/api/health                       [GET]
```

## 🛠️ Development Workflow

### Make Changes Locally
```bash
# Edit frontend
vim client/src/pages/Generator.tsx

# Edit backend
vim functions/src/index.ts

# Build
npm run build
cd functions && npm run build && cd ..

# Test locally (if needed)
firebase emulators:start
```

### Deploy Updates
```bash
# Deploy everything
firebase deploy --project dalsivoiceio

# Or deploy only specific parts
firebase deploy --project dalsivoiceio --only hosting
firebase deploy --project dalsivoiceio --only functions
```

## 📊 Current Features

✅ **7 Voice Profiles**
- US (Young, Professional)
- UK (Mature, Casual)
- Australian (Casual)
- Indian (Professional)
- Non-binary (Young)

✅ **Session Management**
- Per-session generation tracking
- 2-generation limit enforcement
- Session token generation

✅ **UI Features**
- Voice selection interface
- Avatar display
- Audio preview
- Download functionality
- Character counter
- Responsive design

✅ **Backend**
- tRPC API
- Express.js server
- CORS support
- Health check endpoint

## 🔐 Security Considerations

1. **Service Account Key**: Keep `dalsivoiceio-firebase-adminsdk-fbsvc-fd1bcf795c.json` secure
2. **Environment Variables**: Never commit sensitive data
3. **CORS**: Currently allows all origins - restrict in production
4. **Authentication**: Consider adding Firebase Auth for user-specific features

## 📈 Next Steps

### Phase 1: Verify Deployment
- [ ] Visit https://dalsivoiceio.web.app
- [ ] Test voice profile selection
- [ ] Test session creation
- [ ] Verify API responses

### Phase 2: Integrate Real TTS
- [ ] Enable Google Cloud Text-to-Speech API
- [ ] Add API credentials to Cloud Functions environment
- [ ] Update `functions/src/index.ts` to call real TTS
- [ ] Redeploy functions

### Phase 3: Add Database
- [ ] Set up Firestore or Cloud SQL
- [ ] Update session storage to use database
- [ ] Persist generation history
- [ ] Add user authentication

### Phase 4: Production Optimization
- [ ] Set up custom domain (dalsivoice.io)
- [ ] Configure SSL/TLS
- [ ] Set up monitoring and logging
- [ ] Implement rate limiting
- [ ] Add analytics

## 🐛 Troubleshooting

### "Permission denied" Error
**Problem**: Service account lacks required permissions

**Solution**:
1. Go to: https://console.cloud.google.com/iam-admin/iam?project=dalsivoiceio
2. Find service account: `firebase-adminsdk-fbsvc@dalsivoiceio.iam.gserviceaccount.com`
3. Add these roles:
   - Cloud Functions Developer
   - Cloud Build Service Account
   - Service Usage Consumer
4. Wait 2-3 minutes
5. Retry deployment

### "Cannot GET /api/..." Error
**Problem**: Cloud Functions not responding

**Solution**:
1. Check deployment status: `firebase deploy --project dalsivoiceio --only functions`
2. Check logs: `firebase functions:log --project dalsivoiceio`
3. Verify `firebase.json` rewrites configuration
4. Redeploy: `firebase deploy --project dalsivoiceio`

### Build Fails
**Problem**: TypeScript compilation errors

**Solution**:
```bash
cd functions
rm -rf node_modules dist
npm install
npm run build
cd ..
firebase deploy --project dalsivoiceio --only functions
```

### Frontend Shows 404
**Problem**: Static files not deployed

**Solution**:
```bash
npm run build
firebase deploy --project dalsivoiceio --only hosting
```

## 📚 Documentation

- **Firebase Hosting**: https://firebase.google.com/docs/hosting
- **Cloud Functions**: https://firebase.google.com/docs/functions
- **Firebase CLI**: https://firebase.google.com/docs/cli
- **Dalsi Voice GitHub**: https://github.com/DMcoder75/dalsivoiceio23Feb

## 💡 Tips

1. **Monitor Costs**: Cloud Functions free tier includes 2M invocations/month
2. **Optimize Bundle**: Current frontend is ~700KB - consider code splitting
3. **Enable Caching**: Add cache headers to static assets
4. **Set Up Alerts**: Configure Firebase alerts for errors and quota usage
5. **Use Emulator**: Test locally with `firebase emulators:start` before deploying

## 📞 Support

If you encounter issues:

1. Check the logs: `firebase functions:log --project dalsivoiceio`
2. Review Firebase Console: https://console.firebase.google.com/project/dalsivoiceio
3. See `FIREBASE_DEPLOYMENT.md` for detailed troubleshooting
4. Check GitHub issues: https://github.com/DMcoder75/dalsivoiceio23Feb/issues

## 🎉 You're All Set!

Your Dalsi Voice application is ready for Firebase deployment. Follow the Quick Start steps above to get it live in minutes.

**Questions?** Refer to `FIREBASE_DEPLOYMENT.md` for comprehensive documentation.
