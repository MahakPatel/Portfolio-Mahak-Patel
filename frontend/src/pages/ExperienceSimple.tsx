import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Building, Heart } from 'lucide-react';
import { Experience, VolunteerExperience } from '../types';

const ExperienceSimple: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [volunteerExperiences, setVolunteerExperiences] = useState<VolunteerExperience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const [experienceRes, volunteerRes] = await Promise.all([
          fetch('http://localhost:5000/api/v1/experience'),
          fetch('http://localhost:5000/api/v1/volunteer-experiences'),
        ]);

        if (experienceRes.ok) {
          const experienceData = await experienceRes.json();
          setExperiences(experienceData);
        }

        if (volunteerRes.ok) {
          const volunteerData = await volunteerRes.json();
          setVolunteerExperiences(volunteerData);
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchExperiences();

    // Auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      fetchExperiences();
    }, 30000); // 30 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (dateString: string) => {
    const datePart = dateString.split('T')[0];
    const [year, month, day] = datePart.split('-');
    return `${month}/${day}/${year}`;
  };

  const fallbackExperiences: Experience[] = [];
  const displayExperiences = experiences.length > 0 ? experiences : fallbackExperiences;
  const displayVolunteer = volunteerExperiences.length > 0 ? volunteerExperiences : [];

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(59, 130, 246, 0.3)',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%'
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '80px 0'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <h1 className="gradient-text" style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '24px' }}>
            Professional Experience
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
            My journey through software engineering, from internships to senior roles, 
            building scalable solutions and driving innovation.
          </p>
        </motion.div>

        {/* Experience Cards - No Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {displayExperiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                boxShadow: '0 25px 50px rgba(16, 185, 129, 0.3)',
                transition: { duration: 0.3 }
              }}
              style={{ 
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
            >
              {/* Hover Overlay */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.1) 100%)',
                  opacity: 0,
                  zIndex: 1,
                  pointerEvents: 'none'
                }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              <div style={{ position: 'relative', zIndex: 2 }}>
                {/* Company Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <motion.div 
                      style={{
                        padding: '12px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        borderRadius: '12px',
                        color: '#3b82f6'
                      }}
                      whileHover={{ 
                        scale: 1.1, 
                        rotate: 5,
                        background: 'rgba(59, 130, 246, 0.3)',
                        transition: { duration: 0.2 }
                      }}
                    >
                      <Building style={{ width: '24px', height: '24px' }} />
                    </motion.div>
                    <div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '4px' }}>
                        {exp.position}
                      </h3>
                      <p style={{ fontSize: '1.125rem', color: '#3b82f6', fontWeight: '500' }}>
                        {exp.company}
                      </p>
                    </div>
                  </div>
                  {exp.current && (
                    <span style={{
                      padding: '6px 12px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      fontSize: '12px',
                      borderRadius: '20px',
                      fontWeight: '600'
                    }}>
                      Current
                    </span>
                  )}
                </div>

                {/* Duration and Location */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af' }}>
                    <Calendar style={{ width: '16px', height: '16px' }} />
                    <span style={{ fontSize: '14px' }}>
                      {formatDate(exp.start_date)} - {exp.current ? 'Present' : (exp.end_date ? formatDate(exp.end_date) : 'Present')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af' }}>
                    <MapPin style={{ width: '16px', height: '16px' }} />
                    <span style={{ fontSize: '14px' }}>{exp.location}</span>
                  </div>
                </div>

                {/* Description */}
                <p style={{ color: '#e5e7eb', lineHeight: '1.6', marginBottom: '20px', textAlign: 'justify' }}>
                  {exp.description}
                </p>

                {/* Technologies */}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '12px' }}>
                      Technologies
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {exp.technologies.map((tech, techIndex) => (
                        <motion.span
                          key={techIndex}
                          style={{
                            padding: '8px 14px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            color: '#3b82f6',
                            fontSize: '13px',
                            fontWeight: '600',
                            borderRadius: '8px',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            cursor: 'pointer'
                          }}
                          whileHover={{ 
                            scale: 1.15, 
                            y: -3,
                            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                            color: 'white',
                            borderColor: 'transparent',
                            boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)',
                            transition: { duration: 0.2 }
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements */}
                {exp.achievements && exp.achievements.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '12px' }}>
                      Key Achievements
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {exp.achievements.map((achievement, achIndex) => (
                        <motion.li
                          key={achIndex}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            marginBottom: '8px',
                            fontSize: '14px',
                            color: '#e5e7eb',
                            lineHeight: '1.5'
                          }}
                          whileHover={{ 
                            x: 5,
                            transition: { duration: 0.2 }
                          }}
                        >
                          <motion.span 
                            style={{ 
                              color: '#10b981',
                              fontWeight: 'bold',
                              fontSize: '16px',
                              marginTop: '2px'
                            }}
                            whileHover={{ scale: 1.2, rotate: 180 }}
                            transition={{ duration: 0.2 }}
                          >•</motion.span>
                          {achievement}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Volunteer Experience */}
        <div style={{ marginTop: '96px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '48px' }}
          >
            <h2 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '16px' }}>
              Volunteer Experience
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
              Community-driven work, mentorship, and contributions to causes I care about.
            </p>
          </motion.div>

          {displayVolunteer.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {displayVolunteer.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    y: -6,
                    scale: 1.01,
                    boxShadow: '0 20px 45px rgba(236, 72, 153, 0.25)',
                    transition: { duration: 0.3 }
                  }}
                  style={{
                    background: 'rgba(24, 24, 37, 0.85)',
                    border: '1px solid rgba(236, 72, 153, 0.25)',
                    borderRadius: '18px',
                    padding: '28px',
                    backdropFilter: 'blur(18px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <motion.div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(244, 114, 182, 0.12))',
                      opacity: 0,
                      zIndex: 0
                    }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(244, 114, 182, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#f472b6'
                    }}>
                      <Heart style={{ width: '24px', height: '24px' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div>
                          <h3 style={{ fontSize: '1.35rem', fontWeight: '600', color: 'white', marginBottom: '4px' }}>
                            {entry.role}
                          </h3>
                          <p style={{ color: '#f472b6', fontSize: '1rem', fontWeight: 500 }}>
                            {entry.organization}{entry.location ? ` • ${entry.location}` : ''}
                          </p>
                        </div>
                        {entry.current && (
                          <span style={{
                            padding: '6px 12px',
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#10b981',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 600
                          }}>
                            Current
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '14px', color: '#cbd5f5' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar style={{ width: '14px', height: '14px' }} />
                          {formatDate(entry.start_date)} - {entry.current ? 'Present' : (entry.end_date ? formatDate(entry.end_date) : 'Completed')}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin style={{ width: '14px', height: '14px' }} />
                          {entry.location || 'Remote'}
                        </span>
                      </div>
                      <p style={{ color: '#e5e7eb', lineHeight: 1.6, marginTop: '12px', textAlign: 'justify' }}>
                        {entry.description}
                      </p>
                      {entry.technologies && entry.technologies.length > 0 && (
                        <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {entry.technologies.map((tech, idx) => (
                            <motion.span
                              key={idx}
                              style={{
                                padding: '6px 12px',
                                background: 'rgba(236, 72, 153, 0.18)',
                                borderRadius: '9999px',
                                fontSize: '12px',
                                color: '#f472b6',
                                border: '1px solid rgba(236, 72, 153, 0.25)'
                              }}
                              whileHover={{ scale: 1.08, y: -2 }}
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                textAlign: 'center',
                padding: '48px',
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '16px',
                border: '1px dashed rgba(148, 163, 184, 0.3)',
                color: '#94a3b8'
              }}
            >
              Volunteer experience will appear here once added.
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceSimple;
