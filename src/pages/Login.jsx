import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdLock, MdEmail, MdShield, MdArrowForward } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const { t, i18n } = useTranslation();

  const [email, setEmail] = useState('admin@aicte.gov.in');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
    }
  };

  const handleQuickDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  const currentLang = i18n.language || 'en-IN';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', display: 'flex', flexDirection: 'column' }}>
      {/* Tricolor Ribbon */}
      <div className="gov-tricolor-bar" />

      {/* Prototype Banner */}
      <div className="gov-disclaimer-banner">
        {t('app.prototypeNotice')}
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div
          className="gov-card"
          style={{
            maxWidth: '460px',
            width: '100%',
            padding: '32px',
            boxShadow: 'var(--shadow-elevated)',
            borderTop: '4px solid var(--primary-navy)'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                background: 'var(--primary-navy)',
                color: '#FFFFFF',
                borderRadius: '8px',
                margin: '0 auto 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 800,
                border: '2px solid var(--accent-saffron)'
              }}
            >
              AICTE
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
              {t('app.shortTitle')}
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              All India Council for Technical Education • SIH 2026 PS 264
            </p>
          </div>

          {/* Trilingual Selector on Login */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div className="lang-switcher">
              <button
                type="button"
                className={`lang-btn ${currentLang.startsWith('en') ? 'active' : ''}`}
                onClick={() => i18n.changeLanguage('en-IN')}
              >
                English
              </button>
              <button
                type="button"
                className={`lang-btn ${currentLang.startsWith('hi') ? 'active' : ''}`}
                onClick={() => i18n.changeLanguage('hi-IN')}
              >
                हिंदी
              </button>
              <button
                type="button"
                className={`lang-btn ${currentLang.startsWith('mr') ? 'active' : ''}`}
                onClick={() => i18n.changeLanguage('mr-IN')}
              >
                मराठी
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: '#FEE2E2',
                border: '1px solid #FCA5A5',
                color: '#991B1B',
                padding: '10px 14px',
                borderRadius: '4px',
                fontSize: '0.82rem',
                marginBottom: '16px'
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                OFFICIAL EMAIL ADDRESS
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="filter-input"
                  style={{ width: '100%', paddingLeft: '32px' }}
                  placeholder="name@aicte.gov.in"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <MdEmail style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="filter-input"
                  style={{ width: '100%', paddingLeft: '32px' }}
                  placeholder="Enter secure password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <MdLock style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.9rem' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'} <MdArrowForward />
            </button>
          </form>

          {/* Quick Demo Credential Pills */}
          <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
              QUICK DEMO ROLES (ONE-CLICK SWITCH):
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'space-between', width: '100%' }}
                onClick={() => handleQuickDemo('admin@aicte.gov.in', 'admin123')}
              >
                <span><strong>Admin (HQ)</strong>: Dr. Rajesh Kumar</span>
                <span className="badge badge-critical">Full Access</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'space-between', width: '100%' }}
                onClick={() => handleQuickDemo('priya@aicte.gov.in', 'admin123')}
              >
                <span><strong>Bureau Head (RB)</strong>: Ms. Priya Sharma</span>
                <span className="badge badge-dept">Regulation</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'space-between', width: '100%' }}
                onClick={() => handleQuickDemo('anil@aicte.gov.in', 'admin123')}
              >
                <span><strong>Bureau Head (PGRC)</strong>: Mr. Anil Verma</span>
                <span className="badge badge-dept">Grievance</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'space-between', width: '100%' }}
                onClick={() => handleQuickDemo('vikram@aicte.gov.in', 'admin123')}
              >
                <span><strong>Scrutiny Officer (North)</strong>: Mr. Vikram Singh</span>
                <span className="badge badge-low">Officer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
