import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MdSearch,
  MdAccountBalance,
  MdWarning,
  MdArrowForward,
  MdClear
} from 'react-icons/md';
import { api } from '../services/api';

export default function Institutions() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  const [type, setType] = useState('All');
  const [status, setStatus] = useState('All');
  const [filterOverlapOnly, setFilterOverlapOnly] = useState(false);
  const [page, setPage] = useState(1);

  const [institutions, setInstitutions] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, pageSize: 12 });
  const [loading, setLoading] = useState(true);

  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      const data = await api.get('/institutions', {
        search,
        region,
        type,
        status,
        filterOverlapOnly,
        page,
        limit: 12
      });

      setInstitutions(data.institutions || []);
      setPagination(data.pagination || { total: 0, totalPages: 1, pageSize: 12 });
    } catch (err) {
      console.error('Failed to load institutions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, [search, region, type, status, filterOverlapOnly, page]);

  const resetFilters = () => {
    setSearch('');
    setRegion('All');
    setType('All');
    setStatus('All');
    setFilterOverlapOnly(false);
    setPage(1);
  };

  const regions = ['North', 'South', 'East', 'West', 'Central'];
  const types = ['Engineering', 'MBA', 'Pharmacy', 'Architecture', 'MCA'];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('institutions.title')}</h1>
          <p className="page-subtitle">{t('institutions.subtitle')}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <input
            type="text"
            className="filter-input"
            style={{ width: '100%', paddingLeft: '32px' }}
            placeholder="Search by college name, AICTE ID, city or state..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <MdSearch
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
        </div>

        <select
          className="filter-select"
          value={region}
          onChange={e => { setRegion(e.target.value); setPage(1); }}
        >
          <option value="All">All Regions</option>
          {regions.map(r => (
            <option key={r} value={r}>{r} Region</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={type}
          onChange={e => { setType(e.target.value); setPage(1); }}
        >
          <option value="All">All Disciplines</option>
          {types.map(typ => (
            <option key={typ} value={typ}>{typ}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
        </select>

        <button
          className={`btn btn-sm ${filterOverlapOnly ? 'btn-saffron' : 'btn-secondary'}`}
          onClick={() => { setFilterOverlapOnly(!filterOverlapOnly); setPage(1); }}
        >
          <MdWarning /> {filterOverlapOnly ? 'Overlaps Only' : 'Has Overlaps'}
        </button>

        {(search || region !== 'All' || type !== 'All' || status !== 'All' || filterOverlapOnly) && (
          <button className="btn btn-sm btn-secondary" onClick={resetFilters}>
            <MdClear /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="gov-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Showing {pagination.total > 0 ? (page - 1) * pagination.pageSize + 1 : 0}-
            {Math.min(pagination.total, page * pagination.pageSize)} of {pagination.total} institutions
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            {t('common.loading')}
          </div>
        ) : institutions.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No technical institutions found.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>{t('dashboard.institution')}</th>
                  <th>{t('institutions.aicteId')}</th>
                  <th>Location & Region</th>
                  <th>{t('institutions.type')}</th>
                  <th>{t('institutions.status')}</th>
                  <th>{t('institutions.totalGrievances')}</th>
                  <th>{t('institutions.activeCases')}</th>
                  <th>{t('institutions.overlaps')}</th>
                  <th>{t('dashboard.action')}</th>
                </tr>
              </thead>
              <tbody>
                {institutions.map(inst => (
                  <tr key={inst.id}>
                    <td>
                      <Link
                        to={`/institutions/${inst.id}`}
                        style={{ fontWeight: 700, color: 'var(--primary-navy)', textDecoration: 'none' }}
                      >
                        {inst.name}
                      </Link>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--primary-navy)', fontWeight: 600 }}>
                        {inst.aicteId}
                      </span>
                    </td>
                    <td>
                      <div>{inst.city}, {inst.state}</div>
                      <span className="badge badge-dept" style={{ fontSize: '0.66rem' }}>{inst.region}</span>
                    </td>
                    <td><span className="badge badge-dept">{inst.type}</span></td>
                    <td>
                      <span className={`badge ${inst.status === 'Active' ? 'badge-disposed' : 'badge-escalated'}`}>
                        {inst.status}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{inst.totalComplaints}</td>
                    <td>
                      {inst.activeComplaints > 0 ? (
                        <span style={{ color: 'var(--accent-saffron)', fontWeight: 700 }}>
                          {inst.activeComplaints} Active
                        </span>
                      ) : (
                        <span style={{ color: '#16A34A', fontSize: '0.78rem' }}>0 Active</span>
                      )}
                    </td>
                    <td>
                      {inst.activeOverlaps > 0 ? (
                        <span className="badge badge-critical">
                          ⚠️ {inst.activeOverlaps} Overlap{inst.activeOverlaps > 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>None</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/institutions/${inst.id}`)}
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
    </div>
  );
}
