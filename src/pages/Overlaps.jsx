import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MdCompareArrows,
  MdWarning,
  MdCheckCircle,
  MdClose,
  MdSearch,
  MdAutoAwesome,
  MdLightbulb,
  MdPlayArrow,
  MdAssessment,
  MdArrowForward,
  MdClear
} from 'react-icons/md';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Overlaps() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  const [overlaps, setOverlaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [matchTypeFilter, setMatchTypeFilter] = useState('All');
  const [minScore, setMinScore] = useState('0');
  const [search, setSearch] = useState('');

  // Modals
  const [showHowModal, setShowHowModal] = useState(false);
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [evalResults, setEvalResults] = useState(null);
  const [scanMessage, setScanMessage] = useState('');
  const [scanning, setScanning] = useState(false);

  const fetchOverlaps = async () => {
    setLoading(true);
    try {
      const data = await api.get('/overlaps', {
        status: statusFilter,
        matchType: matchTypeFilter,
        minScore,
        search
      });
      setOverlaps(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load overlaps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverlaps();
  }, [statusFilter, matchTypeFilter, minScore, search]);

  const handleScanDatabase = async () => {
    setScanning(true);
    setScanMessage('');
    try {
      const res = await api.post('/overlaps/scan', { threshold: 0.55 });
      setScanMessage(res.message);
      fetchOverlaps();
    } catch (err) {
      setScanMessage('Scan error: ' + err.message);
    } finally {
      setScanning(false);
    }
  };

  const handleEvaluateBenchmark = async () => {
    try {
      const res = await api.get('/overlaps/benchmark/evaluate', { threshold: 0.65 });
      setEvalResults(res);
      setShowEvalModal(true);
    } catch (err) {
      alert('Failed to evaluate benchmark: ' + err.message);
    }
  };

  const handleReviewAction = async (id, decision) => {
    try {
      await api.post(`/overlaps/${id}/review`, { decision, remarks: `Reviewed by officer: marked as ${decision}` });
      fetchOverlaps();
    } catch (err) {
      alert('Review failed: ' + err.message);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 0.85) return '#DC2626';
    if (score >= 0.70) return '#D9531E';
    return '#0284C7';
  };

  const getStatusBadge = (s) => {
    const cls = (s || 'FLAGGED').toLowerCase();
    return <span className={`badge badge-${cls}`}>{t(`overlapStatus.${s}`) || s}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">{t('overlaps.title')}</h1>
            <span className="badge badge-dept" style={{ background: '#E0F2FE', color: '#0369A1' }}>
              <MdAutoAwesome /> Explainable Multi-Signal Engine
            </span>
          </div>
          <p className="page-subtitle">{t('overlaps.subtitle')}</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowHowModal(true)}>
            <MdLightbulb /> {t('overlaps.howItWorks')}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleEvaluateBenchmark}>
            <MdAssessment /> {t('overlaps.evaluateBenchmark')}
          </button>
          {hasRole('ADMIN', 'BUREAU_HEAD') && (
            <button className="btn btn-primary btn-sm" onClick={handleScanDatabase} disabled={scanning}>
              <MdPlayArrow /> {scanning ? 'Scanning Complaints...' : t('overlaps.scanDatabase')}
            </button>
          )}
        </div>
      </div>

      {scanMessage && (
        <div style={{ backgroundColor: '#DCFCE7', border: '1px solid #BBF7D0', color: '#15803D', padding: '12px', borderRadius: '4px', marginBottom: '16px', fontSize: '0.84rem' }}>
          <MdCheckCircle /> {scanMessage}
        </div>
      )}

      {/* Filter Bar */}
      <div className="filter-bar">
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <input
            type="text"
            className="filter-input"
            style={{ width: '100%', paddingLeft: '32px' }}
            placeholder="Search by college name, overlap ID, or keyword..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <MdSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="FLAGGED">Flagged (Action Needed)</option>
          <option value="UNDER_REVIEW">Under Joint Review</option>
          <option value="CONFIRMED">Confirmed Overlap</option>
          <option value="DISMISSED">Dismissed (Distinct)</option>
        </select>

        <select
          className="filter-select"
          value={matchTypeFilter}
          onChange={e => setMatchTypeFilter(e.target.value)}
        >
          <option value="All">All Match Classifications</option>
          <option value="SAME_INSTITUTION">Same Institution Permanent ID</option>
          <option value="CATEGORY_MATCH">Grievance Category Nexus</option>
          <option value="SEMANTIC_SIMILARITY">NLP Semantic Text Similarity</option>
          <option value="ENTITY_MATCH">Domain Key Indicator Overlap</option>
        </select>

        <select
          className="filter-select"
          value={minScore}
          onChange={e => setMinScore(e.target.value)}
        >
          <option value="0">All Match Scores</option>
          <option value="0.85">High Probability (&gt;85%)</option>
          <option value="0.70">Moderate Overlap (&gt;70%)</option>
          <option value="0.55">Threshold Match (&gt;55%)</option>
        </select>

        {(search || statusFilter !== 'All' || matchTypeFilter !== 'All' || minScore !== '0') && (
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => {
              setSearch('');
              setStatusFilter('All');
              setMatchTypeFilter('All');
              setMinScore('0');
            }}
          >
            <MdClear /> Clear
          </button>
        )}
      </div>

      {/* Overlaps List */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center' }}>{t('common.loading')}</div>
      ) : overlaps.length === 0 ? (
        <div className="gov-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No overlap collisions found matching the selected filters.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {overlaps.map(ov => {
            const scorePct = Math.round(ov.similarityScore * 100);
            const scoreColor = getScoreColor(ov.similarityScore);

            return (
              <div
                key={ov.id}
                className="gov-card"
                style={{
                  borderLeft: `4px solid ${scoreColor}`,
                  marginBottom: 0
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span className="badge badge-dept" style={{ fontWeight: 700 }}>{ov.id}</span>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-navy)', margin: 0 }}>
                        {ov.institution?.name}
                      </h3>
                      <span className="badge badge-dept">{ov.matchType}</span>
                      {getStatusBadge(ov.status)}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Permanent ID: <strong>{ov.institution?.aicteId}</strong> • Parallel Collision between <strong>{ov.departmentA} Bureau</strong> and <strong>{ov.departmentB} Bureau</strong>
                    </div>
                  </div>

                  {/* AI Score */}
                  <div style={{ minWidth: '180px', textAlign: 'right' }}>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>AI Overlap Confidence:</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: scoreColor }}>
                      {scorePct}%
                    </div>
                    <div className="score-gauge-bar">
                      <div className="score-gauge-fill" style={{ width: `${scorePct}%`, backgroundColor: scoreColor }} />
                    </div>
                  </div>
                </div>

                {/* Side-by-Side Comparison */}
                <div className="overlap-comparison-grid" style={{ marginBottom: '16px' }}>
                  <div className="comparison-column bureau-a">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span className="badge badge-dept">{ov.departmentA} Bureau</span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{ov.complaintA?.complaintNumber}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{ov.complaintA?.category}</div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                      "{ov.complaintA?.description}"
                    </p>
                  </div>

                  <div className="comparison-middle-connector">
                    <div className="connector-badge">⇄ Cross-Bureau Conflict</div>
                  </div>

                  <div className="comparison-column bureau-b">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span className="badge badge-dept">{ov.departmentB} Bureau</span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{ov.complaintB?.complaintNumber}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{ov.complaintB?.category}</div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                      "{ov.complaintB?.description}"
                    </p>
                  </div>
                </div>

                {/* Explainable Signals */}
                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '12px 16px', borderRadius: '4px', marginBottom: '14px', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                    EXPLAINABLE MATCH EVIDENCE SIGNALS:
                  </div>
                  <ul style={{ paddingLeft: '18px', fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                    {Array.isArray(ov.matchedSignals) && ov.matchedSignals.map((sig, i) => (
                      <li key={i} style={{ marginBottom: '2px' }}>{sig}</li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Human Verification Required • No automatic case merger is applied without officer sign-off.
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {ov.status !== 'CONFIRMED' && (
                      <button className="btn btn-primary btn-sm" onClick={() => handleReviewAction(ov.id, 'CONFIRMED')}>
                        <MdCheckCircle /> {t('overlaps.confirmOverlap')}
                      </button>
                    )}
                    {ov.status !== 'DISMISSED' && (
                      <button className="btn btn-secondary btn-sm" onClick={() => handleReviewAction(ov.id, 'DISMISSED')}>
                        <MdClose /> {t('overlaps.dismiss')}
                      </button>
                    )}
                    <button className="btn btn-saffron btn-sm" onClick={() => navigate(`/overlaps/${ov.id}`)}>
                      <MdCompareArrows /> {t('overlaps.compareSideBySide')} <MdArrowForward />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* How Overlap Detection Works Modal */}
      {showHowModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 37, 69, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setShowHowModal(false)}
        >
          <div className="gov-card" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div className="gov-card-header">
              <h3 className="gov-card-title">How the AICTE Overlap Detection Engine Works</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowHowModal(false)}>✕</button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
              The engine operates as an explainable multi-signal service evaluating complaints across independent bureaus:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem' }}>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '4px', borderLeft: '3px solid #1B365D' }}>
                <strong>1. Verified Permanent AICTE ID Indexing (35% weight):</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Matches cases against the official central registry ID (e.g. <code>AICTE-1-4527891234</code>) to bind diverse bureau filings to the identical legal entity.
                </p>
              </div>

              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '4px', borderLeft: '3px solid #0284C7' }}>
                <strong>2. Grievance Taxonomy & Category Alignment (25% weight):</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Computes regulatory nexus across grievance classifications (e.g. Unapproved Courses linked with Infrastructure Deficiencies).
                </p>
              </div>

              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '4px', borderLeft: '3px solid #D9531E' }}>
                <strong>3. TF-IDF & N-gram Semantic Similarity (25% weight):</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Extracts term frequency vectors, filters administrative stopwords, and calculates cosine similarity across grievance statements.
                </p>
              </div>

              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '4px', borderLeft: '3px solid #16A34A' }}>
                <strong>4. Timeline Proximity Decay (15% weight):</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Complaints filed within 30 days receive high urgency score, decaying gracefully for temporally distant matters.
                </p>
              </div>

              <div style={{ background: '#FEF3C7', padding: '12px', borderRadius: '4px', borderLeft: '3px solid #B45309' }}>
                <strong>Crucial Safeguard — Common Institution Distinction:</strong>
                <p style={{ color: '#92400E', marginTop: '2px' }}>
                  If two complaints target the same college but pertain to completely independent matters (e.g. fee dispute vs canteen hygiene), the engine caps the score below 0.35 and prevents wrongful merging.
                </p>
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px', justifyContent: 'center' }} onClick={() => setShowHowModal(false)}>
              Close Architecture Explainer
            </button>
          </div>
        </div>
      )}

      {/* Benchmark Evaluator Modal */}
      {showEvalModal && evalResults && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 37, 69, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setShowEvalModal(false)}
        >
          <div className="gov-card" style={{ maxWidth: '780px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div className="gov-card-header">
              <h3 className="gov-card-title">
                <MdAssessment /> Engine Accuracy Benchmark Evaluation
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowEvalModal(false)}>✕</button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Evaluation computed over ground-truth labeled benchmark test dataset ({evalResults.metrics.totalCases} verified complaint pairs).
            </p>

            {/* Metrics Grid */}
            <div className="kpi-grid" style={{ marginBottom: '16px' }}>
              <div className="kpi-card green">
                <div className="kpi-label">Precision</div>
                <div className="kpi-value" style={{ color: '#16A34A' }}>{Math.round(evalResults.metrics.precision * 100)}%</div>
                <div className="kpi-subtext">TP / (TP + FP)</div>
              </div>
              <div className="kpi-card blue">
                <div className="kpi-label">Recall</div>
                <div className="kpi-value" style={{ color: '#0284C7' }}>{Math.round(evalResults.metrics.recall * 100)}%</div>
                <div className="kpi-subtext">TP / (TP + FN)</div>
              </div>
              <div className="kpi-card saffron">
                <div className="kpi-label">F1-Score</div>
                <div className="kpi-value" style={{ color: 'var(--accent-saffron)' }}>{evalResults.metrics.f1Score}</div>
                <div className="kpi-subtext">Harmonic mean</div>
              </div>
              <div className="kpi-card red">
                <div className="kpi-label">False Positive Rate</div>
                <div className="kpi-value" style={{ color: '#DC2626' }}>{Math.round(evalResults.metrics.falsePositiveRate * 100)}%</div>
                <div className="kpi-subtext">FP / (FP + TN)</div>
              </div>
            </div>

            {/* Test Case Breakdown */}
            <div style={{ marginTop: '16px' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '8px', color: 'var(--primary-navy)' }}>
                Ground Truth Pair Verification Results
              </h4>
              <div className="table-responsive">
                <table className="gov-table" style={{ fontSize: '0.78rem' }}>
                  <thead>
                    <tr>
                      <th>Key</th>
                      <th>Institution</th>
                      <th>Ground Truth</th>
                      <th>Predicted Score</th>
                      <th>Verdict</th>
                      <th>Analysis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evalResults.caseResults.map(cr => (
                      <tr key={cr.pairKey}>
                        <td><strong>{cr.pairKey}</strong></td>
                        <td>{cr.institutionName}</td>
                        <td>{cr.groundTruthLabel ? 'Genuine Overlap' : 'Non-Overlap'}</td>
                        <td><strong>{Math.round(cr.predictedScore * 100)}%</strong></td>
                        <td>
                          <span className={`badge ${cr.isCorrect ? 'badge-disposed' : 'badge-critical'}`}>
                            {cr.verdict}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{cr.explanation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px', justifyContent: 'center' }} onClick={() => setShowEvalModal(false)}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
