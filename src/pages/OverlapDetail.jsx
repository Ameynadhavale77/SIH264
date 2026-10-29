import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MdArrowBack,
  MdWarning,
  MdCheckCircle,
  MdCompareArrows,
  MdSchool,
  MdSend,
  MdGroupWork,
  MdHistory,
  MdAutoAwesome,
  MdArrowForward
} from 'react-icons/md';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function OverlapDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  const [overlap, setOverlap] = useState(null);
  const [loading, setLoading] = useState(true);

  // Coordination form state
  const [leadBureau, setLeadBureau] = useState('RB');
  const [protocol, setProtocol] = useState('Joint Inspection');
  const [jointDirective, setJointDirective] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionToast, setActionToast] = useState('');

  const fetchOverlapDetail = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/overlaps/${id}`);
      setOverlap(data);
      if (data.coordinationRecord) {
        setLeadBureau(data.coordinationRecord.leadBureau);
      } else {
        setLeadBureau(data.departmentA || 'RB');
      }
    } catch (err) {
      console.error('Failed to load overlap comparison:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverlapDetail();
  }, [id]);

  const handleDispatchDirective = async (e) => {
    e.preventDefault();
    if (!jointDirective.trim()) return;

    setActionLoading(true);
    try {
      await api.post('/coordination', {
        overlapId: overlap.id,
        leadBureau,
        participatingBureaus: [overlap.departmentA, overlap.departmentB],
        assignedOfficers: [`${user?.name || 'Officer'} (${leadBureau})`],
        jointDirective,
        nextActions: [
          `Execute protocol: ${protocol}`,
          'Dispatch notice to college management',
          'Await verified response within 14 days'
        ],
        deadlineDays: 14
      });

      setActionToast('Joint inter-bureau directive dispatched and synchronized across departments!');
      setJointDirective('');
      fetchOverlapDetail();
      setTimeout(() => setActionToast(''), 4000);
    } catch (err) {
      alert('Failed to dispatch directive: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>{t('common.loading')}</div>;
  }

  if (!overlap) {
    return (
      <div className="gov-card" style={{ textAlign: 'center', padding: '40px' }}>
        <h3>Overlap collision record not found.</h3>
        <button className="btn btn-primary" onClick={() => navigate('/overlaps')} style={{ marginTop: '12px' }}>
          Back to Overlaps
        </button>
      </div>
    );
  }

  const scorePct = Math.round(overlap.similarityScore * 100);

  return (
    <div>
      <button
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '16px' }}
        onClick={() => navigate('/overlaps')}
      >
        <MdArrowBack /> Back to Overlaps List
      </button>

      {/* Header */}
      <div className="page-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span className="badge badge-dept">{overlap.id}</span>
            <h1 className="page-title" style={{ margin: 0 }}>{overlap.institution?.name}</h1>
            <span className="badge badge-dept">{overlap.matchType}</span>
            <span className={`badge ${overlap.status === 'CONFIRMED' ? 'badge-disposed' : 'badge-escalated'}`}>
              {t(`overlapStatus.${overlap.status}`) || overlap.status}
            </span>
          </div>
          <p className="page-subtitle" style={{ marginTop: '4px' }}>
            Permanent AICTE ID: <strong style={{ color: 'var(--primary-navy)', fontFamily: 'monospace' }}>{overlap.institution?.aicteId}</strong> •{' '}
            Cross-bureau inquiry across <strong>{overlap.departmentA} Bureau</strong> and <strong>{overlap.departmentB} Bureau</strong>
          </p>
        </div>

        <Link to={`/institutions/${overlap.institutionId}`} className="btn btn-secondary">
          <MdSchool /> View College Profile
        </Link>
      </div>

      {/* Alert Banner */}
      <div className="gov-alert-banner">
        <MdWarning className="gov-alert-icon" />
        <div className="gov-alert-content" style={{ flex: 1 }}>
          <h4>Inter-Bureau Collision Alert: Active Multi-Department Proceeding</h4>
          <p>
            Both <strong>{overlap.departmentA} Bureau</strong> and <strong>{overlap.departmentB} Bureau</strong> have active, concurrent cases regarding {overlap.institution?.name}.
            Inter-bureau coordination is required to prevent sending redundant inspection squads or issuing contradictory show-cause orders.
          </p>
        </div>
      </div>

      {/* AI Confidence Decomposition */}
      <div className="gov-card">
        <div className="gov-card-header">
          <h3 className="gov-card-title">
            <MdAutoAwesome /> AI Overlap Metric Decomposition & Evidence
          </h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Composite Confidence:</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: scorePct >= 80 ? '#DC2626' : 'var(--accent-saffron)' }}>
              {scorePct}%
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '12px', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Institution ID Identity</span>
              <strong style={{ color: '#16A34A' }}>100%</strong>
            </div>
            <div className="score-gauge-bar">
              <div className="score-gauge-fill" style={{ width: '100%', backgroundColor: '#16A34A' }} />
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Exact verified central registry ID
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '12px', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Grievance Category Nexus</span>
              <strong style={{ color: 'var(--primary-navy)' }}>{Math.round(overlap.categoryScore * 100)}%</strong>
            </div>
            <div className="score-gauge-bar">
              <div className="score-gauge-fill" style={{ width: `${Math.round(overlap.categoryScore * 100)}%`, backgroundColor: 'var(--primary-navy)' }} />
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Regulatory taxonomy alignment
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '12px', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>NLP Semantic Overlap</span>
              <strong style={{ color: 'var(--accent-saffron)' }}>{Math.round(overlap.semanticScore * 100)}%</strong>
            </div>
            <div className="score-gauge-bar">
              <div className="score-gauge-fill" style={{ width: `${Math.round(overlap.semanticScore * 100)}%`, backgroundColor: 'var(--accent-saffron)' }} />
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              TF-IDF cosine & n-gram vector match
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '12px', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Timeline Delta</span>
              <strong style={{ color: '#0284C7' }}>{overlap.timelineDeltaDays} Days Apart</strong>
            </div>
            <div className="score-gauge-bar">
              <div className="score-gauge-fill" style={{ width: `${Math.max(15, 100 - overlap.timelineDeltaDays * 2)}%`, backgroundColor: '#0284C7' }} />
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Active in identical session term
            </div>
          </div>
        </div>

        {/* Evidentiary Signals & Differences */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ backgroundColor: '#F0FDF4', padding: '12px 16px', borderRadius: '4px', border: '1px solid #BBF7D0' }}>
            <strong style={{ fontSize: '0.78rem', color: '#166534', display: 'block', marginBottom: '4px' }}>
              MATCHED EVIDENTIARY SIGNALS:
            </strong>
            <ul style={{ paddingLeft: '18px', fontSize: '0.78rem', color: '#15803D', margin: 0 }}>
              {Array.isArray(overlap.matchedSignals) && overlap.matchedSignals.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div style={{ backgroundColor: '#FEF2F2', padding: '12px 16px', borderRadius: '4px', border: '1px solid #FECACA' }}>
            <strong style={{ fontSize: '0.78rem', color: '#991B1B', display: 'block', marginBottom: '4px' }}>
              DIVERGENT CASE DIMENSIONS:
            </strong>
            <ul style={{ paddingLeft: '18px', fontSize: '0.78rem', color: '#B91C1C', margin: 0 }}>
              {Array.isArray(overlap.differences) && overlap.differences.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Side-by-Side Deep Case Files */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-navy)', marginBottom: '14px' }}>
          Side-by-Side Parallel Case Inspection
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {/* Bureau A Case */}
          <div className="comparison-column bureau-a">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <span className="badge badge-dept" style={{ fontSize: '0.8rem' }}>{overlap.departmentA} Bureau File</span>
                <span style={{ marginLeft: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {overlap.complaintA?.complaintNumber}
                </span>
              </div>
              <Link to={`/complaints/${overlap.complaintAId}`} className="btn btn-secondary btn-sm">
                Open File <MdArrowForward />
              </Link>
            </div>

            <div className="detail-grid" style={{ marginBottom: '12px' }}>
              <div className="detail-item"><span className="detail-label">Handling Officer</span><span className="detail-value">{overlap.complaintA?.assignedOfficer?.name || 'Unassigned'}</span></div>
              <div className="detail-item"><span className="detail-label">Category</span><span className="detail-value">{overlap.complaintA?.category}</span></div>
              <div className="detail-item"><span className="detail-label">Priority</span><span className="detail-value">{overlap.complaintA?.priority}</span></div>
              <div className="detail-item"><span className="detail-label">Status</span><span className="detail-value">{overlap.complaintA?.status}</span></div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <span className="detail-label" style={{ display: 'block', marginBottom: '4px' }}>FILED STATEMENT:</span>
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '12px', borderRadius: '4px', fontSize: '0.84rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                "{overlap.complaintA?.description}"
              </div>
            </div>

            <div>
              <span className="detail-label" style={{ display: 'block', marginBottom: '6px' }}>RECENT BUREAU ACTIONS:</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {overlap.complaintA?.actions?.slice(0, 3).map((a, i) => (
                  <div key={i} style={{ background: '#F8FAFC', padding: '8px 10px', borderRadius: '4px', fontSize: '0.78rem', borderLeft: '2px solid var(--primary-navy)' }}>
                    <strong>{a.actionType}</strong>: {a.remarks}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bureau B Case */}
          <div className="comparison-column bureau-b">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <span className="badge badge-dept" style={{ fontSize: '0.8rem', background: 'var(--accent-saffron-light)', color: 'var(--accent-saffron)' }}>
                  {overlap.departmentB} Bureau File
                </span>
                <span style={{ marginLeft: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {overlap.complaintB?.complaintNumber}
                </span>
              </div>
              <Link to={`/complaints/${overlap.complaintBId}`} className="btn btn-secondary btn-sm">
                Open File <MdArrowForward />
              </Link>
            </div>

            <div className="detail-grid" style={{ marginBottom: '12px' }}>
              <div className="detail-item"><span className="detail-label">Handling Officer</span><span className="detail-value">{overlap.complaintB?.assignedOfficer?.name || 'Unassigned'}</span></div>
              <div className="detail-item"><span className="detail-label">Category</span><span className="detail-value">{overlap.complaintB?.category}</span></div>
              <div className="detail-item"><span className="detail-label">Priority</span><span className="detail-value">{overlap.complaintB?.priority}</span></div>
              <div className="detail-item"><span className="detail-label">Status</span><span className="detail-value">{overlap.complaintB?.status}</span></div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <span className="detail-label" style={{ display: 'block', marginBottom: '4px' }}>FILED STATEMENT:</span>
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '12px', borderRadius: '4px', fontSize: '0.84rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                "{overlap.complaintB?.description}"
              </div>
            </div>

            <div>
              <span className="detail-label" style={{ display: 'block', marginBottom: '6px' }}>RECENT BUREAU ACTIONS:</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {overlap.complaintB?.actions?.slice(0, 3).map((a, i) => (
                  <div key={i} style={{ background: '#F8FAFC', padding: '8px 10px', borderRadius: '4px', fontSize: '0.78rem', borderLeft: '2px solid var(--accent-saffron)' }}>
                    <strong>{a.actionType}</strong>: {a.remarks}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Novel Cross-Bureau Case Intelligence Layer */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Coordination Action Form */}
        <div className="gov-card" style={{ marginBottom: 0 }}>
          <div className="gov-card-header">
            <h3 className="gov-card-title">
              <MdGroupWork /> {t('coordination.title')}
            </h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Designate a lead coordinating bureau, issue unified directives, or schedule a single harmonized inspection committee.
          </p>

          {actionToast && (
            <div style={{ backgroundColor: '#DCFCE7', border: '1px solid #BBF7D0', color: '#15803D', padding: '10px', borderRadius: '4px', marginBottom: '14px', fontSize: '0.82rem' }}>
              <MdCheckCircle /> {actionToast}
            </div>
          )}

          <form onSubmit={handleDispatchDirective}>
            <div style={{ marginBottom: '12px' }}>
              <label className="detail-label" style={{ display: 'block', marginBottom: '4px' }}>
                COORDINATION ACTION PROTOCOL
              </label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={protocol}
                onChange={e => setProtocol(e.target.value)}
              >
                <option value="Joint Inspection">{t('coordination.jointInspection')}</option>
                <option value="Lead Bureau Assignment">Designate Sole Lead Bureau</option>
                <option value="Consolidate Cases">{t('coordination.mergeCases')}</option>
                <option value="Harmonized Show Cause">{t('coordination.showCause')}</option>
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label className="detail-label" style={{ display: 'block', marginBottom: '4px' }}>
                {t('coordination.leadBureau')}
              </label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={leadBureau}
                onChange={e => setLeadBureau(e.target.value)}
              >
                <option value={overlap.departmentA}>{overlap.departmentA} Bureau (Primary Jurisdiction)</option>
                <option value={overlap.departmentB}>{overlap.departmentB} Bureau (Primary Jurisdiction)</option>
                <option value="Legal">Escalate to Legal Cell</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="detail-label" style={{ display: 'block', marginBottom: '4px' }}>
                {t('coordination.jointDirective')}
              </label>
              <textarea
                className="filter-input"
                style={{ width: '100%', minHeight: '90px', resize: 'vertical' }}
                placeholder="Enter coordinated directive terms, inspection instructions, or compliance notice to institution..."
                value={jointDirective}
                onChange={e => setJointDirective(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={actionLoading}
            >
              <MdSend /> {actionLoading ? 'Dispatching...' : t('coordination.dispatchDirective')}
            </button>
          </form>
        </div>

        {/* Shared Coordination Audit Trail */}
        <div className="gov-card" style={{ marginBottom: 0 }}>
          <div className="gov-card-header">
            <h3 className="gov-card-title">
              <MdHistory /> Inter-Bureau Shared Coordination Log
            </h3>
            <span className="badge badge-dept">
              {overlap.coordinationRecord?.actions?.length || 0} Synchronized Events
            </span>
          </div>

          {!overlap.coordinationRecord ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              No joint coordination directives recorded yet. Use the form on the left to initiate inter-bureau sync.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--primary-navy)' }}>
                    Active Coordination Directive
                  </span>
                  <span className="badge badge-disposed">{overlap.coordinationRecord.status}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '4px 0' }}>
                  "{overlap.coordinationRecord.jointDirective}"
                </p>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Lead Bureau: <strong>{overlap.coordinationRecord.leadBureau}</strong> • Participating: <strong>{Array.isArray(overlap.coordinationRecord.participatingBureaus) ? overlap.coordinationRecord.participatingBureaus.join(', ') : overlap.coordinationRecord.participatingBureaus}</strong>
                </div>
              </div>

              {overlap.coordinationRecord.actions?.map((act, i) => (
                <div key={act.id || i} style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: '4px', border: '1px solid var(--border-light)', borderLeft: '3px solid var(--accent-saffron)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <strong style={{ fontSize: '0.8rem', color: 'var(--primary-navy)' }}>{act.actionType}</strong>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {new Date(act.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{act.notes}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Officer: <strong>{act.officerName}</strong> ({act.bureau})
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
