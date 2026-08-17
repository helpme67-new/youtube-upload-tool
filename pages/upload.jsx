import { useState, useEffect, useRef } from 'react';

export default function Upload() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token, setToken] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacyStatus, setPrivacyStatus] = useState('private');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (t) {
      setToken(t);
      setStep(2);
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title || !token) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('video', selectedFile);

      const queryParams = new URLSearchParams({
        token,
        title,
        description,
        privacyStatus,
      });

      const res = await fetch(`/api/youtube/upload?${queryParams}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(`Video uploaded! ID: ${data.videoId}`);
        setSelectedFile(null);
        setTitle('');
        setDescription('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    background: '#0d1526',
    border: '1px solid #1e293b',
    borderRadius: '8px',
    color: '#f1f5f9',
    fontSize: '13px',
    marginBottom: '12px',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '500px', background: '#0d1526', border: '1px solid #1e293b', borderRadius: '14px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0' }}>YouTube Upload</h1>
        </div>

        {error && (
          <div style={{ background: '#2a0a0a', color: '#fca5a5', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
            ❌ {error}
          </div>
        )}

        {success && (
          <div style={{ background: '#0a2010', color: '#86efac', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
            ✅ {success}
          </div>
        )}

        {step === 1 && (
          <button
            onClick={() => { window.location.href = '/api/youtube/auth'; }}
            style={{ width: '100%', background: 'linear-gradient(135deg, #4285f4, #1f2937)', color: '#fff', border: 'none', padding: '14px 0', borderRadius: '8px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}
          >
            🔐 Login with Google
          </button>
        )}

        {step === 2 && (
          <div>
            <div style={{ background: '#0a2010', color: '#86efac', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
              ✅ Logged in! Ready to upload.
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              style={{ width: '100%', padding: '10px 0', marginBottom: '12px', color: '#f1f5f9', fontSize: '13px' }}
            />

            {selectedFile && (
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>
                📁 {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)
              </div>
            )}

            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter video title"
              style={inputStyle}
            />

            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter video description (optional)"
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
            />

            <select
              value={privacyStatus}
              onChange={e => setPrivacyStatus(e.target.value)}
              style={inputStyle}
            >
              <option value="private">Private</option>
              <option value="unlisted">Unlisted</option>
              <option value="public">Public</option>
            </select>

            <button
              disabled={!title || !selectedFile || loading}
              onClick={handleUpload}
              style={{
                width: '100%',
                background: (title && selectedFile && !loading)
                  ? 'linear-gradient(135deg, #ff0000, #7c3aed)'
                  : '#1e293b',
                color: '#fff',
                border: 'none',
                padding: '14px 0',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: (title && selectedFile && !loading) ? 'pointer' : 'not-allowed',
              }}
            >
              {loading ? '⏳ Uploading...' : '🚀 Upload to YouTube'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
