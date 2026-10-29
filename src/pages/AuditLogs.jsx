import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MdHistory,
  MdFilterList,
  MdRefresh,
  MdSecurity,
  MdPerson,
  MdAccessTime,
  MdSearch
} from 'react-icons/md';
import { api } from '../services/api';

export default function AuditLogs() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('All');
  const [entityFilter, setEntityFilter] = useState('All');
  const [searchOfficer, setSearchOfficer] = useState('');

  useEffect(() => {
    loadAuditLogs();
  }, [actionFilter, entityFilter]);

  async function loadAuditLogs() {
    setLoading(true);
    try {
      const params = {};
      if (actionFilter !== 'All') params.action = actionFilter;
      if (entityFilter !== 'All') params.entityType = entityFilter;
      params.limit = 100;

      const data = await api.get('/audit-logs', params);
      setLogs(data || []);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredLogs = logs.filter(log => {
    if (searchOfficer && !log.userName.toLowerCase().includes(searchOfficer.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('audit.title')}</h1>
          <p className="page-subtitle">{t('audit.subtitle')}</p>
        </div>
        <button className="btn btn-outline" onClick={loadAuditLogs}>
          <MdRefresh /> Refresh Trail
        </button>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar" style={{ marginBottom: '20px' }}>
        <div className="filter-item">
          <label className="filter-label">Consequential Action</label>
          <select
            className="filter-select"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="All">All Actions</option>
            <option value="STATUS_TRANSITION">Status Transition</option>
            <option value="INTER_BUREAU_TRANSFER">Inter-Bureau Transfer</option>
            <option value="OVERLAP_DECISION">Overlap Decision (Confirm/Dismiss)</option>
            <option value="JOINT_DIRECTIVE">Joint Directive Issued</option>
            <option value="ADD_COORDINATION_ACTION">Coordination Action Event</option>
            <option value="CREATE_COMPLAINT">Grievance Registration</option>
          </select>
        </div>

        <div className="filter-item">
          <label className="filter-label">Entity Scope</label>
          <select
            className="filter-select"
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
          >
            <option value="All">All Entities</option>
            <option value="COMPLAINT">Complaint File</option>
            <option value="OVERLAP">Overlap Pair</option>
            <option value="COORDINATION">Coordination Record</option>
          </select>
        </div>

        <div className="filter-item" style={{ flex: 1 }}>
          <label className="filter-label">Search Responsible Officer</label>
          <input
            type="text"
            className="search-input"
            placeholder="Search by officer name..."
            value={searchOfficer}
            onChange={(e) => setSearchOfficer(e.target.value)}
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">Statutory Consequential Action Trail</h2>
          <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
            Showing {filteredLogs.length} events
          </span>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp (IST)</th>
                <th>Responsible Officer</th>
                <th>Consequential Action</th>
                <th>Entity Target</th>
                <th>Audit Details & Parameters</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>
                    {t('common.loading')}
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>
                    No audit log entries matching filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '12px', whiteSpace: 'nowrap', color: '#475569' }}>
                      {new Date(log.createdAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                          {log.userName.charAt(0)}
                        </span>
                        <span style={{ fontWeight: 600, fontSize: '12px' }}>{log.userName}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        log.action.includes('TRANSFER') ? 'badge-warning' :
                        log.action.includes('OVERLAP') ? 'badge-primary' :
                        log.action.includes('DIRECTIVE') ? 'badge-danger' : 'badge-info'
                      }`}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px' }}>
                      <span style={{ fontWeight: 600, color: '#1B365D' }}>{log.entityType}</span>
                      <div style={{ color: '#94A3B8', fontSize: '10px' }}>{log.entityId}</div>
                    </td>
                    <td style={{ fontSize: '11px', color: '#334155', maxWidth: '380px' }}>
                      {log.details ? (
                        <div style={{ background: '#F8FAFC', padding: '6px 8px', borderRadius: '4px', border: '1px solid #E2E8F0', fontFamily: 'monospace' }}>
                          {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}
                        </div>
                      ) : (
                        <span style={{ color: '#94A3B8' }}>No extra payload</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
