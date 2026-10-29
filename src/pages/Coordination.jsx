import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MdHandshake,
  MdAccountBalance,
  MdAccessTime,
  MdAdd,
  MdArrowForward,
  MdCheckCircle,
  MdFilterList,
  MdRefresh,
  MdDescription,
  MdPerson,
  MdSend
} from 'react-icons/md';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Coordination() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bureauFilter, setBureauFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionForm, setActionForm] = useState({
    actionType: 'DIRECTIVE_ISSUED',
    notes: '',
    nextStatusUpdate: ''
  });
  const [submittingAction, setSubmittingAction] = useState(false);

  useEffect(() => {
    loadCoordinationRecords();
  }, []);

  async function loadCoordinationRecords() {
    setLoading(true);
    try {
      const data = await api.get('/coordination');
      setRecords(data || []);
    } catch (err) {
      console.error('Failed to load coordination records:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredRecords = records.filter(r => {
    if (bureauFilter !== 'All' && r.leadBureau !== bureauFilter) return false;
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    return true;
  });

  function openActionModal(record) {
    setSelectedRecord(record);
    setActionForm({
      actionType: 'DIRECTIVE_ISSUED',
      notes: '',
      nextStatusUpdate: record.status
    });
    setActionModalOpen(true);
  }

  async function handleAddAction(e) {
    e.preventDefault();
    if (!actionForm.notes.trim()) return;

    setSubmittingAction(true);
    try {
      await api.post(`/coordination/${selectedRecord.id}/actions`, {
        actionType: actionForm.actionType,
        notes: actionForm.notes,
        nextStatusUpdate: actionForm.nextStatusUpdate
      });
      setActionModalOpen(false);
      loadCoordinationRecords();
    } catch (err) {
      alert(err.message || 'Failed to append coordination action');
    } finally {
      setSubmittingAction(false);
    }
  }

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('coordination.title')}</h1>
          <p className="page-subtitle">{t('coordination.subtitle')}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-outline" onClick={loadCoordinationRecords}>
            <MdRefresh /> Refresh
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar" style={{ marginBottom: '24px' }}>
        <div className="filter-item">
          <label className="filter-label">Lead Coordinating Bureau</label>
          <select
            className="filter-select"
            value={bureauFilter}
            onChange={(e) => setBureauFilter(e.target.value)}
          >
            <option value="All">All Bureaus</option>
            <option value="RB">Regulation Bureau (RB)</option>
            <option value="PGRC">Public Grievance Redressal Cell (PGRC)</option>
            <option value="Legal">Legal Cell</option>
            <option value="Approval">Approval Bureau</option>
            <option value="Regional Office">Regional Office</option>
          </select>
        </div>

        <div className="filter-item">
          <label className="filter-label">Coordination Status</label>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="JOINT_INQUIRY">Joint Inquiry</option>
            <option value="SHOW_CAUSE_ISSUED">Show Cause Issued</option>
            <option value="INSPECTION_ORDERED">Inspection Ordered</option>
            <option value="CONSOLIDATED">Consolidated File</option>
            <option value="RESOLVED">Resolved Harmoniously</option>
          </select>
        </div>

        <div style={{ marginLeft: 'auto', alignSelf: 'flex-end', fontSize: '13px', color: '#64748B' }}>
          Showing <strong>{filteredRecords.length}</strong> active coordination mandates
        </div>
      </div>

      {/* Records Grid */}
      {loading ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
          {t('common.loading')}
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center', color: '#64748B' }}>
          <MdHandshake style={{ fontSize: '48px', color: '#CBD5E1', marginBottom: '12px' }} />
          <h3>No cross-bureau coordination records found</h3>
          <p style={{ fontSize: '13px', marginTop: '6px' }}>
            Coordination records are initialized when cross-bureau overlaps are confirmed by authorized bureau officers.
          </p>
          <Link to="/overlaps" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>
            Review Flagged Overlaps
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '20px' }}>
          {filteredRecords.map(record => {
            const inst = record.overlap?.institution;
            const compA = record.overlap?.complaintA;
            const compB = record.overlap?.complaintB;
            const participating = Array.isArray(record.participatingBureaus)
              ? record.participatingBureaus
              : [];
            const officers = Array.isArray(record.assignedOfficers)
              ? record.assignedOfficers
              : [];

            return (
              <div key={record.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="card-header" style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                      <span className="badge badge-primary">Lead: {record.leadBureau} Bureau</span>
                      <span className={`badge ${record.status === 'RESOLVED' ? 'badge-success' : 'badge-warning'}`}>
                        {record.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1B365D', margin: 0 }}>
                      {inst?.name || 'Institution Record'}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                      AICTE Permanent ID: <strong>{inst?.aicteId}</strong> • {inst?.city}, {inst?.state}
                    </div>
                  </div>
                </div>

                <div className="card-body" style={{ flex: 1 }}>
                  {/* Linked Overlap Cases */}
                  <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '6px', marginBottom: '12px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Coordinated Grievance Filings
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', gap: '10px' }}>
                      <div>
                        <span className="badge badge-neutral" style={{ fontSize: '10px', marginRight: '4px' }}>{compA?.department}</span>
                        <Link to={`/complaints/${compA?.id}`} style={{ fontWeight: 600, color: '#1B365D' }}>{compA?.complaintNumber}</Link>
                        <div style={{ color: '#64748B', fontSize: '11px' }}>{compA?.category}</div>
                      </div>
                      <div style={{ color: '#94A3B8', alignSelf: 'center', fontWeight: 'bold' }}>⟷</div>
                      <div>
                        <span className="badge badge-neutral" style={{ fontSize: '10px', marginRight: '4px' }}>{compB?.department}</span>
                        <Link to={`/complaints/${compB?.id}`} style={{ fontWeight: 600, color: '#1B365D' }}>{compB?.complaintNumber}</Link>
                        <div style={{ color: '#64748B', fontSize: '11px' }}>{compB?.category}</div>
                      </div>
                    </div>
                  </div>

                  {/* Joint Directive Memo */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Harmonized Joint Directive
                    </div>
                    <p style={{ fontSize: '12px', color: '#334155', margin: 0, lineHeight: '1.5', background: '#FFFBEB', padding: '8px 10px', borderRadius: '4px', borderLeft: '3px solid #D9531E' }}>
                      {record.jointDirective}
                    </p>
                  </div>

                  {/* Participating Bureaus & Officers */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', marginBottom: '12px' }}>
                    <div>
                      <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Participating Bureaus:</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
                        {participating.map((b, i) => (
                          <span key={i} className="badge badge-neutral" style={{ fontSize: '10px' }}>{b}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Target Deadline:</span>
                      <span style={{ fontWeight: 600, color: '#DC2626' }}>
                        {record.deadline ? new Date(record.deadline).toLocaleDateString('en-IN') : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Action Log History count */}
                  <div style={{ fontSize: '11px', color: '#64748B', borderTop: '1px solid #F1F5F9', paddingTop: '8px' }}>
                    <strong>{record.actions?.length || 0}</strong> recorded coordination events • Last updated: {new Date(record.updatedAt).toLocaleDateString('en-IN')}
                  </div>
                </div>

                <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '10px 16px', borderTop: '1px solid #E2E8F0' }}>
                  <Link to={`/overlaps/${record.overlapId}`} className="btn btn-outline" style={{ fontSize: '12px', padding: '6px 10px' }}>
                    View Overlap Analysis
                  </Link>
                  <button
                    className="btn btn-primary"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                    onClick={() => openActionModal(record)}
                  >
                    <MdAdd /> Append Action
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal to Append Action / Directive */}
      {actionModalOpen && selectedRecord && (
        <div className="modal-backdrop">
          <div className="modal" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Record Inter-Bureau Action & Directive</h2>
              <button className="modal-close" onClick={() => setActionModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleAddAction}>
              <div className="modal-body">
                <div style={{ marginBottom: '12px', padding: '8px 12px', background: '#F1F5F9', borderRadius: '4px', fontSize: '12px' }}>
                  Coordinating: <strong>{selectedRecord.overlap?.institution?.name}</strong> • Lead: <strong>{selectedRecord.leadBureau} Bureau</strong>
                </div>

                <div className="form-group">
                  <label className="form-label">Action / Directive Type</label>
                  <select
                    className="form-select"
                    value={actionForm.actionType}
                    onChange={(e) => setActionForm({ ...actionForm, actionType: e.target.value })}
                  >
                    <option value="DIRECTIVE_ISSUED">Directive Issued by Lead Bureau</option>
                    <option value="STATUS_UPDATE">Progress Status Report</option>
                    <option value="JOINT_INSPECTION_ORDER">Order Joint Fact-Finding Committee</option>
                    <option value="CONSOLIDATED_HEARING">Schedule Harmonized Hearing</option>
                    <option value="SHOW_CAUSE_NOTICE">Issue Show-Cause Notice</option>
                    <option value="DISPOSAL_MEMO">Disposal & Closure Memo</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Update Coordination Lifecycle Status</label>
                  <select
                    className="form-select"
                    value={actionForm.nextStatusUpdate}
                    onChange={(e) => setActionForm({ ...actionForm, nextStatusUpdate: e.target.value })}
                  >
                    <option value="JOINT_INQUIRY">Joint Inquiry (Under Scrutiny)</option>
                    <option value="INSPECTION_ORDERED">Inspection Ordered</option>
                    <option value="SHOW_CAUSE_ISSUED">Show Cause Issued</option>
                    <option value="CONSOLIDATED">Consolidated Under Lead Bureau</option>
                    <option value="RESOLVED">Resolved / Redressed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Official Directive Remarks / Memo Details *</label>
                  <textarea
                    className="form-textarea"
                    rows="4"
                    required
                    placeholder="Enter official inter-bureau instructions, committee composition, inspection dates, or joint resolution terms..."
                    value={actionForm.notes}
                    onChange={(e) => setActionForm({ ...actionForm, notes: e.target.value })}
                  />
                </div>

                {/* Prior Actions timeline summary */}
                {selectedRecord.actions && selectedRecord.actions.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Prior Inter-Bureau Entries ({selectedRecord.actions.length})
                    </div>
                    <div style={{ maxHeight: '140px', overflowY: 'auto', border: '1px solid #E2E8F0', borderRadius: '4px', padding: '8px' }}>
                      {selectedRecord.actions.map((act, i) => (
                        <div key={i} style={{ fontSize: '11px', marginBottom: '6px', borderBottom: '1px solid #F1F5F9', paddingBottom: '4px' }}>
                          <span style={{ fontWeight: 600, color: '#1B365D' }}>{act.actionType}</span> by {act.officerName} ({act.bureau}) • {new Date(act.createdAt).toLocaleDateString('en-IN')}:
                          <div style={{ color: '#334155', marginTop: '2px' }}>{act.notes}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setActionModalOpen(false)}>
                  {t('common.cancel')}
                </button>
                <button type="submit" className="btn btn-primary" disabled={submittingAction}>
                  <MdSend /> {submittingAction ? 'Submitting...' : 'Record Directive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
