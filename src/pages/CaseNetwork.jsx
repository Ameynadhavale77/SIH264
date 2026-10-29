import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MdHub,
  MdZoomIn,
  MdZoomOut,
  MdRefresh,
  MdFilterList,
  MdAccountBalance,
  MdDescription,
  MdWarning,
  MdCompareArrows,
  MdInfo
} from 'react-icons/md';
import { api } from '../services/api';

export default function CaseNetwork() {
  const { t } = useTranslation();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOverlapsOnly, setFilterOverlapsOnly] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const svgRef = useRef(null);

  useEffect(() => {
    loadGraphData();
  }, []);

  async function loadGraphData() {
    setLoading(true);
    try {
      const data = await api.get('/network/graph');
      // Compute initial simulated coordinates for nodes
      const width = 1000;
      const height = 650;
      const nodes = (data.nodes || []).map((node, i) => {
        let x, y;
        if (node.type === 'INSTITUTION') {
          // Place institutions in central ring
          const angle = (i * 2 * Math.PI) / 8;
          x = width / 2 + 220 * Math.cos(angle);
          y = height / 2 + 180 * Math.sin(angle);
        } else if (node.type === 'BUREAU') {
          // Place bureaus at top/bottom corners
          const bIndex = ['RB', 'PGRC', 'Legal', 'Approval', 'Regional Office'].indexOf(node.name.replace(' Bureau', ''));
          x = 120 + (bIndex >= 0 ? bIndex : i) * 190;
          y = 80;
        } else {
          // Complaints orbit institutions with jitter
          const angle = (i * 2.39996) % (2 * Math.PI); // golden angle approximation
          const r = 320 + (i % 3) * 60;
          x = width / 2 + r * Math.cos(angle);
          y = height / 2 + (r * 0.75) * Math.sin(angle);
        }
        return { ...node, x, y };
      });

      setGraphData({ nodes, links: data.links || [] });
    } catch (err) {
      console.error('Failed to load network graph:', err);
    } finally {
      setLoading(false);
    }
  }

  // Handle Pan and Zoom
  function handleMouseDown(e) {
    if (e.target.tagName === 'circle' || e.target.tagName === 'text') return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }

  function handleMouseMove(e) {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  function resetView() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
  }

  // Map nodes lookup
  const nodeMap = new Map();
  graphData.nodes.forEach(n => nodeMap.set(n.id, n));

  // Filter nodes & links
  const filteredNodes = graphData.nodes.filter(n => {
    if (searchTerm) {
      const match = n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (n.aicteId && n.aicteId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (n.category && n.category.toLowerCase().includes(searchTerm.toLowerCase()));
      if (!match) return false;
    }
    return true;
  });

  const filteredLinks = graphData.links.filter(link => {
    if (filterOverlapsOnly && link.relationship !== 'CROSS_BUREAU_OVERLAP') {
      return false;
    }
    return true;
  });

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('caseNetwork.title')}</h1>
          <p className="page-subtitle">{t('caseNetwork.subtitle')}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-outline" onClick={loadGraphData}>
            <MdRefresh /> Refresh Graph
          </button>
        </div>
      </div>

      {/* Control Bar & Legend */}
      <div className="filter-bar" style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
        <input
          type="text"
          className="search-input"
          style={{ width: '260px' }}
          placeholder="Filter nodes by case # or college..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: 600, color: '#1B365D' }}>
          <input
            type="checkbox"
            checked={filterOverlapsOnly}
            onChange={(e) => setFilterOverlapsOnly(e.target.checked)}
          />
          Highlight Overlap Bridges Only
        </label>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          <button className="btn btn-outline" style={{ padding: '6px 10px' }} onClick={() => setZoom(z => Math.min(2.5, z + 0.2))}>
            <MdZoomIn />
          </button>
          <button className="btn btn-outline" style={{ padding: '6px 10px' }} onClick={() => setZoom(z => Math.max(0.4, z - 0.2))}>
            <MdZoomOut />
          </button>
          <button className="btn btn-outline" style={{ padding: '6px 10px' }} onClick={resetView}>
            Reset
          </button>
        </div>
      </div>

      {/* Graph Visual Canvas + Side Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedNode ? '1fr 340px' : '1fr', gap: '16px' }}>
        <div
          className="card"
          style={{
            height: '620px',
            position: 'relative',
            overflow: 'hidden',
            background: '#F8FAFC',
            padding: 0,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {loading ? (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
              {t('common.loading')}
            </div>
          ) : (
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              viewBox="0 0 1000 650"
              style={{ userSelect: 'none' }}
            >
              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                {/* 1. Render Links */}
                {filteredLinks.map((link, idx) => {
                  const source = nodeMap.get(link.source);
                  const target = nodeMap.get(link.target);
                  if (!source || !target) return null;

                  const isOverlap = link.relationship === 'CROSS_BUREAU_OVERLAP';

                  return (
                    <g key={idx}>
                      <line
                        x1={source.x}
                        y1={source.y}
                        x2={target.x}
                        y2={target.y}
                        stroke={isOverlap ? '#D9531E' : (link.relationship === 'FILED_AGAINST' ? '#CBD5E1' : '#E2E8F0')}
                        strokeWidth={isOverlap ? 3.5 : 1.5}
                        strokeDasharray={isOverlap ? '6,4' : 'none'}
                        opacity={isOverlap ? 0.95 : 0.6}
                      />
                      {isOverlap && (
                        <text
                          x={(source.x + target.x) / 2}
                          y={(source.y + target.y) / 2 - 6}
                          fill="#D9531E"
                          fontSize="11"
                          fontWeight="700"
                          textAnchor="middle"
                        >
                          Overlap {link.similarity}%
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* 2. Render Nodes */}
                {filteredNodes.map(node => {
                  const isSelected = selectedNode?.id === node.id;
                  const isInstitution = node.type === 'INSTITUTION';
                  const isBureau = node.type === 'BUREAU';
                  const isComplaint = node.type === 'COMPLAINT';

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedNode(node)}
                    >
                      <circle
                        r={node.size}
                        fill={node.color}
                        stroke={isSelected ? '#F59E0B' : '#FFFFFF'}
                        strokeWidth={isSelected ? 4 : 2}
                        filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.15))"
                      />

                      {/* Icon initials inside nodes */}
                      <text
                        textAnchor="middle"
                        dy=".3em"
                        fill="#FFFFFF"
                        fontSize={isInstitution ? '11' : (isBureau ? '10' : '9')}
                        fontWeight="700"
                        pointerEvents="none"
                      >
                        {isInstitution ? 'INST' : (isBureau ? node.name.slice(0, 3) : 'CASE')}
                      </text>

                      {/* Node label underneath */}
                      <text
                        y={node.size + 13}
                        textAnchor="middle"
                        fill="#1E293B"
                        fontSize={isInstitution ? '11' : '10'}
                        fontWeight={isInstitution || isBureau ? '700' : '500'}
                        pointerEvents="none"
                        style={{ textShadow: '0 1px 2px #FFF, 0 -1px 2px #FFF, 1px 0 2px #FFF, -1px 0 2px #FFF' }}
                      >
                        {node.label.length > 22 ? `${node.label.slice(0, 20)}…` : node.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          )}

          {/* Floating Legend */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              fontSize: '11px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{ fontWeight: 700, color: '#1B365D', marginBottom: '2px' }}>Graph Legend</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#1B365D' }}></span>
              <span>Technical Institutions (Hubs)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0B2545' }}></span>
              <span>AICTE Bureaus / Directorate</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4A90E2' }}></span>
              <span>Complaints (Active)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#D9381E' }}></span>
              <span>Complaints (SLA Overdue)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '16px', height: '2px', background: '#D9531E', borderTop: '2px dashed #D9531E' }}></span>
              <span>Cross-Bureau Overlap Bridges</span>
            </div>
          </div>
        </div>

        {/* Side Inspector Drawer */}
        {selectedNode && (
          <div className="card" style={{ height: '620px', overflowY: 'auto' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="card-title" style={{ fontSize: '15px' }}>Entity Inspector</h3>
              <button
                className="btn btn-outline"
                style={{ padding: '2px 8px', fontSize: '12px' }}
                onClick={() => setSelectedNode(null)}
              >
                ×
              </button>
            </div>

            <div className="card-body">
              <span className={`badge ${selectedNode.type === 'INSTITUTION' ? 'badge-primary' : (selectedNode.type === 'BUREAU' ? 'badge-warning' : 'badge-info')}`} style={{ marginBottom: '10px' }}>
                {selectedNode.type}
              </span>

              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1B365D', margin: '4px 0 8px 0' }}>
                {selectedNode.name}
              </h2>

              {selectedNode.type === 'INSTITUTION' && (
                <div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>
                    Permanent AICTE ID: <strong>{selectedNode.aicteId}</strong>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>
                    Regional Directorate: <strong>{selectedNode.region}</strong>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '16px' }}>
                    Accreditation Status: <span className="badge badge-success">{selectedNode.status}</span>
                  </div>
                  <Link to={`/institutions/${selectedNode.id.replace('inst_', '')}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    View 360° Profile
                  </Link>
                </div>
              )}

              {selectedNode.type === 'COMPLAINT' && (
                <div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '6px' }}>
                    Assigned Bureau: <strong>{selectedNode.department}</strong>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '6px' }}>
                    Category: <strong>{selectedNode.category}</strong>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '6px' }}>
                    Priority: <span className="badge badge-neutral">{selectedNode.priority}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '12px' }}>
                    Status: <span className={`badge ${selectedNode.isOverdue ? 'badge-danger' : 'badge-info'}`}>
                      {selectedNode.isOverdue ? 'SLA OVERDUE' : selectedNode.status}
                    </span>
                  </div>
                  <Link to={`/complaints/${selectedNode.id.replace('comp_', '')}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Open Case Particulars
                  </Link>
                </div>
              )}

              {selectedNode.type === 'BUREAU' && (
                <div>
                  <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.5' }}>
                    Responsible AICTE division processing technical institution grievances and regulatory compliance enforcement.
                  </p>
                  <Link to={`/complaints?bureau=${selectedNode.name.replace(' Bureau', '')}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
                    View Bureau Docket
                  </Link>
                </div>
              )}

              {/* Connected edges list */}
              <div style={{ marginTop: '20px', borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
                <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#475569', marginBottom: '8px' }}>
                  Connected Relationships
                </h4>
                {graphData.links
                  .filter(l => l.source === selectedNode.id || l.target === selectedNode.id)
                  .map((rel, idx) => {
                    const otherId = rel.source === selectedNode.id ? rel.target : rel.source;
                    const other = nodeMap.get(otherId);
                    return (
                      <div key={idx} style={{ fontSize: '11px', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                        <span style={{ color: rel.relationship === 'CROSS_BUREAU_OVERLAP' ? '#D9531E' : '#64748B', fontWeight: 600 }}>
                          {rel.relationship.replace(/_/g, ' ')}
                        </span>: {other?.label || otherId}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
