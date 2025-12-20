import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, X, Search, Network, Sparkles, 
  Target, Zap, Globe, Star, ArrowRight
} from 'lucide-react';

interface GraphNode {
  id: string;
  type: 'skill' | 'project' | 'role' | 'publication' | 'talk';
  label: string;
  description?: string;
  level?: number;
  company?: string;
  technologies?: string[];
  year?: number;
  url?: string;
  x: number;
  y: number;
  connections: string[];
  isHighlighted?: boolean;
  pulse?: boolean;
}

interface GraphEdge {
  from: string;
  to: string;
  type: 'used_in' | 'learned_from' | 'applied_to' | 'presented_at' | 'worked_on';
  strength: number;
  animated?: boolean;
}

interface CareerKnowledgeGraphProps {
  data: {
    skills: any[];
    projects: any[];
    experiences: any[];
    publications: any[];
    talks?: any[];
  };
}

const CareerKnowledgeGraph: React.FC<CareerKnowledgeGraphProps> = ({ data }) => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'network' | 'timeline' | 'hierarchy'>('network');
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate graph data with improved layout
  useEffect(() => {
    const graphNodes: GraphNode[] = [];
    const graphEdges: GraphEdge[] = [];

    const centerX = 500;
    const centerY = 300;
    const baseRadius = 180;

    // Skills in inner circle with varying sizes based on level
    data.skills?.forEach((skill, index) => {
      const angle = (index / (data.skills?.length || 1)) * 2 * Math.PI;
      const radius = baseRadius * 0.4 + (skill.level || 3) * 10;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      graphNodes.push({
        id: `skill-${skill.id || index}`,
        type: 'skill',
        label: skill.name,
        description: skill.description || `Expertise in ${skill.name}`,
        level: skill.level || 3,
        x,
        y,
        connections: [],
        pulse: (skill.level || 3) >= 4
      });
    });

    // Projects in middle ring
    data.projects?.forEach((project, index) => {
      const angle = (index / (data.projects?.length || 1)) * 2 * Math.PI + Math.PI / 6;
      const x = centerX + Math.cos(angle) * baseRadius * 0.7;
      const y = centerY + Math.sin(angle) * baseRadius * 0.7;
      
      graphNodes.push({
        id: `project-${project.id || index}`,
        type: 'project',
        label: project.name,
        description: project.description,
        technologies: project.technologies || [],
        year: project.created_at ? new Date(project.created_at).getFullYear() : new Date().getFullYear(),
        url: project.url || project.github_url,
        x,
        y,
        connections: []
      });
    });

    // Roles in outer ring
    data.experiences?.forEach((exp, index) => {
      const angle = (index / (data.experiences?.length || 1)) * 2 * Math.PI + Math.PI / 3;
      const x = centerX + Math.cos(angle) * baseRadius * 1.1;
      const y = centerY + Math.sin(angle) * baseRadius * 1.1;
      
      graphNodes.push({
        id: `role-${exp.id || index}`,
        type: 'role',
        label: exp.position,
        description: exp.description,
        company: exp.company,
        year: new Date(exp.start_date).getFullYear(),
        x,
        y,
        connections: []
      });
    });

    // Publications scattered around
    data.publications?.forEach((pub, index) => {
      const angle = (index / (data.publications?.length || 1)) * 2 * Math.PI + Math.PI / 2;
      const x = centerX + Math.cos(angle) * baseRadius * 1.4;
      const y = centerY + Math.sin(angle) * baseRadius * 1.4;
      
      graphNodes.push({
        id: `pub-${pub.id || index}`,
        type: 'publication',
        label: pub.title.length > 25 ? pub.title.substring(0, 25) + '...' : pub.title,
        description: pub.description,
        year: pub.year,
        url: pub.url,
        x,
        y,
        connections: []
      });
    });

    // Generate connections with animation
    graphNodes.forEach(node => {
      if (node.type === 'project' && node.technologies) {
        node.technologies.forEach(tech => {
          const skillNode = graphNodes.find(n => 
            n.type === 'skill' && 
            (n.label.toLowerCase().includes(tech.toLowerCase()) ||
             tech.toLowerCase().includes(n.label.toLowerCase()))
          );
          if (skillNode) {
            const edgeStrength = skillNode.level ? skillNode.level / 5 : 0.5;
            graphEdges.push({
              from: skillNode.id,
              to: node.id,
              type: 'used_in',
              strength: edgeStrength,
              animated: Math.random() > 0.7
            });
            node.connections.push(skillNode.id);
            skillNode.connections.push(node.id);
          }
        });
      }
    });

    setNodes(graphNodes);
    setEdges(graphEdges);
  }, [data]);

  const filteredNodes = nodes.filter(node => {
    const matchesSearch = node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         node.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || node.type === filterType;
    return matchesSearch && matchesType;
  });

  const filteredEdges = edges.filter(edge => 
    filteredNodes.some(n => n.id === edge.from) && 
    filteredNodes.some(n => n.id === edge.to)
  );

  const getNodeStyle = (node: GraphNode) => {
    const isHighlighted = hoveredNode === node.id;
    let size = 16;
    let color = '#6b7280';
    let glowColor = 'rgba(107, 114, 128, 0.3)';

    switch (node.type) {
      case 'skill':
        size = 20 + (node.level || 3) * 2;
        color = (node.level || 3) >= 4 ? '#10b981' : '#3b82f6';
        glowColor = (node.level || 3) >= 4 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(59, 130, 246, 0.4)';
        break;
      case 'project':
        size = 24;
        color = '#8b5cf6';
        glowColor = 'rgba(139, 92, 246, 0.4)';
        break;
      case 'role':
        size = 22;
        color = '#f59e0b';
        glowColor = 'rgba(245, 158, 11, 0.4)';
        break;
      case 'publication':
        size = 20;
        color = '#ef4444';
        glowColor = 'rgba(239, 68, 68, 0.4)';
        break;
    }

    if (isHighlighted) {
      size += 8;
      glowColor = 'rgba(255, 255, 255, 0.6)';
    }

    return { size, color, glowColor };
  };

  const getNodeIcon = (type: string, level?: number) => {
    switch (type) {
      case 'skill': return (level || 3) >= 4 ? '⭐' : '⚡';
      case 'project': return '🚀';
      case 'role': return '👔';
      case 'publication': return '📄';
      case 'talk': return '🎤';
      default: return '●';
    }
  };

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
  };

  const animateLayout = () => {
    setIsAnimating(true);
    setNodes(prevNodes => 
      prevNodes.map(node => ({
        ...node,
        x: node.x + (Math.random() - 0.5) * 30,
        y: node.y + (Math.random() - 0.5) * 30
      }))
    );
    setTimeout(() => setIsAnimating(false), 1500);
  };

  return (
    <div style={{ 
      height: '100%', 
      width: '100%', 
      position: 'relative', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      borderRadius: '16px',
      overflow: 'visible',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      minHeight: '600px'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
        `,
        animation: 'float 6s ease-in-out infinite'
      }} />

      {/* Controls */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        zIndex: 10,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#94a3b8' 
            }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px 12px 10px 40px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '14px',
                width: '200px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '10px 16px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '14px',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Types</option>
            <option value="skill">Skills</option>
            <option value="project">Projects</option>
            <option value="role">Roles</option>
            <option value="publication">Publications</option>
          </select>

          {/* Animate Button */}
          <button
            onClick={animateLayout}
            disabled={isAnimating}
            style={{
              padding: '10px',
              background: isAnimating 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              cursor: isAnimating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!isAnimating) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Sparkles size={16} />
            {isAnimating ? 'Animating...' : 'Animate'}
          </button>
        </div>
      </div>

      {/* Stats Panel */}
      <div style={{
        position: 'absolute',
        top: '100px',
        right: '20px',
        zIndex: 10,
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '20px',
        minWidth: '200px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Target size={16} color="#94a3b8" />
          <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '600' }}>Network Stats</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>Total Nodes</span>
            <span style={{ color: '#10b981', fontSize: '13px', fontWeight: '600' }}>{filteredNodes.length}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>Connections</span>
            <span style={{ color: '#3b82f6', fontSize: '13px', fontWeight: '600' }}>{filteredEdges.length}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>Skills</span>
            <span style={{ color: '#8b5cf6', fontSize: '13px', fontWeight: '600' }}>
              {filteredNodes.filter(n => n.type === 'skill').length}
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '20px',
        zIndex: 10,
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '20px',
        maxWidth: '250px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Network size={16} color="#94a3b8" />
          <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '600' }}>Node Types</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { type: 'skill', color: '#3b82f6', label: 'Skills', icon: '⚡' },
            { type: 'project', color: '#8b5cf6', label: 'Projects', icon: '🚀' },
            { type: 'role', color: '#f59e0b', label: 'Roles', icon: '👔' },
            { type: 'publication', color: '#ef4444', label: 'Publications', icon: '📄' }
          ].map(item => (
            <div key={item.type} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                background: item.color,
                boxShadow: `0 0 8px ${item.color}40`
              }} />
              <span style={{ fontSize: '12px' }}>{item.icon}</span>
              <span style={{ color: '#cbd5e1', fontSize: '12px' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Graph Visualization */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: 'calc(100% - 80px)',
          position: 'relative',
          overflow: 'visible',
          marginTop: '80px',
          marginBottom: '20px'
        }}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          style={{
            background: 'transparent'
          }}
        >
          {/* Animated Background Grid */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1"/>
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Edges */}
          {filteredEdges.map((edge, index) => {
            const fromNode = filteredNodes.find(n => n.id === edge.from);
            const toNode = filteredNodes.find(n => n.id === edge.to);
            
            if (!fromNode || !toNode) return null;

            const isHighlighted = hoveredNode === fromNode.id || hoveredNode === toNode.id;
            const edgeColor = 
              edge.type === 'used_in' ? '#10b981' :
              edge.type === 'applied_to' ? '#f59e0b' :
              edge.type === 'learned_from' ? '#8b5cf6' : '#6b7280';

            return (
              <g key={index}>
                {/* Edge glow */}
                {isHighlighted && (
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={edgeColor}
                    strokeWidth="8"
                    strokeOpacity="0.2"
                    filter="url(#glow)"
                  />
                )}
                {/* Main edge */}
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={edgeColor}
                  strokeWidth={isHighlighted ? 3 : 1 + edge.strength}
                  strokeOpacity={isHighlighted ? 0.8 : 0.4}
                  strokeDasharray={edge.animated ? '5,5' : '0'}
                  style={{
                    transition: 'all 0.3s ease'
                  }}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {filteredNodes.map((node) => {
            const style = getNodeStyle(node);
            const isHighlighted = hoveredNode === node.id;
            
            return (
              <g key={node.id}>
                {/* Node glow */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={style.size + 8}
                  fill="none"
                  stroke={style.color}
                  strokeWidth="2"
                  strokeOpacity="0.3"
                  filter="url(#glow)"
                  style={{
                    opacity: isHighlighted ? 1 : 0,
                    transition: 'opacity 0.3s ease'
                  }}
                />
                {/* Node shadow */}
                <circle
                  cx={node.x + 3}
                  cy={node.y + 3}
                  r={style.size}
                  fill="rgba(0, 0, 0, 0.2)"
                />
                {/* Node circle */}
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={style.size}
                  fill={style.color}
                  stroke="#ffffff"
                  strokeWidth={isHighlighted ? 3 : 2}
                  style={{ 
                    cursor: 'pointer',
                    filter: `drop-shadow(0 4px 8px ${style.glowColor})`
                  }}
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  animate={node.pulse ? {
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8]
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                {/* Node icon */}
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                  style={{ pointerEvents: 'none' }}
                >
                  {getNodeIcon(node.type, node.level)}
                </text>
                {/* Node label */}
                <text
                  x={node.x}
                  y={node.y + style.size + 25}
                  textAnchor="middle"
                  fill={isHighlighted ? '#ffffff' : '#e2e8f0'}
                  fontSize="11"
                  fontWeight="600"
                  style={{ 
                    pointerEvents: 'none',
                    textShadow: isHighlighted ? '0 0 8px rgba(255, 255, 255, 0.5)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {node.label.length > 18 ? node.label.substring(0, 18) + '...' : node.label}
                </text>
                {/* Level indicator for skills */}
                {node.type === 'skill' && node.level && node.level >= 4 && (
                  <text
                    x={node.x + style.size - 8}
                    y={node.y - style.size + 8}
                    textAnchor="middle"
                    fill="#fbbf24"
                    fontSize="10"
                    fontWeight="bold"
                    style={{ pointerEvents: 'none' }}
                  >
                    ★
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        
        {/* Loading overlay */}
        {isAnimating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{
                width: '24px',
                height: '24px',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                borderTop: '3px solid white',
                borderRadius: '50%'
              }}
            />
            Animating network layout...
          </motion.div>
        )}
      </div>

      {/* Enhanced Side Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '420px',
              height: '100%',
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRight: 'none',
              padding: '32px',
              overflow: 'auto',
              zIndex: 20,
              boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <h2 style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: '700', 
                  color: 'white', 
                  margin: 0,
                  background: 'linear-gradient(135deg, #ffffff, #cbd5e1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {selectedNode.label}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: selectedNode.type === 'skill' ? '#3b82f6' :
                               selectedNode.type === 'project' ? '#8b5cf6' :
                               selectedNode.type === 'role' ? '#f59e0b' :
                               selectedNode.type === 'publication' ? '#ef4444' : '#6b7280'
                  }} />
                  <span style={{ 
                    textTransform: 'capitalize', 
                    fontWeight: '600', 
                    color: '#94a3b8',
                    fontSize: '14px'
                  }}>
                    {selectedNode.type}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '12px',
                  borderRadius: '12px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = '#94a3b8';
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
              {selectedNode.description && (
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ margin: 0, fontSize: '15px' }}>
                    {selectedNode.description}
                  </p>
                </div>
              )}

              {/* Details Grid */}
              <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
                {selectedNode.company && (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Globe size={16} color="#94a3b8" />
                      <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '600' }}>Company</span>
                    </div>
                    <span style={{ color: '#cbd5e1', fontSize: '14px' }}>{selectedNode.company}</span>
                  </div>
                )}

                {selectedNode.year && (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Zap size={16} color="#94a3b8" />
                      <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '600' }}>Year</span>
                    </div>
                    <span style={{ color: '#cbd5e1', fontSize: '14px' }}>{selectedNode.year}</span>
                  </div>
                )}

                {selectedNode.level && (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Star size={16} color="#94a3b8" />
                      <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '600' }}>Proficiency</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '2px',
                              background: i < selectedNode.level! ? '#3b82f6' : 'rgba(255, 255, 255, 0.2)',
                              boxShadow: i < selectedNode.level! ? '0 0 8px rgba(59, 130, 246, 0.5)' : 'none'
                            }}
                          />
                        ))}
                      </div>
                      <span style={{ color: '#cbd5e1', fontSize: '14px' }}>
                        {selectedNode.level}/5
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {selectedNode.technologies && selectedNode.technologies.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ color: '#e2e8f0', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                    Technologies
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedNode.technologies.map((tech, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '6px 12px',
                          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '20px',
                          fontSize: '12px',
                          color: '#3b82f6',
                          fontWeight: '500'
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedNode.url && (
                <a
                  href={selectedNode.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    marginBottom: '24px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <ExternalLink size={16} />
                  View Details
                  <ArrowRight size={14} />
                </a>
              )}

              {selectedNode.connections.length > 0 && (
                <div>
                  <h4 style={{ color: '#e2e8f0', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                    Connected Nodes ({selectedNode.connections.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedNode.connections.slice(0, 6).map(connectionId => {
                      const connectedNode = nodes.find(n => n.id === connectionId);
                      if (!connectedNode) return null;
                      
                      return (
                        <button
                          key={connectionId}
                          onClick={() => setSelectedNode(connectedNode)}
                          style={{
                            padding: '12px 16px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            color: '#e2e8f0',
                            fontSize: '14px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                            e.currentTarget.style.transform = 'translateX(4px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.transform = 'translateX(0)';
                          }}
                        >
                          <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: connectedNode.type === 'skill' ? '#3b82f6' :
                                       connectedNode.type === 'project' ? '#8b5cf6' :
                                       connectedNode.type === 'role' ? '#f59e0b' :
                                       connectedNode.type === 'publication' ? '#ef4444' : '#6b7280'
                          }} />
                          <span style={{ fontSize: '12px' }}>{getNodeIcon(connectedNode.type, connectedNode.level)}</span>
                          <span style={{ flex: 1 }}>{connectedNode.label}</span>
                          <ArrowRight size={12} color="#94a3b8" />
                        </button>
                      );
                    })}
                    {selectedNode.connections.length > 6 && (
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#6b7280', 
                        textAlign: 'center', 
                        marginTop: '8px',
                        padding: '8px'
                      }}>
                        +{selectedNode.connections.length - 6} more connections...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default CareerKnowledgeGraph;