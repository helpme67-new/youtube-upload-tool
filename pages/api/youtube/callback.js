import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_APP_URL}/api/youtube/callback`
);

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const token = tokens.access_token;
    
    res.redirect(`/upload?token=${encodeURIComponent(token)}`);
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({ error: 'OAuth callback failed: ' + error.message });
  }
}
