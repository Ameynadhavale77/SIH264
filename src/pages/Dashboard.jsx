import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MdDescription,
  MdPendingActions,
  MdWarning,
  MdCompareArrows,
  MdCheckCircle,
  MdTrendingUp,
  MdArrowForward,
  MdRefresh
} from 'react-icons/md';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { api } from '../services/api';

const ADMIN_COLORS = ['#1B365D', '#D9531E', '#16A34A', '#0284C7', '#B45309', '#64748B'];

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    overdueComplaints: 0,
    overlapsDetected: 0,
    disposedCases: 0,
    escalatedCases: 0,
    disposalRate: 0
  });

  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [bureauWorkload, setBureauWorkload] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [flaggedOverlaps, setFlaggedOverlaps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [summaryRes, trendRes, bureauRes, recentRes, overlapRes] = await Promise.all([
        api.get('/reports/dashboard-summary'),
        api.get('/reports/monthly-trend'),
        api.get('/reports/bureau-summary'),
        api.get('/complaints', { limit: 6 }),
        api.get('/overlaps', { status: 'FLAGGED' })
      ]);

      setStats({
        totalComplaints: summaryRes.totalComplaints || 0,
        pendingComplaints: summaryRes.pendingComplaints || 0,
        overdueComplaints: summaryRes.overdueComplaints || 0,
        overlapsDetected: summaryRes.totalOverlaps || 0,
        disposedCases: summaryRes.disposedComplaints || 0,
        escalatedCases: summaryRes.escalatedComplaints || 0,
        disposalRate: summaryRes.disposalRate || 0
      });

      setMonthlyTrend(trendRes || []);
      setBureauWorkload(bureauRes || []);
      setRecentComplaints(recentRes.complaints || []);
      setFlaggedOverlaps(Array.isArray(overlapRes) ? overlapRes : []);
    } catch (err) {
      console.error('Failed to load live dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    const s = (status || 'NEW').toLowerCase();
    return <span className={`badge badge-${s}`}>{t(`status.${status}`) || status}</span>;
  };

  const getPriorityBadge = (priority) => {
    const p = (priority || 'MEDIUM').toLowerCase();
    return <span className={`badge badge-${p}`}>{t(`priority.${priority}`) || priority}</span>;
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('dashboard.title')}</h1>
          <p className="page-subtitle">{t('dashboard.subtitle')}</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={fetchDashboardData} disabled={loading}>
          <MdRefresh /> Refresh Live Data
        </button>
      </div>

      {/* Critical Cross-Bureau Overlap Alert Banner */}
      {flaggedOverlaps.length > 0 && (
        <div className="gov-alert-banner">
          <MdWarning className="gov-alert-icon" />
          <div className="gov-alert-content" style={{ flex: 1 }}>
            <h4>{t('dashboard.overlapAlertTitle')} ({flaggedOverlaps.length} Flagged)</h4>
            <p>{t('dashboard.overlapAlertDesc')}</p>
          </div>
          <button className="btn btn-danger btn-sm" onClick={() => navigate('/overlaps')}>
            {t('dashboard.reviewNow')} <MdArrowForward />
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card blue">
          <div className="kpi-header">
            <span className="kpi-label">{t('dashboard.totalComplaints')}</span>
            <MdDescription style={{ color: 'var(--primary-navy)' }} />
          </div>
          <div className="kpi-value">{stats.totalComplaints}</div>
          <div className="kpi-subtext">All AICTE bureaus combined</div>
        </div>

        <div className="kpi-card saffron">
          <div className="kpi-header">
            <span className="kpi-label">{t('dashboard.pendingComplaints')}</span>
            <MdPendingActions style={{ color: 'var(--accent-saffron)' }} />
          </div>
          <div className="kpi-value" style={{ color: 'var(--accent-saffron)' }}>{stats.pendingComplaints}</div>
          <div className="kpi-subtext">Under review / scrutiny</div>
        </div>

        <div className="kpi-card red">
          <div className="kpi-header">
            <span className="kpi-label">{t('dashboard.overdueComplaints')}</span>
            <MdWarning style={{ color: '#DC2626' }} />
          </div>
          <div className="kpi-value" style={{ color: '#DC2626' }}>{stats.overdueComplaints}</div>
          <div className="kpi-subtext">Citizen charter SLA expired</div>
        </div>

        <div className="kpi-card saffron">
          <div className="kpi-header">
            <span className="kpi-label">{t('dashboard.overlapsDetected')}</span>
            <MdCompareArrows style={{ color: 'var(--accent-saffron)' }} />
          </div>
          <div className="kpi-value" style={{ color: 'var(--accent-saffron)' }}>{stats.overlapsDetected}</div>
          <div className="kpi-subtext">Parallel cross-bureau cases</div>
        </div>

        <div className="kpi-card green">
          <div className="kpi-header">
            <span className="kpi-label">{t('dashboard.disposedCases')}</span>
            <MdCheckCircle style={{ color: '#16A34A' }} />
          </div>
          <div className="kpi-value" style={{ color: '#16A34A' }}>{stats.disposedCases}</div>
          <div className="kpi-subtext">Disposal rate: {stats.disposalRate}%</div>
        </div>

        <div className="kpi-card red">
          <div className="kpi-header">
            <span className="kpi-label">{t('dashboard.escalatedCases')}</span>
            <MdTrendingUp style={{ color: '#B91C1C' }} />
          </div>
          <div className="kpi-value" style={{ color: '#B91C1C' }}>{stats.escalatedCases}</div>
          <div className="kpi-subtext">Senior bureau intervention</div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Monthly Trend Chart */}
        <div className="gov-card" style={{ marginBottom: 0 }}>
          <div className="gov-card-header">
            <h3 className="gov-card-title">{t('dashboard.intakeTrend')}</h3>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={monthlyTrend} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '4px', fontSize: '0.8rem' }}
                />
                <Legend wrapperStyle={{ fontSize: '0.78rem' }} />
                <Line type="monotone" dataKey="filed" name="Grievances Filed" stroke="#1B365D" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="resolved" name="Cases Disposed" stroke="#16A34A" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bureau Workload Bar Chart */}
        <div className="gov-card" style={{ marginBottom: 0 }}>
          <div className="gov-card-header">
            <h3 className="gov-card-title">{t('dashboard.bureauWorkload')}</h3>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={bureauWorkload} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="bureau" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '4px', fontSize: '0.8rem' }}
                />
                <Legend wrapperStyle={{ fontSize: '0.78rem' }} />
                <Bar dataKey="pendingCases" name="Pending Cases" fill="#D9531E" radius={[3, 3, 0, 0]} />
                <Bar dataKey="disposedCases" name="Disposed Cases" fill="#1B365D" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Grievances Table */}
      <div className="gov-card">
        <div className="gov-card-header">
          <h3 className="gov-card-title">{t('dashboard.recentComplaints')}</h3>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/complaints')}>
            View All Complaints <MdArrowForward />
          </button>
        </div>

        <div className="table-responsive">
          <table className="gov-table">
            <thead>
              <tr>
                <th>{t('dashboard.caseId')}</th>
                <th>{t('dashboard.institution')}</th>
                <th>{t('dashboard.category')}</th>
                <th>{t('dashboard.bureau')}</th>
                <th>{t('dashboard.priority')}</th>
                <th>{t('dashboard.statusLabel')}</th>
                <th>{t('dashboard.filedDate')}</th>
                <th>{t('dashboard.action')}</th>
              </tr>
            </thead>
            <tbody>
              {recentComplaints.map(c => (
                <tr key={c.id}>
                  <td>
                    <span
                      style={{ fontWeight: 700, color: 'var(--primary-navy)', cursor: 'pointer' }}
                      onClick={() => navigate(`/complaints/${c.id}`)}
                    >
                      {c.complaintNumber}
                    </span>
                    {c.hasOverlap && (
                      <span className="badge badge-critical" style={{ marginLeft: '6px', fontSize: '0.62rem' }}>
                        ⚠️ Overlap
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.institution?.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {c.institution?.aicteId} • {c.institution?.city}
                    </div>
                  </td>
                  <td>{c.category}</td>
                  <td><span className="badge badge-dept">{c.department}</span></td>
                  <td>{getPriorityBadge(c.priority)}</td>
                  <td>{getStatusBadge(c.status)}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {new Date(c.filedDate).toISOString().split('T')[0]}
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => navigate(`/complaints/${c.id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
