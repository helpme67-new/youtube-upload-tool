export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const cookies = [
    'yt_refresh_token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax',
    'yt_access_token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax',
  ];

  res.setHeader('Set-Cookie', cookies);
  res.status(200).json({ success: true, message: 'Logged out successfully' });
}
