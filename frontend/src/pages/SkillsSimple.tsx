import React from 'react';
import { motion } from 'framer-motion';
import { Code, Database, Cloud, Wrench, Palette, Globe } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../services/api';

const SkillsSimple: React.FC = () => {
  const { data: skills = [], isLoading, error } = useQuery({
    queryKey: ['skills'],
    queryFn: publicApi.getSkills,
    staleTime: 0, // Always fetch fresh data
    refetchInterval: 2000, // Auto-refresh every 2 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '1.125rem' }}>Loading skills...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
      }}>
        <div style={{ color: 'red', fontSize: '1.125rem' }}>Error loading skills data</div>
      </div>
    );
  }

  // Fallback data if API fails
  const fallbackSkills = [
    // Programming Languages
    { id: 1, name: "Go", category: "Programming Languages", level: 5, icon: "🐹", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 2, name: "Python", category: "Programming Languages", level: 5, icon: "🐍", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 3, name: "C/C++", category: "Programming Languages", level: 4, icon: "⚙️", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    
    // Frameworks & Libraries
    { id: 4, name: "Django", category: "Frameworks", level: 4, icon: "🎯", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 5, name: "Gin", category: "Frameworks", level: 4, icon: "🍸", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 6, name: "Gofr", category: "Frameworks", level: 4, icon: "🚀", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    
    // Databases
    { id: 7, name: "MySQL", category: "Databases", level: 5, icon: "🗄️", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 8, name: "PostgreSQL", category: "Databases", level: 5, icon: "🐘", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    
    // Cloud Platforms
    { id: 9, name: "AWS", category: "Cloud Platforms", level: 4, icon: "☁️", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 10, name: "Azure", category: "Cloud Platforms", level: 3, icon: "🔷", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    
    // DevOps
    { id: 11, name: "Docker", category: "DevOps", level: 4, icon: "🐳", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 12, name: "Kubernetes", category: "DevOps", level: 3, icon: "⚓", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    
    // Monitoring
    { id: 13, name: "Prometheus", category: "Monitoring", level: 3, icon: "📊", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 14, name: "Grafana", category: "Monitoring", level: 3, icon: "📈", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    
    // Additional Tools & Technologies
    { id: 15, name: "Postman", category: "Tools", level: 4, icon: "📮", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 16, name: "Git", category: "Tools", level: 5, icon: "📝", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 17, name: "GitHub Actions", category: "Tools", level: 4, icon: "⚡", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 20, name: "Swagger", category: "Tools", level: 4, icon: "📋", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 18, name: "REST API", category: "Web Technologies", level: 5, icon: "🌐", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 19, name: "Kafka", category: "Message Queues", level: 3, icon: "📨", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" }
  ];

  // Use API data if available, otherwise fallback to hardcoded data
  const displaySkills = skills && skills.length > 0 ? skills : fallbackSkills;

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'programming languages':
        return <Code style={{ width: '24px', height: '24px' }} />;
      case 'frameworks':
        return <Wrench style={{ width: '24px', height: '24px' }} />;
      case 'databases':
        return <Database style={{ width: '24px', height: '24px' }} />;
      case 'cloud platforms':
        return <Cloud style={{ width: '24px', height: '24px' }} />;
      case 'devops':
        return <Wrench style={{ width: '24px', height: '24px' }} />;
      case 'monitoring':
        return <Database style={{ width: '24px', height: '24px' }} />;
      case 'tools':
        return <Wrench style={{ width: '24px', height: '24px' }} />;
      case 'web technologies':
        return <Globe style={{ width: '24px', height: '24px' }} />;
      case 'message queues':
        return <Database style={{ width: '24px', height: '24px' }} />;
      default:
        return <Code style={{ width: '24px', height: '24px' }} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'programming languages':
        return 'linear-gradient(45deg, #3b82f6, #1d4ed8)'; // Blue
      case 'backend':
        return 'linear-gradient(45deg, #ef4444, #dc2626)'; // Red
      case 'databases':
        return 'linear-gradient(45deg, #8b5cf6, #7c3aed)'; // Purple
      case 'frontend':
        return 'linear-gradient(45deg, #10b981, #059669)'; // Green
      case 'cloud':
        return 'linear-gradient(45deg, #ec4899, #db2777)'; // Pink
      case 'devops':
        return 'linear-gradient(45deg, #f59e0b, #d97706)'; // Orange
      case 'tools':
        return 'linear-gradient(45deg, #14b8a6, #0d9488)'; // Teal
      case 'frameworks':
        return 'linear-gradient(45deg, #10b981, #059669)'; // Green (same as frontend)
      case 'cloud platforms':
        return 'linear-gradient(45deg, #ec4899, #db2777)'; // Pink (same as cloud)
      case 'monitoring':
        return 'linear-gradient(45deg, #06b6d4, #0891b2)'; // Cyan
      case 'web technologies':
        return 'linear-gradient(45deg, #06b6d4, #0891b2)'; // Cyan
      case 'message queues':
        return 'linear-gradient(45deg, #8b5cf6, #7c3aed)'; // Purple
      default:
        return 'linear-gradient(45deg, #6b7280, #4b5563)'; // Gray
    }
  };

  const groupedSkills = displaySkills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  // Define the order for categories
  const categoryOrder = [
    'Programming Languages',
    'Backend',
    'Databases', 
    'Frontend',
    'Cloud',
    'DevOps',
    'Tools'
  ];

  // Sort categories according to the specified order
  const sortedCategories = Object.keys(groupedSkills).sort((a, b) => {
    const indexA = categoryOrder.findIndex(cat => cat.toLowerCase() === a.toLowerCase());
    const indexB = categoryOrder.findIndex(cat => cat.toLowerCase() === b.toLowerCase());
    
    // If both categories are in the order list, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    // If only one is in the order list, prioritize it
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    // If neither is in the order list, sort alphabetically
    return a.localeCompare(b);
  });

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
            Skills & Technologies
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
            A comprehensive overview of my technical skills and expertise across different domains.
            I'm always learning and expanding my knowledge base.
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {sortedCategories.map((category, categoryIndex) => {
            const categorySkills = groupedSkills[category];
            return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
          whileHover={{ 
            rotateY: 3,
            boxShadow: '0 15px 30px rgba(16, 185, 129, 0.3)',
            background: 'rgba(16, 185, 129, 0.05)',
            borderColor: 'rgba(16, 185, 129, 0.3)',
            transition: { duration: 0.3, ease: "easeOut" }
          }}
              style={{ cursor: 'pointer', borderRadius: '16px', padding: '24px' }}
            >
              {/* Category Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <div style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: getCategoryColor(category),
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getCategoryIcon(category)}
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'white', textTransform: 'capitalize' }}>
                  {category}
                </h2>
              </div>

              {/* Skills Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '24px'
              }}>
                {categorySkills.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="card"
                    style={{ textAlign: 'center', cursor: 'pointer' }}
                whileHover={{ 
                  rotateY: 3,
                  boxShadow: '0 15px 30px rgba(16, 185, 129, 0.3)',
                  background: 'rgba(16, 185, 129, 0.05)',
                  borderColor: 'rgba(16, 185, 129, 0.3)',
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                      <div style={{ fontSize: '32px' }}>{skill.icon}</div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '8px' }}>
                          {skill.name}
                        </h3>
                      </div>
                    </div>

                    {/* Skill Level */}
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>
                        <span>Proficiency</span>
                        <span>{skill.level}/100</span>
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            style={{
                              height: '8px',
                              flex: 1,
                              borderRadius: '4px',
                              background: (i + 1) * 10 <= skill.level ? getCategoryColor(category) : '#374151'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkillsSimple;
