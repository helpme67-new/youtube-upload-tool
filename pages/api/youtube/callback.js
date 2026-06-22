import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: 'No code' });

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_APP_URL}/api/youtube/callback`
    );

    const { tokens } = await oauth2Client.getToken(code);
    res.redirect(`/upload?token=${tokens.access_token}`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
