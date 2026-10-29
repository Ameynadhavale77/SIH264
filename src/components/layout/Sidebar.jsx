import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MdDashboard,
  MdDescription,
  MdAccountBalance,
  MdCompareArrows,
  MdBarChart,
  MdLogout,
  MdHub,
  MdHandshake,
  MdHistory,
  MdTune
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function Sidebar() {
  const { t } = useTranslation();
  const { logout, user, hasRole } = useAuth();
  const location = useLocation();
  const [flaggedCount, setFlaggedCount] = useState(0);

  useEffect(() => {
    async function loadFlaggedOverlaps() {
      try {
        const data = await api.get('/overlaps', { status: 'FLAGGED' });
        setFlaggedCount(Array.isArray(data) ? data.length : 0);
      } catch (err) {
        // Fallback
      }
    }
    loadFlaggedOverlaps();
  }, [location.pathname]);

  const navItems = [
    { path: '/', icon: <MdDashboard />, label: t('nav.dashboard'), exact: true },
    { path: '/complaints', icon: <MdDescription />, label: t('nav.complaints') },
    { path: '/institutions', icon: <MdAccountBalance />, label: t('nav.institutions') },
    { path: '/overlaps', icon: <MdCompareArrows />, label: t('nav.overlaps'), badge: flaggedCount },
    { path: '/coordination', icon: <MdHandshake />, label: t('nav.coordination') },
    { path: '/network', icon: <MdHub />, label: t('nav.caseNetwork') },
    { path: '/reports', icon: <MdBarChart />, label: t('nav.reports') },
  ];

  if (hasRole('ADMIN', 'BUREAU_HEAD')) {
    navItems.push({ path: '/audit-logs', icon: <MdHistory />, label: t('nav.auditLogs') });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-emblem">AICTE</div>
        <div className="sidebar-header-text">
          <h2>{t('app.shortTitle')}</h2>
          <p>{t('app.subtitle')}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-title">AICTE PORTAL</div>
        {navItems.map(item => {
          const isActive = item.exact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              end={item.exact}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge > 0 && <span className="sidebar-badge">{item.badge}</span>}
            </NavLink>
          );
        })}

        <div className="sidebar-section-title" style={{ marginTop: '16px' }}>OFFICER SESSION</div>
        <button className="sidebar-link" onClick={logout}>
          <span className="sidebar-link-icon"><MdLogout /></span>
          <span>{t('nav.logout')}</span>
        </button>
      </nav>
    </aside>
  );
}
