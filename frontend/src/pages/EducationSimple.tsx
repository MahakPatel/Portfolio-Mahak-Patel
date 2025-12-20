import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, Award, BookOpen, Star, Trophy } from 'lucide-react';

const EducationSimple: React.FC = () => {
  const education = [
    {
      id: 1,
      institution: "California State Polytechnic University, Pomona",
      degree: "Master of Science in Computer Science",
      field: "Computer Science",
      startDate: "2023-08-23",
      endDate: "2025-12-14",
      gpa: "4.0/4.0",
      location: "Pomona, California, United States",
      description: "Advanced studies in computer science with focus on artificial intelligence, machine learning, and software engineering. Completed thesis on lane detection algorithms for autonomous vehicles in severe weather conditions.",
      coursework: ["Machine Learning", "Computer Vision", "Advanced Algorithms", "Software Engineering", "Database Systems", "Distributed Systems"],
      achievements: ["Published research paper in SPIE conference", "Graduate Research Assistant", "Dean's List"],
      logo: "🎓"
    },
    {
      id: 2,
      institution: "Dharmsinh Desai University",
      degree: "Bachelor of Technology in Information Technology",
      field: "Information Technology",
      startDate: "2018-06-16",
      endDate: "2022-05-09",
      gpa: "8.30/10",
      location: "Nadiad, Gujarat, India",
      description: "Comprehensive undergraduate program covering software development, database management, networking, and system design. Developed strong foundation in programming and problem-solving.",
      coursework: ["Data Structures", "Object-Oriented Programming", "Database Management", "Computer Networks", "Software Engineering", "Web Development"],
      achievements: ["Academic Excellence Award", "Project Showcase Winner", "Technical Club President"],
      logo: "🏛️"
    }
  ];

  const certifications = [
    {
      id: 1,
      name: "AWS Partner: Accreditation (Technical)",
      issuer: "Amazon Web Services",
      date: "2024-03-15",
      description: "Technical accreditation demonstrating expertise in AWS cloud solutions and architecture.",
      icon: "☁️"
    },
    {
      id: 2,
      name: "Machine Learning Basics",
      issuer: "Amazon Web Services",
      date: "2023-11-20",
      description: "Fundamental concepts and practical applications of machine learning using AWS services.",
      icon: "🤖"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

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
            Education & Achievements
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
            My academic journey and professional certifications highlighting continuous growth.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Education Section */}
          <motion.div 
            variants={itemVariants} 
          whileHover={{ 
            rotateY: 3,
            boxShadow: '0 15px 30px rgba(16, 185, 129, 0.3)',
            background: 'rgba(16, 185, 129, 0.05)',
            borderColor: 'rgba(16, 185, 129, 0.3)',
            transition: { duration: 0.3, ease: "easeOut" }
          }}
            style={{ marginBottom: '64px', cursor: 'pointer', borderRadius: '16px', padding: '24px' }}
          >
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: '600', 
              color: 'white', 
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <GraduationCap style={{ width: '32px', height: '32px', color: '#3b82f6' }} />
              Academic Background
            </h2>

            <div style={{ display: 'grid', gap: '32px' }}>
              {education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  variants={itemVariants}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '20px',
                    padding: '32px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Institution Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                    <div style={{
                      fontSize: '48px',
                      width: '80px',
                      height: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(59, 130, 246, 0.2)',
                      borderRadius: '20px',
                      border: '2px solid rgba(59, 130, 246, 0.3)'
                    }}>
                      {edu.logo}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '8px' }}>
                        {edu.institution}
                      </h3>
                      <p style={{ fontSize: '1.125rem', color: '#3b82f6', fontWeight: '500', marginBottom: '4px' }}>
                        {edu.degree}
                      </p>
                      <p style={{ fontSize: '1rem', color: '#9ca3af' }}>
                        {edu.field}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Calendar style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
                        <span style={{ color: '#9ca3af', fontSize: '14px' }}>
                          {new Date(edu.startDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} - {new Date(edu.endDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <MapPin style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
                        <span style={{ color: '#9ca3af', fontSize: '14px' }}>{edu.location}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Star style={{ width: '16px', height: '16px', color: '#fbbf24' }} />
                        <span style={{ color: '#fbbf24', fontSize: '14px', fontWeight: '600' }}>GPA: {edu.gpa}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ color: '#e5e7eb', lineHeight: '1.6', marginBottom: '24px' }}>
                    {edu.description}
                  </p>

                  {/* Coursework */}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#9ca3af', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <BookOpen style={{ width: '18px', height: '18px' }} />
                      Key Coursework
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {edu.coursework.map((course) => (
                        <span
                          key={course}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#10b981',
                            fontSize: '12px',
                            borderRadius: '20px',
                            fontWeight: '500'
                          }}
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#9ca3af', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Trophy style={{ width: '18px', height: '18px' }} />
                      Achievements
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {edu.achievements.map((achievement, i) => (
                        <li key={i} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px', 
                          marginBottom: '6px',
                          fontSize: '14px',
                          color: '#e5e7eb'
                        }}>
                          <Award style={{ width: '14px', height: '14px', color: '#fbbf24', flexShrink: 0 }} />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Decorative Elements */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '120px',
                    height: '120px',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent)',
                    borderRadius: '0 20px 0 120px'
                  }} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Certifications Section */}
          <motion.div 
            variants={itemVariants} 
          whileHover={{ 
            rotateY: 3,
            boxShadow: '0 15px 30px rgba(16, 185, 129, 0.3)',
            background: 'rgba(16, 185, 129, 0.05)',
            borderColor: 'rgba(16, 185, 129, 0.3)',
            transition: { duration: 0.3, ease: "easeOut" }
          }}
            style={{ marginBottom: '64px', cursor: 'pointer', borderRadius: '16px', padding: '24px' }}
          >
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: '600', 
              color: 'white', 
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Award style={{ width: '32px', height: '32px', color: '#8b5cf6' }} />
              Certifications
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
              {certifications.map((cert) => (
                <motion.div
                  key={cert.id}
                  variants={itemVariants}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                    <div style={{
                      fontSize: '32px',
                      width: '60px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(139, 92, 246, 0.2)',
                      borderRadius: '12px'
                    }}>
                      {cert.icon}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '4px' }}>
                        {cert.name}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#8b5cf6', fontWeight: '500' }}>
                        {cert.issuer}
                      </p>
                    </div>
                  </div>
                  <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.5', marginBottom: '12px' }}>
                    {cert.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#9ca3af' }}>
                    <Calendar style={{ width: '14px', height: '14px' }} />
                    <span>Issued: {new Date(cert.date).toLocaleDateString('en-US')}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default EducationSimple;