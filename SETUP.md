# YouTube Upload Tool - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
npm install formidable
```

### 2. Set Up Environment Variables
Create a `.env.local` file in the root directory with:

```env
# Google OAuth2 Credentials
# Get these from: https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

# Your app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Get Google OAuth2 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable YouTube Data API v3
4. Create OAuth 2.0 Client ID (Web application)
5. Set Authorized redirect URIs to:
   - `http://localhost:3000/api/youtube/callback` (local development)
   - `https://yourdomain.com/api/youtube/callback` (production)
6. Copy Client ID and Client Secret into `.env.local`

### 4. Run the Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` and test the upload flow:
1. Click "🔐 Login with Google"
2. Authorize the app to access YouTube
3. You'll be redirected back with a token
4. Select a video file and upload it

## Project Structure

```
pages/
├── index.jsx              # Home page with link to upload tool
├── upload.jsx             # Upload form (file selection, title, description)
└── api/
    └── youtube/
        ├── auth.js        # Redirect to Google OAuth
        ├── callback.js    # Exchange code for access token
        └── upload.js      # Upload video to YouTube API
```

## Troubleshooting

**Q: "Missing token or title" error**
- Make sure you're logged in first (step should show ✅ Logged in)
- Select a video file and enter a title

**Q: OAuth redirect not working**
- Check your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Verify redirect URI matches in Google Cloud Console

**Q: Video upload fails**
- Check file size (max 100MB)
- Ensure it's a valid video format (mp4, mov, avi, etc.)
- Check API quota in Google Cloud Console

## Security Note

⚠️ **Production**: Store tokens securely in a database or session, not in URLs. This is a demo - don't use in production without proper token management.
