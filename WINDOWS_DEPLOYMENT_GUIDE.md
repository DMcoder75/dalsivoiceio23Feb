# Dalsi Voice - Windows Deployment Guide

## Prerequisites

Before you start, install these on your Windows machine:

### 1. Node.js & npm
- Download from: https://nodejs.org/
- Choose **LTS version** (recommended)
- Install with default settings
- Verify installation:
  ```cmd
  node --version
  npm --version
  ```

### 2. Git (Optional but Recommended)
- Download from: https://git-scm.com/download/win
- Install with default settings
- This allows you to clone the repository

## Step 1: Get the Code on Your Windows Machine

### Option A: Download from GitHub (Easiest)
1. Go to: https://github.com/DMcoder75/dalsivoiceio23Feb
2. Click **Code** → **Download ZIP**
3. Extract the ZIP file to a folder (e.g., `C:\Users\YourName\dalsi-voice`)

### Option B: Clone with Git
```cmd
git clone https://github.com/DMcoder75/dalsivoiceio23Feb.git
cd dalsivoiceio23Feb
```

## Step 2: Set Up Your Service Account Key

1. Copy your Firebase service account JSON file:
   - File: `dalsivoiceio-firebase-adminsdk-fbsvc-fd1bcf795c.json`
   - Place it in your project root folder (e.g., `C:\Users\YourName\dalsi-voice\`)

## Step 3: Install Firebase CLI

Open **Command Prompt** or **PowerShell** and run:

```cmd
npm install -g firebase-tools
```

Verify installation:
```cmd
firebase --version
```

## Step 4: Navigate to Your Project

In Command Prompt/PowerShell:

```cmd
cd C:\Users\YourName\dalsi-voice
```

(Replace `YourName` with your actual Windows username, and adjust the path if you extracted to a different location)

## Step 5: Authenticate with Firebase

### Using Command Prompt/PowerShell:

**For Windows Command Prompt (cmd.exe):**
```cmd
set GOOGLE_APPLICATION_CREDENTIALS=C:\Users\YourName\dalsi-voice\dalsivoiceio-firebase-adminsdk-fbsvc-fd1bcf795c.json
```

**For Windows PowerShell:**
```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\YourName\dalsi-voice\dalsivoiceio-firebase-adminsdk-fbsvc-fd1bcf795c.json"
```

## Step 6: Deploy Cloud Functions

### 6a. Install Dependencies
```cmd
cd functions
npm install
```

### 6b. Build Functions
```cmd
npm run build
```

### 6c. Go Back to Root Directory
```cmd
cd ..
```

### 6d. Deploy Functions to Firebase
```cmd
firebase deploy --project dalsivoiceio --only functions
```

Wait for the deployment to complete. You should see:
```
✔ Deploy complete!
```

## Step 7: Verify Deployment

After deployment completes, test the API:

1. Open your browser
2. Go to: https://dalsivoiceio.web.app
3. Click "Get Started"
4. Select a voice profile
5. Enter some text
6. Click "Generate"

If you see the voice profile and can interact with it, the deployment was successful!

## Troubleshooting

### "firebase: The term 'firebase' is not recognized"
**Problem**: Firebase CLI not installed or not in PATH

**Solution**:
1. Reinstall Firebase CLI:
   ```cmd
   npm install -g firebase-tools
   ```
2. Restart Command Prompt/PowerShell
3. Try again

### "Permission denied" or "403 Caller does not have required permission"
**Problem**: Service account lacks permissions

**Solution**:
1. Go to: https://console.cloud.google.com/iam-admin/iam?project=dalsivoiceio
2. Find the service account: `firebase-adminsdk-fbsvc@dalsivoiceio.iam.gserviceaccount.com`
3. Click on it and add these roles:
   - **Cloud Functions Developer**
   - **Cloud Build Service Account**
   - **Service Usage Consumer**
4. Wait 2-3 minutes for permissions to propagate
5. Try deployment again

### "Cannot find module" or Build errors
**Problem**: Dependencies not installed

**Solution**:
```cmd
cd functions
rm -r node_modules
npm install
npm run build
cd ..
firebase deploy --project dalsivoiceio --only functions
```

(Note: On Windows, use `rmdir /s /q node_modules` instead of `rm -r`)

### "GOOGLE_APPLICATION_CREDENTIALS not found"
**Problem**: Path to service account JSON is incorrect

**Solution**:
1. Make sure the JSON file is in your project root
2. Use the full path to the file:
   ```cmd
   set GOOGLE_APPLICATION_CREDENTIALS=C:\full\path\to\dalsivoiceio-firebase-adminsdk-fbsvc-fd1bcf795c.json
   ```

### API endpoints return 404
**Problem**: Cloud Functions not deployed yet

**Solution**:
1. Run the deployment command again:
   ```cmd
   firebase deploy --project dalsivoiceio --only functions
   ```
2. Check deployment status in Firebase Console
3. Wait a few minutes for the function to initialize

## Windows-Specific Tips

### Using PowerShell vs Command Prompt
- **Command Prompt (cmd.exe)**: More traditional, works reliably
- **PowerShell**: More modern, better syntax highlighting
- Both work fine for Firebase deployment

### Setting Environment Variables Permanently (Optional)
If you want to avoid setting the environment variable every time:

1. **Windows 10/11**:
   - Press `Win + X` → System
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Click "New" under "User variables"
   - Variable name: `GOOGLE_APPLICATION_CREDENTIALS`
   - Variable value: `C:\Users\YourName\dalsi-voice\dalsivoiceio-firebase-adminsdk-fbsvc-fd1bcf795c.json`
   - Click OK and restart your terminal

2. After setting it, you can deploy without setting the variable each time:
   ```cmd
   firebase deploy --project dalsivoiceio --only functions
   ```

### Using Git Bash (Alternative)
If you install Git, you can use Git Bash which has Unix-like commands:
```bash
export GOOGLE_APPLICATION_CREDENTIALS=/c/Users/YourName/dalsi-voice/dalsivoiceio-firebase-adminsdk-fbsvc-fd1bcf795c.json
firebase deploy --project dalsivoiceio --only functions
```

## Complete Deployment Checklist

- [ ] Node.js installed (`node --version` works)
- [ ] Firebase CLI installed (`firebase --version` works)
- [ ] Service account JSON file in project root
- [ ] Navigated to project directory (`cd C:\Users\YourName\dalsi-voice`)
- [ ] Set GOOGLE_APPLICATION_CREDENTIALS environment variable
- [ ] Ran `cd functions && npm install && npm run build && cd ..`
- [ ] Ran `firebase deploy --project dalsivoiceio --only functions`
- [ ] Deployment completed successfully
- [ ] Tested at https://dalsivoiceio.web.app

## Next Steps

1. **Test the Application**: Visit https://dalsivoiceio.web.app
2. **Monitor Deployment**: Check Firebase Console for logs
3. **Integrate Real TTS**: Replace mock audio with Google Cloud Text-to-Speech
4. **Add Database**: Connect to Firestore for persistent data
5. **Custom Domain**: Configure dalsivoice.io in Firebase Hosting

## Support Resources

- **Firebase Documentation**: https://firebase.google.com/docs
- **Cloud Functions Guide**: https://firebase.google.com/docs/functions
- **Node.js Documentation**: https://nodejs.org/docs/
- **GitHub Repository**: https://github.com/DMcoder75/dalsivoiceio23Feb

## Quick Reference Commands

```cmd
# Navigate to project
cd C:\Users\YourName\dalsi-voice

# Set environment variable (Command Prompt)
set GOOGLE_APPLICATION_CREDENTIALS=C:\Users\YourName\dalsi-voice\dalsivoiceio-firebase-adminsdk-fbsvc-fd1bcf795c.json

# Install dependencies
cd functions && npm install && cd ..

# Build functions
cd functions && npm run build && cd ..

# Deploy functions
firebase deploy --project dalsivoiceio --only functions

# Check deployment status
firebase functions:log --project dalsivoiceio

# View Firebase console
firebase open console --project dalsivoiceio
```

You're all set! Good luck with your deployment! 🚀
