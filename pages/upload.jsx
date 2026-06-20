import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function YouTubeUpload() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setAccessToken(token);
      setStep(2);
      window.history.replaceState({}, document.title, '/upload');
    }
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      window.location.href = '/api/youtube/auth';
    } catch (err) {
      setError('Login failed: ' + err.message);
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setError('File too large. Max 100MB for Shorts.');
        return;
      }
      if (!file.type.startsWith('video/')) {
        setError('Please select a video file.');
        return;
      }
      setVideoFile(file);
      setError('');
    }
  };

  const handlePasteContent = () => {
    navigator.clipboard.readText().then(text => {
      const parts = text.split('\n\n');
      if (parts.length >= 1) setTitle(parts[0] || '');
      if (parts.length >= 2) setDescription(parts[1] || '');
      if (parts.length >= 3) setTags(parts[2] || '');
    }).catch(() => setError('Could not read clipboard'));
  };

  const handleUpload = async () => {
    if (!videoFile || !title) {
      setError('Video and title required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', videoFile);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('tags', tags);
      formData.append('accessToken', accessToken);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setSuccess(`✅ Video uploaded! Watch: ${response.videoUrl}`);
          setVideoFile(null);
          setTitle('');
          setDescription('');
          setTags('');
          setUploadProgress(0);
          setTimeout(() => {
            window.open(response.videoUrl, '_blank');
          }, 2000);
        } else {
          try {
            const err = JSON.parse(xhr.responseText);
            setError('Upload failed: ' + err.error);
          } catch {
            setError('Upload failed: ' + xhr.statusText);
          }
        }
        setLoading(false);
      });

      xhr.addEventListener('error', () => {
        setError('Upload error. Check file and try again.');
        setLoading(false);
      });

      xhr.open('POST', '/api/youtube/upload');
      xhr.send(formData);
    } catch (err) {
      setError('Upload failed: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1a0f2e 100%)',
      fontFamily: "'Inter','Segoe UI',sans-serif",
      color: '#f1f5f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <style>{`
        * { box-sizing: border-box; }
        button { transition: opacity .2s, transform .2s; font-family: inherit; }
        button:hover:not(:disabled) { opacity: .85; transform: translateY(-1px); }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
        input, textarea { font-family: inherit; }
      `}</style>

      <div style={{
        width: '100%',
        maxWidth: '500px',
        background: '#0d1526',
        border: '1px solid #1e293b',
        borderRadius: '14px',
        padding: '40px 32px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #ff0000, #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            margin: '0 auto 16px',
          }}>🎬</div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 8px' }}>
            YouTube Auto-Upload
          </h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>
            Upload Shorts from your AI content package
          </p>
        </div>

        {error && (
          <div style={{
            background: '#7f1d1d',
            border: '1px solid #ef4444',
            color: '#fecaca',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '13px',
          }}>{error}</div>
        )}
        {success && (
          <div style={{
            background: '#064e3b',
            border: '1px solid #10b981',
            color: '#a7f3d0',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '13px',
          }}>{success}</div>
        )}

        {step === 1 && (
          <div>
            <div style={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
            }}>
              <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#cbd5e1' }}>
                <strong>Step 1: Authenticate with Google</strong>
                <br /><br />
                Click below to log in with your Google account and grant permission to upload videos to your YouTube channel.
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #4285f4 0%, #1f2937 100%)',
                color: '#fff',
                border: 'none',
                padding: '14px 0',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? '🔄 Redirecting...' : '🔐 Login with Google'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{
              background: '#0a2010',
              border: '1px solid #10b98130',
              color: '#86efac',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '13px',
            }}>
              ✅ Authenticated! Ready to upload.
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#cbd5e1',
                fontSize: '13px',
                fontWeight: '700',
                marginBottom: '8px',
              }}>SELECT VIDEO</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#0d1526',
                  border: `1.5px solid ${videoFile ? '#10b981' : '#1e293b'}`,
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              />
              {videoFile && (
                <div style={{ color: '#10b981', fontSize: '12px', marginTop: '6px' }}>
                  ✓ {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)}MB)
                </div>
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#cbd5e1',
                fontSize: '13px',
                fontWeight: '700',
                marginBottom: '6px',
              }}>TITLE (from AI Agent)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Paste your SEO title here"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#0d1526',
                  border: '1.5px solid #1e293b',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '13px',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#cbd5e1',
                fontSize: '13px',
                fontWeight: '700',
                marginBottom: '6px',
              }}>DESCRIPTION</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Paste your description here"
                rows={4}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#0d1526',
                  border: '1.5px solid #1e293b',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '13px',
                  resize: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#cbd5e1',
                fontSize: '13px',
                fontWeight: '700',
                marginBottom: '6px',
              }}>TAGS (comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="habit, motivation, daily, ..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#0d1526',
                  border: '1.5px solid #1e293b',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '13px',
                }}
              />
            </div>

            <button
              onClick={handlePasteContent}
              style={{
                width: '100%',
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#cbd5e1',
                padding: '10px 0',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                marginBottom: '12px',
              }}
            >
              📋 Auto-fill from Clipboard
            </button>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: '#0d1526',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${uploadProgress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #ff0000, #7c3aed)',
                    transition: 'width .3s',
                  }} />
                </div>
                <div style={{
                  color: '#94a3b8',
                  fontSize: '12px',
                  marginTop: '6px',
                  textAlign: 'center',
                }}>
                  {uploadProgress}% uploaded...
                </div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={loading || !videoFile || !title}
              style={{
                width: '100%',
                background: loading || !videoFile || !title
                  ? '#1e293b'
                  : 'linear-gradient(135deg, #ff0000, #7c3aed)',
                color: loading || !videoFile || !title ? '#334155' : '#fff',
                border: 'none',
                padding: '14px 0',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: loading || !videoFile || !title ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? '⚡ Uploading...' : '🚀 Upload to YouTube'}
            </button>
          </div>
        )}

        <div style={{
          marginTop: '32px',
          paddingTop: '20px',
          borderTop: '1px solid #1e293b',
          color: '#475569',
          fontSize: '12px',
          textAlign: 'center',
          lineHeight: '1.6',
        }}>
          💡 Paste your AI-generated title, description & tags directly from the Control Center.<br />
          Video will be published as <strong>Public</strong>. Change privacy in YouTube Studio if needed.
        </div>
      </div>
    </div>
  );
}
