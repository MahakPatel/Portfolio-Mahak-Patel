import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, Users, ExternalLink, Quote, Award, BookOpen } from 'lucide-react';

const PublicationsSimple: React.FC = () => {
  const publications = [
    {
      id: 1,
      title: "Machine-learning techniques for the detection of powdery mildew in vineyards using aerial and ground imageries",
      authors: ["Mahak Patel", "Co-authors"],
      conference: "SPIE Defense + Commercial Sensing",
      journal: "",
      year: 2025,
      volume: "",
      issue: "",
      location: "Conference Proceedings",
      pages: "SPIE Volume 13475",
      doi: "10.1117/12.3066315",
      abstract: "Artificial intelligence (AI) and machine learning (ML) are transforming agriculture by enabling automated crop identification and disease detection.\n\nThis study presents a lightweight ML model for detecting powdery mildew (PM) in grapevines, with a primary focus on UAV-captured imagery for scalable vineyard monitoring. PM is a fungal disease that significantly impacts grape quality, especially in susceptible varieties.\n\nThe proposed system utilizes a custom dataset and YOLO object detection models (v8n and v10n) to classify grapevine regions as healthy or diseased. Models were trained and evaluated primarily on UAV images, alongside handheld camera data for comparison.\n\nThe UAV data-trained YOLOv10n model achieved 94% precision, 64% recall, and a 76% F1 score, demonstrating robust performance for largescale deployment.",
      keywords: ["Machine Learning", "Computer Vision", "Agriculture", "Disease Detection", "YOLO", "UAV", "Precision Farming"],
      citations: 0,
      type: "Conference Paper",
      status: "Published",
      url: "https://www.spiedigitallibrary.org/conference-proceedings-of-spie/13475/1347505/Machine-learning-techniques-for-the-detection-of-powdery-mildew-in/10.1117/12.3066315.short",
      acceptance_rate: "TBD",
      impact_factor: ""
    }
  ];


  const getPublicationIcon = (type: string) => {
    switch (type) {
      case 'Journal Article':
        return <BookOpen style={{ width: '20px', height: '20px' }} />;
      case 'Conference Paper':
        return <FileText style={{ width: '20px', height: '20px' }} />;
      default:
        return <FileText style={{ width: '20px', height: '20px' }} />;
    }
  };

  const getPublicationColor = (type: string) => {
    switch (type) {
      case 'Journal Article':
        return 'linear-gradient(45deg, #3b82f6, #1d4ed8)';
      case 'Conference Paper':
        return 'linear-gradient(45deg, #8b5cf6, #7c3aed)';
      default:
        return 'linear-gradient(45deg, #6b7280, #4b5563)';
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px' }}>
      <div className="section">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="gradient-text" style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '24px' }}>
            Publications & Research
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
            My research contributions in computer science, machine learning, and software engineering.
          </p>
        </motion.div>

        {/* Publications */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'white', marginBottom: '32px', textAlign: 'center' }}>
            Research Publications
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {publications.map((pub, index) => (
              <motion.div
                key={pub.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="card"
                style={{ cursor: 'pointer' }}
          whileHover={{ 
            rotateY: 3,
            boxShadow: '0 15px 30px rgba(16, 185, 129, 0.3)',
            background: 'rgba(16, 185, 129, 0.05)',
            borderColor: 'rgba(16, 185, 129, 0.3)',
            transition: { duration: 0.3, ease: "easeOut" }
          }}
                whileTap={{ scale: 0.98 }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  {/* Publication Icon */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: getPublicationColor(pub.type),
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0
                  }}>
                    {getPublicationIcon(pub.type)}
                  </div>

                  {/* Publication Content */}
                  <div style={{ flex: 1 }}>
                    {/* Title and Status */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', lineHeight: '1.4', marginRight: '16px' }}>
                        {pub.title}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <span style={{
                          padding: '4px 8px',
                          background: 'rgba(16, 185, 129, 0.2)',
                          color: '#10b981',
                          fontSize: '12px',
                          borderRadius: '12px'
                        }}>
                          {pub.status}
                        </span>
                        <span style={{
                          padding: '4px 8px',
                          background: 'rgba(59, 130, 246, 0.2)',
                          color: '#3b82f6',
                          fontSize: '12px',
                          borderRadius: '12px'
                        }}>
                          {pub.type}
                        </span>
                      </div>
                    </div>

                    {/* Authors */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <Users style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
                      <span style={{ color: '#9ca3af', fontSize: '14px' }}>
                        {pub.authors.join(', ')}
                      </span>
                    </div>

                    {/* Publication Details */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#9ca3af', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Calendar style={{ width: '16px', height: '16px' }} />
                          <span>{pub.year}</span>
                        </div>
                        {pub.journal && (
                          <span>{pub.journal}, Vol. {pub.volume}, No. {pub.issue}</span>
                        )}
                        {pub.conference && (
                          <span>{pub.conference}</span>
                        )}
                        {pub.location && (
                          <span>{pub.location}</span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        DOI: <a 
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ 
                            color: '#3b82f6', 
                            textDecoration: 'none',
                            fontWeight: '500'
                          }}
                          onMouseEnter={(e) => (e.target as HTMLElement).style.textDecoration = 'underline'}
                          onMouseLeave={(e) => (e.target as HTMLElement).style.textDecoration = 'none'}
                        >
                          {pub.doi}
                        </a>
                      </div>
                    </div>

                    {/* Abstract and Image */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', marginBottom: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <Quote style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
                          <span style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>Abstract</span>
                        </div>
                        <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.5', marginLeft: '24px', textAlign: 'justify' }}>
                          {pub.abstract}
                        </p>
                      </div>
                      
                      {/* Publication Image */}
                      <div style={{ 
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        height: 'fit-content'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>Research Visualization</span>
                        </div>
                        <img 
                          src="https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=200&fit=crop&crop=center" 
                          alt="UAV Drone for Vineyard Monitoring"
                          style={{ 
                            width: '100%', 
                            height: '200px', 
                            objectFit: 'cover', 
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}
                        />
                      </div>
                    </div>

                    {/* Keywords and Metrics */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                          {pub.keywords.slice(0, 3).map((keyword, idx) => (
                            <span
                              key={idx}
                              style={{
                                padding: '2px 6px',
                                background: 'rgba(59, 130, 246, 0.2)',
                                color: '#3b82f6',
                                fontSize: '11px',
                                borderRadius: '8px'
                              }}
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#9ca3af' }}>
                          <span>Citations: {pub.citations}</span>
                          {pub.impact_factor && <span>Impact Factor: {pub.impact_factor}</span>}
                          {pub.acceptance_rate && <span>Acceptance Rate: {pub.acceptance_rate}</span>}
                        </div>
                      </div>
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '8px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: '#9ca3af',
                          textDecoration: 'none',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.2)';
                          (e.target as HTMLElement).style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
                          (e.target as HTMLElement).style.color = '#9ca3af';
                        }}
                        title="View Publication"
                      >
                        <ExternalLink style={{ width: '16px', height: '16px' }} />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PublicationsSimple;
