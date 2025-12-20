import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Github, Linkedin, Mail, MapPin, Code, Cpu, Zap, Target } from 'lucide-react';
import GitHubStats from '../components/GitHubStats';
import CodingStats from '../components/CodingStats';
import Testimonials from '../components/Testimonials';

const HomeSimple: React.FC = () => {
  const portfolio = {
    name: "Mahak Patel",
    title: "Software Engineer",
    bio: "Experienced software engineer with expertise in Go, Python, specializing in backend development, scalable solutions, and system optimization. Experienced in Kafka-based event-driven architecture, REST API, and CI/CD automation. Proficient in Django, Gofr, MySQL, PostgreSQL, and performance optimization. Possesses strong problem-solving skills and effective teamwork abilities.",
    email: "mahakpatel0208@gmail.com",
    phone: "+1 (840) 231-9761",
    location: "Irving, Texas, United States",
    github_url: "https://github.com/mahakpatel",
    linkedin_url: "https://www.linkedin.com/in/mahakpatel/",
    resume_url: "/resume.pdf",
    avatar_url: ""
  };

  const featuredProjects = [
    {
      id: 1,
      name: "Lane Detection in Severe Weather Condition",
      description: "Formulated and executed a robust lane detection algorithm for superior performance in adverse weather conditions including heavy rain, limited visibility at night, and foggy environments.\n\nUtilized CARLA sensors for comprehensive evaluation and testing.\n\nAchieved an impressive 90% accuracy rate in identifying and delineating lanes using advanced image processing techniques and machine learning algorithms.",
      url: "",
      github_url: "https://github.com/mahakpatel/lane-detection",
      technologies: ["CARLA Simulator", "Python", "OpenCV", "NumPy"],
      featured: true
    },
    {
      id: 2,
      name: "Online Salon Management System",
      description: "Devised a robust Online Salon Management System to optimize appointment scheduling, leading to a 40% increase in customer bookings and a 25% reduction in no-shows. Designed a seamless online booking system with user/admin dashboards and integrated online payments, streamlining scheduling and reducing manual data entry by 50%.",
      url: "",
      github_url: "https://github.com/mahakpatel/Online-Salon-Management",
      technologies: ["Python", "Django", "MySQL", "HTML", "CSS", "PostgreSQL"],
      featured: true
    }
  ];


  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section className="hero">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          {/* Avatar */}
          <motion.div
            className="relative mx-auto w-32 h-32 mb-8"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'relative', margin: '0 auto 32px', width: '128px', height: '128px' }}
          >
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white'
              }}>
                {portfolio.name.charAt(0)}
              </div>
            </div>
          </motion.div>

          {/* Name and Title */}
          <div style={{ marginBottom: '32px' }}>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="gradient-text"
              style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '24px' }}
            >
              {portfolio.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ fontSize: '1.5rem', color: '#94a3b8', marginBottom: '16px' }}
            >
              {portfolio.title}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              style={{ fontSize: '1.125rem', color: '#64748b', marginBottom: '32px', lineHeight: '1.6' }}
            >
              {portfolio.bio}
            </motion.p>
          </div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px', color: '#9ca3af', marginBottom: '32px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin style={{ width: '20px', height: '20px' }} />
              <span>{portfolio.location}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail style={{ width: '20px', height: '20px' }} />
              <span>{portfolio.email}</span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="hero-buttons"
          >
            <Link to="/projects" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <span>View My Work</span>
              <ArrowRight style={{ width: '20px', height: '20px' }} />
            </Link>
            {portfolio.resume_url && (
              <a 
                href={portfolio.resume_url} 
                className="btn-secondary" 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                download="Mahak_Patel_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download style={{ width: '20px', height: '20px' }} />
                <span>Download Resume</span>
              </a>
            )}
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="social-links"
          >
            {portfolio.github_url && (
              <a href={portfolio.github_url} target="_blank" rel="noopener noreferrer">
                <Github style={{ width: '24px', height: '24px' }} />
              </a>
            )}
            {portfolio.linkedin_url && (
              <a href={portfolio.linkedin_url} target="_blank" rel="noopener noreferrer">
                <Linkedin style={{ width: '24px', height: '24px' }} />
              </a>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="gradient-text" style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '24px' }}>
            Featured Projects
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 48px' }}>
            Some of my recent work and side projects
          </p>
        </motion.div>

        <div className="grid grid-3">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="card"
              style={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}
              whileHover={{ 
                rotateY: 3,
                boxShadow: '0 15px 30px rgba(16, 185, 129, 0.3)',
                background: 'rgba(16, 185, 129, 0.05)',
                borderColor: 'rgba(16, 185, 129, 0.3)',
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div style={{
                aspectRatio: '16/9',
                borderRadius: '8px',
                marginBottom: '16px',
                overflow: 'hidden',
                position: 'relative',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))'
              }}>
                {project.id === 1 && (
                  <img 
                    src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=225&fit=crop&crop=center" 
                    alt="Lane Detection Project"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
                {project.id === 2 && (
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop&crop=center" 
                    alt="Salon Management System"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
                {/* Overlay for better text readability */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  color: 'white',
                  pointerEvents: 'none'
                }}>
                  {project.id === 2 && '💇‍♀️'}
                </div>
              </div>
              {/* Project Content */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '8px' }}>
                  {project.name}
                </h3>
                <p style={{ color: '#9ca3af', marginBottom: '16px', lineHeight: '1.5', textAlign: 'justify', fontSize: '13px' }}>
                  {project.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      style={{
                        padding: '4px 8px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: '#3b82f6',
                        fontSize: '12px',
                        borderRadius: '12px'
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Project Actions */}
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: 'auto' }}>
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer" style={{ color: '#9ca3af' }}>
                    <Github style={{ width: '20px', height: '20px' }} />
                  </a>
                )}
                {project.id === 1 && (
                  <a
                    href="https://drive.google.com/drive/folders/1_xo8c1IxT0JMfihySAu_zLcUFjwKLYUP?dmr=1&ec=wgc-drive-globalnav-goto"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#9ca3af',
                      textDecoration: 'none',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = '#3b82f6';
                      (e.target as HTMLElement).style.background = 'rgba(59, 130, 246, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = '#9ca3af';
                      (e.target as HTMLElement).style.background = 'transparent';
                    }}
                    title="Watch Demo Video"
                  >
                    ▶️ Demo
                  </a>
                )}
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" style={{ color: '#9ca3af' }}>
                    <ArrowRight style={{ width: '20px', height: '20px' }} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>


      {/* GitHub Activity Section */}
      <section style={{ padding: '80px 0', background: 'rgba(255, 255, 255, 0.02)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '48px' }}
          >
            <h2 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '16px' }}>
              GitHub Activity
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '500px', margin: '0 auto' }}>
              My coding journey and contributions
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '48px'
          }}>
            {[
              { label: 'Repositories', value: '10', color: '#10b981', icon: '📁' },
              { label: 'Stars', value: '10', color: '#f59e0b', icon: '⭐' },
              { label: 'Contributions', value: '3,323', color: '#3b82f6', icon: '📊' },
              { label: 'Longest Streak', value: '104', color: '#ef4444', icon: '🔥' },
              { label: 'Languages', value: '5+', color: '#8b5cf6', icon: '💻' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  rotateY: 3,
                  boxShadow: '0 15px 30px rgba(16, 185, 129, 0.3)',
                  background: 'rgba(16, 185, 129, 0.05)',
                  borderColor: 'rgba(16, 185, 129, 0.3)',
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{stat.icon}</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: stat.color, marginBottom: '8px' }}>
                  {stat.value}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Repository Grid */}
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '24px', textAlign: 'center' }}>
              Recent Repositories
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {[
                { name: 'LeetCode', language: 'C++', stars: 1, description: 'LeetCode solutions and algorithms' },
                { name: 'GeeksForGeeks', language: 'C++', stars: 1, description: 'GeeksforGeeks practice problems' },
                { name: 'Online-Salon-Management', language: 'CSS', stars: 1, description: 'Salon booking and management system' },
                { name: 'Restaurant-Billing-System', language: 'Python', stars: 1, description: 'Restaurant billing and inventory system' },
                { name: 'News_App', language: 'Dart', stars: 1, description: 'Mobile news application' }
              ].map((repo, index) => (
                <motion.div
                  key={repo.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    rotateY: 3,
                    boxShadow: '0 15px 30px rgba(16, 185, 129, 0.3)',
                    background: 'rgba(16, 185, 129, 0.05)',
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => window.open(`https://github.com/mahakpatel/${repo.name}`, '_blank')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'white', margin: 0 }}>
                      {repo.name}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '4px 8px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: '#3b82f6',
                        fontSize: '11px',
                        borderRadius: '8px',
                        fontWeight: '500'
                      }}>
                        {repo.language}
                      </span>
                      <span style={{ color: '#9ca3af', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ⭐ {repo.stars}
                      </span>
                    </div>
                  </div>
                  <p style={{ color: '#9ca3af', fontSize: '13px', lineHeight: '1.4', margin: 0 }}>
                    {repo.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coding Platforms Section */}
      <section style={{ padding: '80px 0', background: 'rgba(255, 255, 255, 0.02)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ 
            rotateY: 3,
            boxShadow: '0 15px 30px rgba(16, 185, 129, 0.3)',
            background: 'rgba(16, 185, 129, 0.05)',
            borderColor: 'rgba(16, 185, 129, 0.3)',
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          style={{ textAlign: 'center', marginBottom: '48px', cursor: 'pointer', borderRadius: '16px', padding: '24px' }}
        >
          <h2 className="gradient-text" style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '24px' }}>
            Coding Platforms
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
            Algorithm practice and competitive programming achievements
          </p>
        </motion.div>

        <CodingStats />
      </section>

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
};

export default HomeSimple;
