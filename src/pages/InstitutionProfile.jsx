import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MdArrowBack,
  MdAccountBalance,
  MdWarning,
  MdCompareArrows,
  MdVerified,
  MdLocationOn,
  MdBusiness,
  MdArrowForward
} from 'react-icons/md';
import { api } from '../services/api';

export default function InstitutionProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [institution, setInstitution] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [activeTab, setActiveTab] = useState('complaints'); // complaints | overlaps | compliance
  const [complaintSearch, setComplaintSearch] = useState('');
  const [complaintStatusFilter, setComplaintStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/institutions/${id}`);
      setInstitution(data.institution);
      setMetrics(data.metrics);
    } catch (err) {
      console.error('Failed to load institution profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>{t('common.loading')}</div>;
  }

  if (!institution) {
    return (
      <div className="gov-card" style={{ textAlign: 'center', padding: '40px' }}>
        <h3>Institution profile not found.</h3>
        <button className="btn btn-primary" onClick={() => navigate('/institutions')} style={{ marginTop: '12px' }}>
          Back to Directory
        </button>
      </div>
    );
  }

  const filteredComplaints = institution.complaints?.filter(c => {
    if (complaintSearch) {
      const q = complaintSearch.toLowerCase();
      if (!c.complaintNumber.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q) && !c.category.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (complaintStatusFilter !== 'All' && c.status !== complaintStatusFilter) {
      return false;
    }
    return true;
  }) || [];

  const getStatusBadge = (s) => {
    const cls = (s || 'NEW').toLowerCase();
    return <span className={`badge badge-${cls}`}>{t(`status.${s}`) || s}</span>;
  };

  return (
    <div>
      <button
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '16px' }}
        onClick={() => navigate('/institutions')}
      >
        <MdArrowBack /> Back to Institutions
      </button>

      {/* Institution Banner Card */}
      <div className="gov-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              background: 'var(--primary-navy)',
              color: 'white',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              border: '2px solid var(--accent-saffron)'
            }}
          >
            <MdAccountBalance />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-navy)', margin: 0 }}>
                {institution.name}
              </h2>
              <span className={`badge ${institution.status === 'Active' ? 'badge-disposed' : 'badge-escalated'}`}>
                {institution.status}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '6px', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <span>
                <strong>Permanent AICTE ID:</strong>{' '}
                <span style={{ fontFamily: 'monospace', color: 'var(--primary-navy)', fontWeight: 700 }}>
                  {institution.aicteId}
                </span>
              </span>
              <span>
                <MdLocationOn /> {institution.city}, {institution.state} ({institution.region} Region)
              </span>
              <span>
                <MdBusiness /> Discipline: <strong>{institution.type}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Cross-bureau overlap alert if active */}
        {metrics?.overlapCount > 0 && (
          <div className="gov-alert-banner" style={{ marginTop: '16px', marginBottom: 0 }}>
            <MdWarning className="gov-alert-icon" />
            <div className="gov-alert-content" style={{ flex: 1 }}>
              <h4>Active Cross-Bureau Overlaps ({metrics.overlapCount})</h4>
              <p>
                Multiple AICTE departments (Regulation Bureau, PGRC, or Legal) are handling parallel complaints against this institution.
                Switch to the Overlaps tab to coordinate joint resolution.
              </p>
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => setActiveTab('overlaps')}>
              Inspect Overlaps
            </button>
          </div>
        )}
      </div>

      {/* KPI Stats Row */}
      <div className="kpi-grid">
        <div className="kpi-card blue">
          <div className="kpi-header"><span className="kpi-label">Total Grievances</span></div>
          <div className="kpi-value">{metrics?.totalComplaints || 0}</div>
          <div className="kpi-subtext">Cumulative complaints</div>
        </div>
        <div className="kpi-card saffron">
          <div className="kpi-header"><span className="kpi-label">Active Cases</span></div>
          <div className="kpi-value" style={{ color: 'var(--accent-saffron)' }}>{metrics?.activeCases || 0}</div>
          <div className="kpi-subtext">Under inquiry</div>
        </div>
        <div className="kpi-card red">
          <div className="kpi-header"><span className="kpi-label">Overdue SLAs</span></div>
          <div className="kpi-value" style={{ color: '#DC2626' }}>{metrics?.overdueCases || 0}</div>
          <div className="kpi-subtext">Past charter deadline</div>
        </div>
        <div className="kpi-card saffron">
          <div className="kpi-header"><span className="kpi-label">Cross-Bureau Overlaps</span></div>
          <div className="kpi-value" style={{ color: 'var(--accent-saffron)' }}>{metrics?.overlapCount || 0}</div>
          <div className="kpi-subtext">Collision incidents</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-header"><span className="kpi-label">Disposed Cases</span></div>
          <div className="kpi-value" style={{ color: '#16A34A' }}>{metrics?.disposedCases || 0}</div>
          <div className="kpi-subtext">Compliance completed</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-bar">
        <button
          className={`tab-btn ${activeTab === 'complaints' ? 'active' : ''}`}
          onClick={() => setActiveTab('complaints')}
        >
          All Complaints ({institution.complaints?.length || 0})
        </button>
        <button
          className={`tab-btn ${activeTab === 'overlaps' ? 'active' : ''}`}
          onClick={() => setActiveTab('overlaps')}
        >
          Flagged Overlaps ({institution.overlaps?.length || 0})
        </button>
        <button
          className={`tab-btn ${activeTab === 'compliance' ? 'active' : ''}`}
          onClick={() => setActiveTab('compliance')}
        >
          Institutional Compliance & Standing
        </button>
      </div>

      {/* Tab 1: Complaints */}
      {activeTab === 'complaints' && (
        <div className="gov-card">
          <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="filter-input"
              style={{ flex: '1 1 200px' }}
              placeholder="Filter complaints for this institution..."
              value={complaintSearch}
              onChange={e => setComplaintSearch(e.target.value)}
            />
            <select
              className="filter-select"
              value={complaintStatusFilter}
              onChange={e => setComplaintStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="NEW">New</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="UNDER_PROCESS">Under Process</option>
              <option value="ESCALATED">Escalated</option>
              <option value="DISPOSED">Disposed</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div className="table-responsive">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Category</th>
                  <th>Grievance Narrative</th>
                  <th>Bureau</th>
                  <th>Officer</th>
                  <th>Status</th>
                  <th>Filed Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map(c => (
                  <tr key={c.id}>
                    <td>
                      <Link to={`/complaints/${c.id}`} style={{ fontWeight: 700, color: 'var(--primary-navy)', textDecoration: 'none' }}>
                        {c.complaintNumber}
                      </Link>
                    </td>
                    <td><strong>{c.category}</strong></td>
                    <td style={{ maxWidth: '280px' }}>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.description}
                      </div>
                    </td>
                    <td><span className="badge badge-dept">{c.department}</span></td>
                    <td style={{ fontSize: '0.78rem' }}>{c.assignedOfficer?.name || 'Unassigned'}</td>
                    <td>{getStatusBadge(c.status)}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {new Date(c.filedDate).toISOString().split('T')[0]}
                    </td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/complaints/${c.id}`)}>
                        <MdArrowForward />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Overlaps */}
      {activeTab === 'overlaps' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {institution.overlaps?.length === 0 ? (
            <div className="gov-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No cross-bureau overlaps flagged for this institution.
            </div>
          ) : (
            institution.overlaps.map(ov => (
              <div key={ov.id} className="gov-card">
                <div className="gov-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="badge badge-critical">{ov.id}</span>
                    <span style={{ fontWeight: 700 }}>{ov.matchType}</span>
                    <span className="badge badge-dept">AI Overlap Score: {Math.round(ov.similarityScore * 100)}%</span>
                  </div>
                  <button className="btn btn-saffron btn-sm" onClick={() => navigate(`/overlaps/${ov.id}`)}>
                    <MdCompareArrows /> Open Side-by-Side Comparison
                  </button>
                </div>

                <div className="overlap-comparison-grid">
                  <div className="comparison-column bureau-a">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span className="badge badge-dept">{ov.departmentA} Bureau</span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{ov.complaintA?.complaintNumber}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{ov.complaintA?.category}</div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      "{ov.complaintA?.description}"
                    </p>
                  </div>

                  <div className="comparison-middle-connector">
                    <div className="connector-badge">⇄ Overlap Collision</div>
                  </div>

                  <div className="comparison-column bureau-b">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span className="badge badge-dept">{ov.departmentB} Bureau</span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{ov.complaintB?.complaintNumber}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{ov.complaintB?.category}</div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      "{ov.complaintB?.description}"
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Compliance Standing */}
      {activeTab === 'compliance' && (
        <div className="gov-card">
          <div className="gov-card-header">
            <h3 className="gov-card-title">
              <MdVerified style={{ color: '#16A34A' }} /> Statutory AICTE Accreditation & Inspection Standing
            </h3>
          </div>

          <div className="detail-grid" style={{ marginBottom: '20px' }}>
            <div className="detail-item">
              <span className="detail-label">AICTE Approval Status</span>
              <span className="detail-value" style={{ color: '#16A34A' }}>
                Valid for Academic Year {institution.approvalYear}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Mandatory Disclosures</span>
              <span className="detail-value">Uploaded & Verified</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Anti-Ragging Committee</span>
              <span className="detail-value">Constituted as per UGC/AICTE Norms</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Internal Complaints Committee (ICC)</span>
              <span className="detail-value">Active</span>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '16px', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
            <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '4px' }}>
              Inter-Bureau Regulatory Protocol
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              All complaints filed against {institution.name} across Regulation Bureau, PGRC, Approval, and Regional Offices are bound to Permanent ID {institution.aicteId}. When parallel complaints are detected, inter-bureau coordination directives prevent contradictory regulatory orders.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
