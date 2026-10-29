import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MdSearch,
  MdFileDownload,
  MdWarning,
  MdSchedule,
  MdArrowForward,
  MdClear,
  MdAdd,
  MdClose
} from 'react-icons/md';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Complaints() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  // Filters state
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [status, setStatus] = useState('All');
  const [category, setCategory] = useState('All');
  const [priority, setPriority] = useState('All');
  const [onlyOverdue, setOnlyOverdue] = useState(false);
  const [onlyOverlaps, setOnlyOverlaps] = useState(false);
  const [page, setPage] = useState(1);

  // Complaints state from DB
  const [complaints, setComplaints] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, pageSize: 12 });
  const [loading, setLoading] = useState(true);

  // New Complaint Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [institutionsList, setInstitutionsList] = useState([]);
  const [createForm, setCreateForm] = useState({
    institutionId: '',
    category: 'Fee Related',
    department: 'PGRC',
    complainantType: 'Student',
    priority: 'MEDIUM',
    deadlineDays: 30,
    description: ''
  });
  const [createError, setCreateError] = useState('');

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const data = await api.get('/complaints', {
        search,
        department,
        status,
        category,
        priority,
        onlyOverdue,
        onlyOverlaps,
        page,
        limit: 12
      });

      setComplaints(data.complaints || []);
      setPagination(data.pagination || { total: 0, totalPages: 1, pageSize: 12 });
    } catch (err) {
      console.error('Failed to load complaints from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [search, department, status, category, priority, onlyOverdue, onlyOverlaps, page]);

  useEffect(() => {
    async function loadInstitutions() {
      try {
        const data = await api.get('/institutions', { limit: 50 });
        setInstitutionsList(data.institutions || []);
      } catch (err) {
        // Fallback
      }
    }
    loadInstitutions();
  }, []);

  const handleExportCSV = async () => {
    try {
      await api.downloadCSV(
        '/complaints/export/csv',
        { department, status, category, priority, onlyOverdue },
        `AICTE_Complaints_Report_${new Date().toISOString().slice(0, 10)}.csv`
      );
    } catch (err) {
      alert('Failed to export CSV: ' + err.message);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateError('');

    if (!createForm.institutionId) {
      setCreateError('Please select a target technical institution.');
      return;
    }
    if (!createForm.description.trim()) {
      setCreateError('Grievance narrative is required.');
      return;
    }

    try {
      await api.post('/complaints', createForm);
      setShowCreateModal(false);
      setCreateForm({
        institutionId: '',
        category: 'Fee Related',
        department: 'PGRC',
        complainantType: 'Student',
        priority: 'MEDIUM',
        deadlineDays: 30,
        description: ''
      });
      fetchComplaints();
    } catch (err) {
      setCreateError(err.message || 'Failed to lodge complaint.');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setDepartment('All');
    setStatus('All');
    setCategory('All');
    setPriority('All');
    setOnlyOverdue(false);
    setOnlyOverlaps(false);
    setPage(1);
  };

  const departments = ['RB', 'PGRC', 'Legal', 'Approval', 'Regional Office'];
  const statuses = ['NEW', 'UNDER_REVIEW', 'UNDER_PROCESS', 'TRANSFERRED', 'ESCALATED', 'DISPOSED', 'CLOSED'];
  const categories = [
    'Fee Related', 'Faculty Shortage', 'Infrastructure', 'Admission Irregularity',
    'Affiliation Issue', 'Exam Malpractice', 'Ragging', 'Placement Fraud',
    'Certificate Delay', 'Harassment', 'Unapproved Courses', 'Other'
  ];
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

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
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('complaints.title')}</h1>
          <p className="page-subtitle">{t('complaints.subtitle')}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {hasRole('ADMIN', 'BUREAU_HEAD', 'OFFICER') && (
            <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
              <MdAdd /> {t('complaints.registerComplaint')}
            </button>
          )}
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <MdFileDownload /> {t('complaints.exportCSV')}
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <input
            type="text"
            className="filter-input"
            style={{ width: '100%', paddingLeft: '32px' }}
            placeholder={t('complaints.searchPlaceholder')}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <MdSearch
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
        </div>

        {/* Bureau */}
        <select
          className="filter-select"
          value={department}
          onChange={e => { setDepartment(e.target.value); setPage(1); }}
        >
          <option value="All">{t('complaints.allBureaus')}</option>
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Status */}
        <select
          className="filter-select"
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
        >
          <option value="All">{t('complaints.allStatuses')}</option>
          {statuses.map(s => (
            <option key={s} value={s}>{t(`status.${s}`)}</option>
          ))}
        </select>

        {/* Category */}
        <select
          className="filter-select"
          value={category}
          onChange={e => { setCategory(e.target.value); setPage(1); }}
        >
          <option value="All">{t('complaints.allCategories')}</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Priority */}
        <select
          className="filter-select"
          value={priority}
          onChange={e => { setPriority(e.target.value); setPage(1); }}
        >
          <option value="All">{t('complaints.allPriorities')}</option>
          {priorities.map(p => (
            <option key={p} value={p}>{t(`priority.${p}`)}</option>
          ))}
        </select>

        {/* Overdue Toggle */}
        <button
          className={`btn btn-sm ${onlyOverdue ? 'btn-danger' : 'btn-secondary'}`}
          onClick={() => { setOnlyOverdue(!onlyOverdue); setPage(1); }}
        >
          <MdSchedule /> {t('complaints.overdueOnly')}
        </button>

        {/* Overlaps Toggle */}
        <button
          className={`btn btn-sm ${onlyOverlaps ? 'btn-saffron' : 'btn-secondary'}`}
          onClick={() => { setOnlyOverlaps(!onlyOverlaps); setPage(1); }}
        >
          <MdWarning /> {t('complaints.overlapsOnly')}
        </button>

        {/* Clear */}
        {(search || department !== 'All' || status !== 'All' || category !== 'All' || priority !== 'All' || onlyOverdue || onlyOverlaps) && (
          <button className="btn btn-sm btn-secondary" onClick={resetFilters}>
            <MdClear /> {t('complaints.clearFilters')}
          </button>
        )}
      </div>

      {/* Complaints Table */}
      <div className="gov-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {t('complaints.showingResults', {
              from: pagination.total > 0 ? (page - 1) * pagination.pageSize + 1 : 0,
              to: Math.min(pagination.total, page * pagination.pageSize),
              total: pagination.total
            })}
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            {t('common.loading')}
          </div>
        ) : complaints.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No complaints found matching this criteria.
          </div>
        ) : (
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
                  <th>{t('complaints.deadline')}</th>
                  <th>{t('dashboard.action')}</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c.id}>
                    <td>
                      <Link
                        to={`/complaints/${c.id}`}
                        style={{ fontWeight: 700, color: 'var(--primary-navy)', textDecoration: 'none' }}
                      >
                        {c.complaintNumber}
                      </Link>
                      {c.hasOverlap && (
                        <div style={{ marginTop: '2px' }}>
                          <Link
                            to={c.overlapId ? `/overlaps/${c.overlapId}` : '/overlaps'}
                            className="badge badge-critical"
                            style={{ textDecoration: 'none', fontSize: '0.64rem' }}
                          >
                            ⚠️ Overlap
                          </Link>
                        </div>
                      )}
                    </td>
                    <td>
                      <Link
                        to={`/institutions/${c.institutionId}`}
                        style={{ fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}
                      >
                        {c.institution?.name}
                      </Link>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {c.institution?.aicteId} • {c.assignedOfficer?.name || 'Unassigned'}
                      </div>
                    </td>
                    <td style={{ maxWidth: '240px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{c.category}</div>
                      <div
                        style={{
                          fontSize: '0.74rem',
                          color: 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                        title={c.description}
                      >
                        {c.description}
                      </div>
                    </td>
                    <td><span className="badge badge-dept">{c.department}</span></td>
                    <td>{getPriorityBadge(c.priority)}</td>
                    <td>{getStatusBadge(c.status)}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {new Date(c.filedDate).toISOString().split('T')[0]}
                    </td>
                    <td>
                      {c.isOverdue ? (
                        <span className="badge badge-critical">Overdue</span>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {new Date(c.deadline).toISOString().split('T')[0]}
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/complaints/${c.id}`)}
                      >
                        <MdArrowForward />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination-bar">
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Page {page} of {pagination.totalPages}
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                className="pagination-btn"
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    className={`pagination-btn ${page === p ? 'active' : ''}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                className="pagination-btn"
                disabled={page === pagination.totalPages}
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Register Complaint Modal */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 37, 69, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="gov-card"
            style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="gov-card-header">
              <h3 className="gov-card-title">{t('complaints.registerComplaint')}</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowCreateModal(false)}>
                <MdClose />
              </button>
            </div>

            {createError && (
              <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '10px', borderRadius: '4px', marginBottom: '14px', fontSize: '0.82rem' }}>
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label className="detail-label" style={{ display: 'block', marginBottom: '4px' }}>
                  TARGET INSTITUTION
                </label>
                <select
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={createForm.institutionId}
                  onChange={e => setCreateForm({ ...createForm, institutionId: e.target.value })}
                  required
                >
                  <option value="">Select AICTE Accredited College</option>
                  {institutionsList.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.name} ({i.aicteId} • {i.city}, {i.state})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label className="detail-label" style={{ display: 'block', marginBottom: '4px' }}>GRIEVANCE CATEGORY</label>
                  <select
                    className="filter-select"
                    style={{ width: '100%' }}
                    value={createForm.category}
                    onChange={e => setCreateForm({ ...createForm, category: e.target.value })}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="detail-label" style={{ display: 'block', marginBottom: '4px' }}>HANDLING BUREAU</label>
                  <select
                    className="filter-select"
                    style={{ width: '100%' }}
                    value={createForm.department}
                    onChange={e => setCreateForm({ ...createForm, department: e.target.value })}
                  >
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label className="detail-label" style={{ display: 'block', marginBottom: '4px' }}>COMPLAINANT TYPE</label>
                  <select
                    className="filter-select"
                    style={{ width: '100%' }}
                    value={createForm.complainantType}
                    onChange={e => setCreateForm({ ...createForm, complainantType: e.target.value })}
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Parent">Parent</option>
                    <option value="Staff">Staff</option>
                    <option value="Anonymous">Anonymous</option>
                  </select>
                </div>

                <div>
                  <label className="detail-label" style={{ display: 'block', marginBottom: '4px' }}>PRIORITY</label>
                  <select
                    className="filter-select"
                    style={{ width: '100%' }}
                    value={createForm.priority}
                    onChange={e => setCreateForm({ ...createForm, priority: e.target.value })}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label className="detail-label" style={{ display: 'block', marginBottom: '4px' }}>
                  GRIEVANCE NARRATIVE
                </label>
                <textarea
                  className="filter-input"
                  style={{ width: '100%', minHeight: '100px', resize: 'vertical' }}
                  placeholder="Detail the complaint allegations, incident dates, evidence, and affected student/faculty count..."
                  value={createForm.description}
                  onChange={e => setCreateForm({ ...createForm, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit to Central Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
