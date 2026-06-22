import { useState, useEffect } from 'react';

export default function Upload() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token, setToken] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (t) {
      setToken(t);
      setStep(2);
    }
  }, []);

  const login = () => {
    window.location.href = '/api/youtube/auth';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '500px', background: '#0d1526', border: '1px solid #1e293b', borderRadius: '14px', padding: '40px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 8px' }}>YouTube Upload</h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>Upload Shorts instantly</p>
        </div>

        {error && <div style={{ background: '#7f1d1d', color: '#fecaca', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>⚠️ {error}</div>}
        {success && <div style={{ background: '#064e3b', color: '#a7f3d0', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>✅ {success}</div>}

        {step === 1 && (
          <div>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#cbd5e1' }}>
                <strong>Step 1: Login with Google</strong><br/><br/>
                Click to authorize YouTube uploads.
              </div>
            </div>
            <button onClick={login} disabled={loading} style={{ width: '100%', background: loading ? '#1e293b' : 'linear-gradient(135deg, #4285f4, #1f2937)', color: '#fff', border: 'none', padding: '14px 0', borderRadius: '8px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
              {loading ? '🔄 Redirecting...' : '🔐 Login with Google'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ background: '#0a2010', border: '1px solid #10b98130', color: '#86efac', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
              ✅ Logged in! Ready to upload.
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>TITLE *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your video title" style={{ width: '100%', padding: '10px 12px', background: '#0d1526', border: '1.5px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '13px' }} />
            </div>

            <button style={{ width: '100%', background: title ? 'linear-gradient(135deg, #ff0000, #7c3aed)' : '#1e293b', color: '#fff', border: 'none', padding: '14px 0', borderRadius: '8px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }} disabled={!title}>
              🚀 Upload Coming Soon
            </button>
            
            <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px', color: '#475569' }}>
              Upload feature coming next update
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
