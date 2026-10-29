import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MdBarChart,
  MdDownload,
  MdAccountBalance,
  MdAccessTime,
  MdCheckCircle,
  MdWarning,
  MdPrint,
  MdRefresh
} from 'react-icons/md';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { api } from '../services/api';

export default function Reports() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('bureau');
  const [loading, setLoading] = useState(true);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [bureauSummary, setBureauSummary] = useState([]);
  const [regionSummary, setRegionSummary] = useState([]);
  const [ageingData, setAgeingData] = useState(null);
  const [monthlyTrend, setMonthlyTrend] = useState([]);

  useEffect(() => {
    loadReportsData();
  }, []);

  async function loadReportsData() {
    setLoading(true);
    try {
      const [dash, bureau, region, ageing, trend] = await Promise.all([
        api.get('/reports/dashboard-summary'),
        api.get('/reports/bureau-summary'),
        api.get('/reports/region-summary'),
        api.get('/reports/ageing-analysis'),
        api.get('/reports/monthly-trend')
      ]);

      setDashboardSummary(dash);
      setBureauSummary(bureau || []);
      setRegionSummary(region || []);
      setAgeingData(ageing || null);
      setMonthlyTrend(trend || []);
    } catch (err) {
      console.error('Failed to load reports data:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleExportCSV() {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (activeTab === 'bureau') {
      csvContent += 'Bureau,Total Cases,Pending Cases,Disposed Cases,Overdue Cases,Disposal Rate (%)\r\n';
      bureauSummary.forEach(row => {
        csvContent += `"${row.bureau}",${row.totalCases},${row.pendingCases},${row.disposedCases},${row.overdueCases},${row.disposalRate}%\r\n`;
      });
    } else if (activeTab === 'region') {
      csvContent += 'Region,Total Grievances,Resolved Grievances,Overdue Cases,Resolution (%)\r\n';
      regionSummary.forEach(row => {
        csvContent += `"${row.region}",${row.totalGrievances},${row.resolvedGrievances},${row.overdueCases},${row.resolutionPercentage}%\r\n`;
      });
    } else if (activeTab === 'ageing') {
      csvContent += 'Ageing Bracket,Pending Cases,Share (%)\r\n';
      ageingData?.buckets?.forEach(row => {
        csvContent += `"${row.bucket}",${row.count},${row.share}%\r\n`;
      });
    } else {
      csvContent += 'Month,Filed Complaints,Resolved Complaints\r\n';
      monthlyTrend.forEach(row => {
        csvContent += `"${row.month}",${row.filed},${row.resolved}\r\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aicte_statutory_report_${activeTab}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('reports.title')}</h1>
          <p className="page-subtitle">{t('reports.subtitle')}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-outline" onClick={loadReportsData}>
            <MdRefresh /> Refresh
          </button>
          <button className="btn btn-primary" onClick={handleExportCSV}>
            <MdDownload /> {t('reports.exportReport')}
          </button>
          <button className="btn btn-outline" onClick={() => window.print()}>
            <MdPrint /> Print
          </button>
        </div>
      </div>

      {/* Statutory High-Level KPI Summary */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon"><MdAccountBalance /></div>
          <div className="stat-value">{dashboardSummary?.totalComplaints || 0}</div>
          <div className="stat-label">Total Grievances Ingested</div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>Across 5 AICTE Bureaus</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#E0F2FE', color: '#0369A1' }}><MdCheckCircle /></div>
          <div className="stat-value" style={{ color: '#0369A1' }}>{dashboardSummary?.disposalRate || 0}%</div>
          <div className="stat-label">Statutory Disposal Rate</div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>{dashboardSummary?.disposedComplaints || 0} Resolved Files</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#FEF3C7', color: '#B45309' }}><MdAccessTime /></div>
          <div className="stat-value" style={{ color: '#B45309' }}>{dashboardSummary?.pendingComplaints || 0}</div>
          <div className="stat-label">Active Scrutiny Cases</div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>Under Bureau Process</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#FEE2E2', color: '#B91C1C' }}><MdWarning /></div>
          <div className="stat-value" style={{ color: '#B91C1C' }}>{dashboardSummary?.overdueComplaints || 0}</div>
          <div className="stat-label">Overdue SLA Grievances</div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>Auto-Escalated to HQ</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: '20px' }}>
        <button
          className={`tab-btn ${activeTab === 'bureau' ? 'active' : ''}`}
          onClick={() => setActiveTab('bureau')}
        >
          {t('reports.bureauReport')}
        </button>
        <button
          className={`tab-btn ${activeTab === 'region' ? 'active' : ''}`}
          onClick={() => setActiveTab('region')}
        >
          {t('reports.regionReport')}
        </button>
        <button
          className={`tab-btn ${activeTab === 'ageing' ? 'active' : ''}`}
          onClick={() => setActiveTab('ageing')}
        >
          {t('reports.ageingReport')}
        </button>
        <button
          className={`tab-btn ${activeTab === 'trend' ? 'active' : ''}`}
          onClick={() => setActiveTab('trend')}
        >
          {t('reports.trendReport')}
        </button>
      </div>

      {/* Tab 1: Bureau Performance */}
      {activeTab === 'bureau' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Bureau Grievance Load & Clearance Efficiency</h2>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Bureau / Cell</th>
                    <th>Total Received</th>
                    <th>Under Process</th>
                    <th>Disposed / Closed</th>
                    <th>Overdue SLA</th>
                    <th>Disposal Efficiency</th>
                  </tr>
                </thead>
                <tbody>
                  {bureauSummary.map(row => (
                    <tr key={row.bureau}>
                      <td style={{ fontWeight: 600 }}>{row.bureau} Bureau</td>
                      <td>{row.totalCases}</td>
                      <td><span className="badge badge-info">{row.pendingCases}</span></td>
                      <td><span className="badge badge-success">{row.disposedCases}</span></td>
                      <td>
                        {row.overdueCases > 0 ? (
                          <span className="badge badge-danger">{row.overdueCases} Overdue</span>
                        ) : (
                          <span className="badge badge-neutral">0</span>
                        )}
                      </td>
                      <td style={{ minWidth: '160px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ flex: 1, height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${row.disposalRate}%`,
                                height: '100%',
                                background: row.disposalRate >= 60 ? '#10B981' : (row.disposalRate >= 35 ? '#F59E0B' : '#EF4444')
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 600, minWidth: '35px' }}>{row.disposalRate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Comparative Workload vs Disposal by Department</h2>
            </div>
            <div style={{ height: '320px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bureauSummary} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="bureau" tick={{ fill: '#475569', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalCases" name="Total Ingested" fill="#1B365D" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="disposedCases" name="Disposed" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="overdueCases" name="Overdue SLA" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Regional Distribution */}
      {activeTab === 'region' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Regional Directorate Grievance Statistics</h2>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Region</th>
                    <th>Total Registered</th>
                    <th>Resolved / Disposed</th>
                    <th>Overdue Backlog</th>
                    <th>Resolution Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {regionSummary.map(row => (
                    <tr key={row.region}>
                      <td style={{ fontWeight: 600 }}>{row.region}</td>
                      <td>{row.totalGrievances}</td>
                      <td><span className="badge badge-success">{row.resolvedGrievances}</span></td>
                      <td>
                        {row.overdueCases > 0 ? (
                          <span className="badge badge-danger">{row.overdueCases} Critical</span>
                        ) : (
                          <span className="badge badge-neutral">0</span>
                        )}
                      </td>
                      <td style={{ minWidth: '160px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ flex: 1, height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${row.resolutionPercentage}%`,
                                height: '100%',
                                background: '#1B365D'
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 600 }}>{row.resolutionPercentage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Regional Grievance Distribution</h2>
            </div>
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionSummary} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="region" tick={{ fill: '#475569', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalGrievances" name="Total Filed" fill="#0B2545" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolvedGrievances" name="Resolved" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: SLA Ageing Analysis */}
      {activeTab === 'ageing' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Statutory SLA Pending Case Ageing Analysis</h2>
              <span className="badge badge-warning">Total Pending: {ageingData?.totalPending || 0} Cases</span>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Ageing Bracket</th>
                    <th>Pending Cases</th>
                    <th>Share of Backlog</th>
                    <th>Regulatory Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ageingData?.buckets?.map(b => (
                    <tr key={b.bucket}>
                      <td style={{ fontWeight: 600 }}>{b.bucket}</td>
                      <td><span style={{ fontSize: '15px', fontWeight: 700 }}>{b.count}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '100px', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${b.share}%`,
                                height: '100%',
                                background: b.bucket.includes('> 60') ? '#DC2626' : (b.bucket.includes('31 - 60') ? '#F59E0B' : '#3B82F6')
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 600 }}>{b.share}%</span>
                        </div>
                      </td>
                      <td>
                        {b.bucket.includes('> 60') ? (
                          <span className="badge badge-danger">Statutory Breach — Auto-Escalated</span>
                        ) : b.bucket.includes('31 - 60') ? (
                          <span className="badge badge-warning">Action Imminent</span>
                        ) : (
                          <span className="badge badge-neutral">Within Permissible SLA</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Monthly Trend */}
      {activeTab === 'trend' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Quarterly Grievance Intake vs Disposal Trajectory</h2>
          </div>
          <div style={{ height: '360px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 12 }} />
                <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="filed" name="Complaints Ingested" stroke="#1B365D" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="resolved" name="Complaints Disposed" stroke="#10B981" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
