import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MdArrowBack,
  MdWarning,
  MdCompareArrows,
  MdHistory,
  MdSend,
  MdCheckCircle,
  MdSwapHoriz,
  MdEditNote,
  MdSchool
} from 'react-icons/md';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, hasRole } = useAuth();

  const [complaint, setComplaint] = useState(null);
  const [relatedOverlap, setRelatedOverlap] = useState(null);
  const [loading, setLoading] = useState(true);

  // Action form state
  const [actionType, setActionType] = useState('REMARK');
  const [remarks, setRemarks] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('');
  const [toDepartment, setToDepartment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionToast, setActionToast] = useState('');

  const fetchComplaintDetail = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/complaints/${id}`);
      setComplaint(data.complaint);
      setRelatedOverlap(data.relatedOverlap);
      setStatusUpdate(data.complaint?.status || 'NEW');
    } catch (err) {
      console.error('Failed to load complaint details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaintDetail();
  }, [id]);

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    if (!remarks.trim()) return;

    setActionLoading(true);
    try {
      if (actionType === 'TRANSFER') {
        if (!toDepartment) {
          alert('Please select a target bureau for transfer.');
          setActionLoading(false);
          return;
        }
        await api.post(`/complaints/${complaint.id}/transfer`, {
          toDepartment,
          remarks
        });
        setActionToast('Inter-bureau transfer successfully executed!');
      } else {
        await api.post(`/complaints/${complaint.id}/actions`, {
          actionType,
          remarks,
          statusUpdate: statusUpdate !== complaint.status ? statusUpdate : null
        });
        setActionToast('Official action logged and case timeline updated.');
      }

      setRemarks('');
      fetchComplaintDetail();
      setTimeout(() => setActionToast(''), 4000);
    } catch (err) {
      alert('Action failed: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const departments = ['RB', 'PGRC', 'Legal', 'Approval', 'Regional Office'];
  const statuses = ['NEW', 'UNDER_REVIEW', 'UNDER_PROCESS', 'TRANSFERRED', 'ESCALATED', 'DISPOSED', 'CLOSED'];

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>{t('common.loading')}</div>;
  }

  if (!complaint) {
    return (
      <div className="gov-card" style={{ textAlign: 'center', padding: '40px' }}>
        <h3>Complaint record not found.</h3>
        <button className="btn btn-primary" onClick={() => navigate('/complaints')} style={{ marginTop: '12px' }}>
          Back to Complaints
        </button>
      </div>
    );
  }

  const getStatusBadge = (s) => {
    const cls = (s || 'NEW').toLowerCase();
    return <span className={`badge badge-${cls}`}>{t(`status.${s}`) || s}</span>;
  };

  const getPriorityBadge = (p) => {
    const cls = (p || 'MEDIUM').toLowerCase();
    return <span className={`badge badge-${cls}`}>{t(`priority.${p}`) || p}</span>;
  };

  return (
    <div>
      {/* Back button */}
      <button
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '16px' }}
        onClick={() => navigate('/complaints')}
      >
        <MdArrowBack /> {t('detail.backToList')}
      </button>

      {/* Header */}
      <div className="page-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h1 className="page-title" style={{ margin: 0 }}>{complaint.complaintNumber}</h1>
            <span className="badge badge-dept">{complaint.department} Bureau</span>
            {getStatusBadge(complaint.status)}
            {getPriorityBadge(complaint.priority)}
            {complaint.isOverdue && <span className="badge badge-critical">⚠️ Overdue SLA</span>}
          </div>
          <p className="page-subtitle" style={{ marginTop: '4px' }}>
            Permanent AICTE ID: <strong>{complaint.institution?.aicteId}</strong> • Lodged on {new Date(complaint.filedDate).toISOString().split('T')[0]}
          </p>
        </div>

        {relatedOverlap && (
          <button
            className="btn btn-saffron"
            onClick={() => navigate(`/overlaps/${relatedOverlap.id}`)}
          >
            <MdCompareArrows /> View Overlapping Case ({Math.round(relatedOverlap.similarityScore * 100)}% Match)
          </button>
        )}
      </div>

      {/* Active Overlap Alert Banner if linked */}
      {relatedOverlap && (
        <div className="gov-alert-banner" style={{ cursor: 'pointer' }} onClick={() => navigate(`/overlaps/${relatedOverlap.id}`)}>
          <MdWarning className="gov-alert-icon" />
          <div className="gov-alert-content" style={{ flex: 1 }}>
            <h4>Active Cross-Bureau Overlap Flagged ({Math.round(relatedOverlap.similarityScore * 100)}% Match)</h4>
            <p>
              {t('detail.overlapNotice', {
                dept: relatedOverlap.departmentA === complaint.department ? relatedOverlap.departmentB : relatedOverlap.departmentA
              })}
            </p>
          </div>
          <button className="btn btn-danger btn-sm">Inspect Inter-Bureau Comparison</button>
        </div>
      )}

      {/* Two-Column Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Case Particulars */}
        <div className="gov-card" style={{ marginBottom: 0 }}>
          <div className="gov-card-header">
            <h3 className="gov-card-title">{t('detail.caseParticulars')}</h3>
          </div>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Grievance Category</span>
              <span className="detail-value">{complaint.category}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Complainant Type</span>
              <span className="detail-value">{complaint.complainantType}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Source Channel</span>
              <span className="detail-value">{complaint.source}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Assigned Scrutiny Officer</span>
              <span className="detail-value">{complaint.assignedOfficer?.name || 'Unassigned'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Citizen Charter Target SLA</span>
              <span className="detail-value" style={{ color: complaint.isOverdue ? '#DC2626' : undefined }}>
                {new Date(complaint.deadline).toISOString().split('T')[0]} {complaint.isOverdue && '(Breached)'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Resolution Status</span>
              <span className="detail-value">{t(`status.${complaint.status}`)}</span>
            </div>
          </div>
        </div>

        {/* Institution Details */}
        <div className="gov-card" style={{ marginBottom: 0 }}>
          <div className="gov-card-header">
            <h3 className="gov-card-title">{t('detail.institutionDetails')}</h3>
            <Link to={`/institutions/${complaint.institutionId}`} className="btn btn-secondary btn-sm">
              <MdSchool /> {t('detail.viewInstitution')}
            </Link>
          </div>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">College Name</span>
              <span className="detail-value">{complaint.institution?.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Permanent AICTE ID</span>
              <span className="detail-value" style={{ color: 'var(--primary-navy)', fontFamily: 'monospace' }}>
                {complaint.institution?.aicteId}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Region</span>
              <span className="detail-value">{complaint.institution?.region} Region</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">City & State</span>
              <span className="detail-value">{complaint.institution?.city}, {complaint.institution?.state}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Discipline / Branch</span>
              <span className="detail-value">{complaint.institution?.type}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Accreditation Standing</span>
              <span className="detail-value">{complaint.institution?.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="gov-card">
        <div className="gov-card-header">
          <h3 className="gov-card-title">{t('detail.narrative')}</h3>
        </div>
        <div
          style={{
            backgroundColor: 'var(--bg-subtle)',
            padding: '16px 20px',
            borderRadius: '4px',
            borderLeft: '4px solid var(--primary-navy)',
            fontSize: '0.92rem',
            lineHeight: 1.6,
            color: 'var(--text-primary)'
          }}
        >
          "{complaint.description}"
        </div>
      </div>

      {/* Interactive Action Logger & Action Timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Interactive Consequential Action Form */}
        <div className="gov-card" style={{ marginBottom: 0 }}>
          <div className="gov-card-header">
            <h3 className="gov-card-title">
              <MdEditNote style={{ fontSize: '1.2rem' }} /> {t('detail.logAction')}
            </h3>
          </div>

          {actionToast && (
            <div style={{ backgroundColor: '#DCFCE7', border: '1px solid #BBF7D0', color: '#15803D', padding: '10px', borderRadius: '4px', marginBottom: '14px', fontSize: '0.82rem' }}>
              <MdCheckCircle /> {actionToast}
            </div>
          )}

          <form onSubmit={handleActionSubmit}>
            <div style={{ marginBottom: '12px' }}>
              <label className="detail-label" style={{ display: 'block', marginBottom: '4px' }}>
                {t('detail.actionType')}
              </label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={actionType}
                onChange={e => setActionType(e.target.value)}
              >
                <option value="REMARK">Official Scrutiny Remark</option>
                <option value="STATUS_CHANGE">Transition Lifecycle Status</option>
                {hasRole('ADMIN', 'BUREAU_HEAD') && (
                  <option value="TRANSFER">Inter-Bureau Transfer to Another Cell</option>
                )}
                <option value="ESCALATION">Escalate to Member Secretary / Bureau Head</option>
                <option value="RESOLUTION">Record Resolution & Compliance</option>
              </select>
            </div>

            {actionType === 'TRANSFER' && (
              <div style={{ marginBottom: '12px' }}>
                <label className="detail-label" style={{ display: 'block', marginBottom: '4px' }}>
                  {t('detail.targetBureau')}
                </label>
                <select
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={toDepartment}
                  onChange={e => setToDepartment(e.target.value)}
                  required
                >
                  <option value="">Select Target Bureau</option>
                  {departments.filter(d => d !== complaint.department).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            )}

            {actionType === 'STATUS_CHANGE' && (
              <div style={{ marginBottom: '12px' }}>
                <label className="detail-label" style={{ display: 'block', marginBottom: '4px' }}>
                  NEW STATUS TARGET
                </label>
                <select
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={statusUpdate}
                  onChange={e => setStatusUpdate(e.target.value)}
                >
                  {statuses.map(s => (
                    <option key={s} value={s}>{t(`status.${s}`)}</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label className="detail-label" style={{ display: 'block', marginBottom: '4px' }}>
                {t('detail.remarks')}
              </label>
              <textarea
                className="filter-input"
                style={{ width: '100%', minHeight: '90px', resize: 'vertical' }}
                placeholder="Enter regulatory directive, college submission review, or transfer rationale..."
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={actionLoading}
            >
              <MdSend /> {actionLoading ? 'Recording...' : t('detail.submitAction')}
            </button>
          </form>
        </div>

        {/* Action Audit Timeline */}
        <div className="gov-card" style={{ marginBottom: 0 }}>
          <div className="gov-card-header">
            <h3 className="gov-card-title">
              <MdHistory style={{ fontSize: '1.2rem' }} /> {t('detail.actionAuditTrail')}
            </h3>
            <span className="badge badge-dept">{complaint.actions?.length || 0} Entries</span>
          </div>

          <div className="timeline" style={{ marginTop: '12px' }}>
            {complaint.actions?.map((act, i) => (
              <div key={act.id || i} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-header">
                    <span className="timeline-title">
                      {act.actionType}
                      {act.toDepartment && ` → Transferred to ${act.toDepartment}`}
                    </span>
                    <span className="timeline-date">
                      {new Date(act.createdAt).toLocaleDateString()} {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="timeline-body">{act.remarks}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Officer: <strong>{act.actionByName}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
