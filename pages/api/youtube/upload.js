import { google } from 'googleapis';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, title, description } = req.query;

  if (!token || !title) {
    return res.status(400).json({ error: 'Missing token or title' });
  }

  try {
    // Parse multipart form data (for video file)
    const form = formidable({ multiples: false });
    const [fields, files] = await form.parse(req);

    const videoFile = files.video?.[0];
    if (!videoFile) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    // Create OAuth2 client with user's token
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NEXT_PUBLIC_APP_URL + '/api/youtube/callback'
    );

    oauth2Client.setCredentials({ access_token: token });

    // Initialize YouTube API
    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client,
    });

    // Upload video
    const fileStream = fs.createReadStream(videoFile.filepath);
    
    const response = await youtube.videos.insert(
      {
        part: 'snippet,status',
        requestBody: {
          snippet: {
            title: title,
            description: description || '',
          },
          status: {
            privacyStatus: 'private', // Change to 'public' or 'unlisted' as needed
          },
        },
        media: {
          body: fileStream,
        },
      }
    );

    // Clean up temp file
    fs.unlinkSync(videoFile.filepath);

    res.status(200).json({
      success: true,
      videoId: response.data.id,
      message: 'Video uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload video',
      details: error.message 
    });
  }
}
