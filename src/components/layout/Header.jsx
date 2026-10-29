import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MdSearch,
  MdNotifications,
  MdWarning,
  MdSchedule,
  MdTrendingUp,
  MdInfo,
  MdLanguage,
  MdClear
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Fetch real notifications from database
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const data = await api.get('/notifications');
        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        // Fallback
      }
    }
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowNotifications(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (q.trim().length < 2) {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }

    try {
      const [compRes, instRes] = await Promise.all([
        api.get('/complaints', { search: q.trim(), limit: 4 }),
        api.get('/institutions', { search: q.trim(), limit: 4 })
      ]);

      const results = [];
      if (instRes.institutions) {
        instRes.institutions.forEach(i => {
          results.push({
            type: 'Institution',
            label: i.name,
            sublabel: `Permanent AICTE ID: ${i.aicteId} • ${i.city}, ${i.state}`,
            link: `/institutions/${i.id}`
          });
        });
      }

      if (compRes.complaints) {
        compRes.complaints.forEach(c => {
          results.push({
            type: 'Complaint',
            label: `${c.complaintNumber} (${c.department})`,
            sublabel: `${c.institution?.name} • ${c.category}`,
            link: `/complaints/${c.id}`
          });
        });
      }

      setSearchResults(results);
      setShowSearch(true);
    } catch (err) {
      // Ignore
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      // Ignore
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('aicte_lang', lng);
  };

  const currentLang = i18n.language || 'en-IN';

  return (
    <header className="gov-header">
      <div className="gov-header-left">
        <div className="gov-title-group">
          <h1>{t('app.title')}</h1>
          <p>Government of India • All India Council for Technical Education (AICTE)</p>
        </div>
      </div>

      <div className="gov-header-right">
        {/* Global Live Search */}
        <div style={{ position: 'relative', width: '280px' }} ref={searchRef}>
          <input
            type="text"
            className="filter-input"
            style={{ width: '100%', paddingLeft: '32px' }}
            placeholder={t('common.search') + '...'}
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
          />
          <MdSearch
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              fontSize: '1.1rem'
            }}
          />

          {showSearch && searchResults.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                width: '360px',
                background: '#FFFFFF',
                border: '1px solid var(--border-card)',
                borderRadius: '6px',
                boxShadow: 'var(--shadow-elevated)',
                zIndex: 1000,
                maxHeight: '380px',
                overflowY: 'auto'
              }}
            >
              {searchResults.map((r, i) => (
                <div
                  key={i}
                  style={{
                    padding: '10px 14px',
                    borderBottom: '1px solid var(--border-light)',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    navigate(r.link);
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--primary-navy)' }}>{r.label}</span>
                    <span className="badge badge-dept" style={{ fontSize: '0.65rem' }}>{r.type}</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{r.sublabel}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trilingual Language Switcher */}
        <div className="lang-switcher">
          <button
            className={`lang-btn ${currentLang.startsWith('en') ? 'active' : ''}`}
            onClick={() => handleLanguageChange('en-IN')}
            title="English (India)"
          >
            English
          </button>
          <button
            className={`lang-btn ${currentLang.startsWith('hi') ? 'active' : ''}`}
            onClick={() => handleLanguageChange('hi-IN')}
            title="हिन्दी (Hindi)"
          >
            हिंदी
          </button>
          <button
            className={`lang-btn ${currentLang.startsWith('mr') ? 'active' : ''}`}
            onClick={() => handleLanguageChange('mr-IN')}
            title="मराठी (Marathi)"
          >
            मराठी
          </button>
        </div>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 10px', position: 'relative' }}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <MdNotifications style={{ fontSize: '1.2rem', color: 'var(--primary-navy)' }} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#DC2626',
                  color: 'white',
                  borderRadius: '10px',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '1px 5px'
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '360px',
                background: '#FFFFFF',
                border: '1px solid var(--border-card)',
                borderRadius: '6px',
                boxShadow: 'var(--shadow-elevated)',
                zIndex: 1000,
                maxHeight: '420px',
                overflowY: 'auto'
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border-light)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#F8FAFC'
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--primary-navy)' }}>Notifications</span>
                <span className="badge badge-dept">{unreadCount} unread</span>
              </div>

              {notifications.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  No active notices.
                </div>
              ) : (
                notifications.slice(0, 8).map(n => (
                  <div
                    key={n.id}
                    style={{
                      padding: '12px 14px',
                      borderBottom: '1px solid var(--border-light)',
                      backgroundColor: n.isRead ? 'transparent' : '#FEF3C7',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleMarkAsRead(n.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <strong style={{ fontSize: '0.82rem', color: 'var(--primary-navy)' }}>{n.title}</strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '4px 0' }}>
                      {n.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* User Pill */}
        <div className="user-profile-pill">
          <div className="user-avatar-circle">{user?.avatar || 'AICTE'}</div>
          <div className="user-details">
            <div className="name">{user?.name || 'Officer'}</div>
            <div className="role-dept">
              {user?.role} • {user?.department}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
