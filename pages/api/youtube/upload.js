import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const youtube = google.youtube('v3');

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { accessToken, title, description, tags } = req.body;
    const file = req.files?.file?.[0];

    if (!accessToken || !title || !file) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_APP_URL}/api/youtube/callback`
    );

    oauth2Client.setCredentials({ access_token: accessToken });

    const response = await youtube.videos.insert(
      {
        auth: oauth2Client,
        part: 'snippet,status',
        requestBody: {
          snippet: {
            title: title,
            description: description || '',
            tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
            categoryId: '22',
          },
          status: {
            privacyStatus: 'public',
          },
        },
        media: {
          body: fs.createReadStream(file.filepath),
        },
      }
    );

    res.status(200).json({
      success: true,
      videoId: response.data.id,
      videoUrl: `https://youtube.com/watch?v=${response.data.id}`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Upload failed: ' + (error.message || 'Unknown error'),
    });
  }
}
