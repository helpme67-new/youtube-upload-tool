export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px' }}>🎬 YouTube Upload Tool</h1>
        <p style={{ fontSize: '18px', color: '#94a3b8', marginBottom: '32px' }}>Your AI content system is ready</p>
        <a href="/upload" style={{ background: 'linear-gradient(135deg, #ff0000, #7c3aed)', color: '#fff', padding: '14px 40px', borderRadius: '8px', textDecoration: 'none', fontSize: '16px', fontWeight: '700', display: 'inline-block' }}>
          📤 Go to Upload Tool
        </a>
      </div>
    </div>
  );
}
