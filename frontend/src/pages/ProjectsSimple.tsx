import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Calendar } from 'lucide-react';

const ProjectsSimple: React.FC = () => {
  const projects = [
    {
      id: 1,
      name: "Lane Detection in Severe Weather Condition",
      description: "Formulated and executed a robust lane detection algorithm for superior performance in adverse weather conditions including heavy rain, limited visibility at night, and foggy environments.\n\nUtilized CARLA sensors for comprehensive evaluation and testing.\n\nAchieved an impressive 90% accuracy rate in identifying and delineating lanes using advanced image processing techniques and machine learning algorithms.",
      url: "",
      github_url: "https://github.com/Mahakpatel02/lane-detection",
      technologies: ["CARLA Simulator", "Python", "OpenCV", "NumPy"],
      featured: true,
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      name: "Car Dealership Web API",
      description: "Developed a high-performance Web API, streamlining inventory management and diminishing manual errors by 40%, while improving data accuracy by 25%. Constructed and implemented an API for streamlined CRUD operations for car and engine details, reducing data entry time by 40% and minimizing data errors.",
      url: "",
      github_url: "https://github.com/mahakpatel/car-dealership-api",
      technologies: ["Go", "MySQL", "Postman", "AWS CloudWatch"],
      featured: true,
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 3,
      name: "Online Salon Management System",
      description: "Devised a robust Online Salon Management System to optimize appointment scheduling, leading to a 40% increase in customer bookings and a 25% reduction in no-shows. Designed a seamless online booking system with user/admin dashboards and integrated online payments, streamlining scheduling and reducing manual data entry by 50%.",
      url: "",
      github_url: "https://github.com/mahakpatel/salon-management",
      technologies: ["Python", "Django", "MySQL", "HTML", "CSS", "PostgreSQL"],
      featured: true,
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 4,
      name: "Wallpaper App",
      description: "Developed a Flutter mobile application that integrates with Unsplash API to provide high-quality wallpapers. Features include categorized wallpaper browsing, search functionality, and local saving capabilities for offline access.",
      url: "",
      github_url: "https://github.com/MahakPatel/Wallpaper_App",
      technologies: ["Flutter", "Dart", "Unsplash API", "Mobile Development", "REST API"],
      featured: true,
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 5,
      name: "News App",
      description: "Created a Flutter news application that fetches real-time news from News API. Includes categorized news sections, top headlines, search functionality, and social sharing features for seamless news consumption.",
      url: "",
      github_url: "https://github.com/MahakPatel/News_App",
      technologies: ["Flutter", "Dart", "News API", "Mobile Development", "Social Sharing"],
      featured: true,
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 6,
      name: "Restaurant Billing System",
      description: "Built a Python-based billing system for restaurant management. Features include item quantity input, automatic GST calculation, total bill computation, and integrated calculator functionality for efficient order processing.",
      url: "",
      github_url: "https://github.com/MahakPatel/Restaurant-Billing-System",
      technologies: ["Python", "GUI Development", "Mathematical Calculations", "GST Integration", "Calculator"],
      featured: true,
      created_at: "2024-01-01T00:00:00Z"
    }
  ];

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
            My Projects
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
            A collection of my work, from personal projects to professional applications.
            Each project represents a learning journey and a step forward in my development career.
          </p>
        </motion.div>

        <div className="grid grid-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
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
              whileTap={{ scale: 0.95 }}
            >
              {/* Project Image */}
              <div style={{
                aspectRatio: '16/9',
                borderRadius: '8px',
                marginBottom: '24px',
                overflow: 'hidden',
                position: 'relative',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))'
              }}>
                {project.id === 1 && (
                  <img 
                    src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=281&fit=crop&crop=center" 
                    alt="Lane Detection Project"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
                {project.id === 2 && (
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=281&fit=crop&crop=center" 
                    alt="Car Dealership API"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
                {project.id === 3 && (
                  <img 
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&h=281&fit=crop&crop=center" 
                    alt="Salon Management System"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
                {project.id === 4 && (
                  <img 
                    src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=281&fit=crop&crop=center" 
                    alt="Wallpaper App"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
                {project.id === 5 && (
                  <img 
                    src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500&h=281&fit=crop&crop=center" 
                    alt="News App"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
                {project.id === 6 && (
                  <img 
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=281&fit=crop&crop=center" 
                    alt="Restaurant Billing System"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
                {/* Overlay with project icon */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  color: 'white'
                }}>
                  {project.id === 1 && '🚗'}
                  {project.id === 2 && '🚙'}
                  {project.id === 3 && '💇‍♀️'}
                  {project.id === 4 && '📱'}
                  {project.id === 5 && '📰'}
                  {project.id === 6 && '🍽️'}
                </div>
                {/* Gradient overlay for better text readability */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '60px',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
                }} />
              </div>

              {/* Project Info */}
              <div style={{ marginBottom: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white' }}>
                    {project.name}
                  </h3>
                  {project.featured && (
                    <span style={{
                      padding: '4px 8px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      fontSize: '12px',
                      borderRadius: '12px'
                    }}>
                      Featured
                    </span>
                  )}
                </div>

                <p style={{ color: '#9ca3af', lineHeight: '1.5', marginBottom: '16px', textAlign: 'justify', fontSize: '13px' }}>
                  {project.description}
                </p>

                {/* Technologies */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {project.technologies.map((tech) => (
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

                {/* Project Links */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '8px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: '#9ca3af',
                          textDecoration: 'none',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.background = 'rgba(59, 130, 246, 0.2)';
                          (e.target as HTMLElement).style.color = '#3b82f6';
                          (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
                          (e.target as HTMLElement).style.color = '#9ca3af';
                          (e.target as HTMLElement).style.transform = 'translateY(0)';
                        }}
                        title="View Source Code"
                      >
                        <Github style={{ width: '20px', height: '20px' }} />
                      </a>
                    )}
                    {project.id === 1 && (
                      <a
                        href="https://drive.google.com/drive/folders/1_xo8c1IxT0JMfihySAu_zLcUFjwKLYUP?dmr=1&ec=wgc-drive-globalnav-goto"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '8px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: '#9ca3af',
                          textDecoration: 'none',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px'
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.background = 'rgba(59, 130, 246, 0.2)';
                          (e.target as HTMLElement).style.color = '#3b82f6';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
                          (e.target as HTMLElement).style.color = '#9ca3af';
                        }}
                        title="Watch Demo Video"
                      >
                        ▶️ Demo
                      </a>
                    )}
                    {project.url && (
                      <a
                        href={project.url}
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
                        title="View Live Demo"
                      >
                        <ExternalLink style={{ width: '20px', height: '20px' }} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsSimple;
