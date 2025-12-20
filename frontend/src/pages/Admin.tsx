import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Settings, Github, BarChart3, LogOut, Users, Eye, TrendingUp, 
  Plus, Edit, X, Trash2,
  Briefcase, GraduationCap, BookOpen, Mail, Code, Award, Heart, Quote
} from 'lucide-react';
import { adminApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import CareerKnowledgeGraph from '../components/CareerKnowledgeGraph';
import { useAuth } from '../contexts/AuthContext';
import { fetchPortfolioData, getMockPortfolioData } from '../services/portfolioData';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [githubUsername, setGithubUsername] = useState('');
  const [realTimeStats, setRealTimeStats] = useState({
    active_users: 0,
    page_views_last_hour: 0,
    unique_visitors_today: 0
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();
  const modalTitles: Record<string, string> = {
    experience: 'Experience',
    education: 'Education',
    publication: 'Publication',
    skill: 'Skill',
    certification: 'Certification',
    volunteer: 'Volunteer Experience',
    project: 'Project',
    testimonial: 'Client Testimonial',
  };

  // Fetch analytics data (with error handling)
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      try {
        const res = await fetch('http://localhost:8080/api/v1/admin/analytics');
        if (!res.ok) throw new Error('Analytics unavailable');
        return res.json();
      } catch (error) {
        console.log('Analytics not available, using defaults');
        return null;
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: false, // Don't retry on failure
  });

  // Fetch content data (with auto-refresh every 3 seconds)
  const { data: experiences } = useQuery({
    queryKey: ['admin-experiences'],
    queryFn: () => fetch('http://localhost:5000/api/v1/experience').then(res => res.json()),
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 2000, // Auto-refresh every 2 seconds
  });

  const { data: volunteerExperiences } = useQuery({
    queryKey: ['admin-volunteer-experiences'],
    queryFn: () => fetch('http://localhost:5000/api/v1/volunteer-experiences').then(res => res.json()),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 3000,
  });

  const { data: education } = useQuery({
    queryKey: ['admin-education'],
    queryFn: () => fetch('http://localhost:5000/api/v1/education').then(res => res.json()),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 3000,
  });

  const { data: certifications } = useQuery({
    queryKey: ['admin-certifications'],
    queryFn: () => fetch('http://localhost:5000/api/v1/certifications').then(res => res.json()),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 3000,
  });

  const { data: skills} = useQuery({
    queryKey: ['admin-skills'],
    queryFn: () => fetch('http://localhost:5000/api/v1/skills').then(res => res.json()),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 3000,
  });

  const { data: publications } = useQuery({
    queryKey: ['admin-publications'],
    queryFn: () => fetch('http://localhost:5000/api/v1/publications').then(res => res.json()),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 3000,
  });

  const { data: projects } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: () => fetch('http://localhost:5000/api/v1/projects').then(res => res.json()),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 3000,
  });

  const { data: testimonials } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => fetch('http://localhost:5000/api/v1/testimonials').then(res => res.json()),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 3000,
  });

  const { data: messages } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: adminApi.getContactMessages,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Fetch real-time stats (with error handling)
  const { data: realTimeData } = useQuery({
    queryKey: ['realTimeStats'],
    queryFn: async () => {
      try {
        const res = await fetch('http://localhost:8080/api/v1/admin/analytics/realtime');
        if (!res.ok) throw new Error('Realtime stats unavailable');
        return res.json();
      } catch (error) {
        return { active_users: 0, page_views_last_hour: 0, unique_visitors_today: 0 };
      }
    },
    refetchInterval: 5000, // Refresh every 5 seconds
    retry: false,
  });

  // Update real-time stats
  useEffect(() => {
    if (realTimeData) {
      setRealTimeStats(realTimeData);
    }
  }, [realTimeData]);

  const syncGitHubMutation = useMutation({
    mutationFn: adminApi.syncGitHubProjects,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      setGithubUsername('');
    },
  });

  // Delete mutations
  const deleteExperienceMutation = useMutation({
    mutationFn: adminApi.deleteExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiences'] });
    },
  });

  const deleteEducationMutation = useMutation({
    mutationFn: adminApi.deleteEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-education'] });
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: adminApi.deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
    },
  });

  const deletePublicationMutation = useMutation({
    mutationFn: adminApi.deletePublication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-publications'] });
    },
  });

  const deleteCertificationMutation = useMutation({
    mutationFn: adminApi.deleteCertification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-certifications'] });
    },
  });

  const deleteVolunteerMutation = useMutation({
    mutationFn: adminApi.deleteVolunteerExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-volunteer-experiences'] });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: adminApi.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
    },
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: adminApi.deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
    },
  });

  const handleDelete = (type: string, id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      switch (type) {
        case 'experience':
          deleteExperienceMutation.mutate(id);
          break;
        case 'education':
          deleteEducationMutation.mutate(id);
          break;
        case 'skill':
          deleteSkillMutation.mutate(id);
          break;
        case 'publication':
          deletePublicationMutation.mutate(id);
          break;
        case 'certification':
          deleteCertificationMutation.mutate(id);
          break;
        case 'volunteer':
          deleteVolunteerMutation.mutate(id);
          break;
      case 'project':
        deleteProjectMutation.mutate(id);
        break;
      case 'testimonial':
        deleteTestimonialMutation.mutate(id);
        break;
      }
    }
  };

  // Create/Update mutations
  const createExperienceMutation = useMutation({
    mutationFn: adminApi.createExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiences'] });
      handleCloseModal();
    },
  });

  const updateExperienceMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => adminApi.updateExperience(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiences'] });
      handleCloseModal();
    },
    onError: (error) => {
      console.error('Update experience error:', error);
      alert('Failed to update experience: ' + (error as Error).message);
    },
  });

  const createEducationMutation = useMutation({
    mutationFn: adminApi.createEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-education'] });
      handleCloseModal();
    },
  });

  const updateEducationMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => adminApi.updateEducation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-education'] });
      handleCloseModal();
    },
    onError: (error) => {
      console.error('Update education error:', error);
      alert('Failed to update education: ' + (error as Error).message);
    },
  });

  const createSkillMutation = useMutation({
    mutationFn: adminApi.createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
      handleCloseModal();
    },
  });

  const updateSkillMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => adminApi.updateSkill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
      handleCloseModal();
    },
  });

  const createPublicationMutation = useMutation({
    mutationFn: adminApi.createPublication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-publications'] });
      handleCloseModal();
    },
  });

  const updatePublicationMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => adminApi.updatePublication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-publications'] });
      handleCloseModal();
    },
  });

  const createCertificationMutation = useMutation({
    mutationFn: adminApi.createCertification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-certifications'] });
      handleCloseModal();
    },
  });

  const updateCertificationMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => adminApi.updateCertification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-certifications'] });
      handleCloseModal();
    },
  });

  const createVolunteerMutation = useMutation({
    mutationFn: adminApi.createVolunteerExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-volunteer-experiences'] });
      handleCloseModal();
    },
  });

  const updateVolunteerMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => adminApi.updateVolunteerExperience(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-volunteer-experiences'] });
      handleCloseModal();
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: adminApi.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      handleCloseModal();
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => adminApi.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      handleCloseModal();
    },
  });

  const createTestimonialMutation = useMutation({
    mutationFn: adminApi.createTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      handleCloseModal();
    },
  });

  const updateTestimonialMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => adminApi.updateTestimonial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      handleCloseModal();
    },
  });

  const markMessageAsReadMutation = useMutation({
    mutationFn: adminApi.markMessageAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
    },
  });

  const handleSave = () => {
    const formData = collectFormData();
    console.log('Form data collected:', formData);
    console.log('Editing item:', editingItem);
    console.log('Modal type:', modalType);
    
    if (editingItem && editingItem.id) {
      // Update existing
      console.log('Updating existing item with ID:', editingItem.id);
      switch (modalType) {
        case 'experience':
          console.log('Sending experience update:', { id: editingItem.id, data: formData });
          updateExperienceMutation.mutate({ id: editingItem.id, data: formData });
          break;
        case 'education':
          console.log('Sending education update:', { id: editingItem.id, data: formData });
          updateEducationMutation.mutate({ id: editingItem.id, data: formData });
          break;
        case 'skill':
          console.log('Sending skill update:', { id: editingItem.id, data: formData });
          updateSkillMutation.mutate({ id: editingItem.id, data: formData });
          break;
        case 'publication':
          console.log('Sending publication update:', { id: editingItem.id, data: formData });
          updatePublicationMutation.mutate({ id: editingItem.id, data: formData });
          break;
        case 'certification':
          console.log('Sending certification update:', { id: editingItem.id, data: formData });
          updateCertificationMutation.mutate({ id: editingItem.id, data: formData });
          break;
        case 'volunteer':
          console.log('Sending volunteer update:', { id: editingItem.id, data: formData });
          updateVolunteerMutation.mutate({ id: editingItem.id, data: formData });
          break;
        case 'project':
          console.log('Sending project update:', { id: editingItem.id, data: formData });
          updateProjectMutation.mutate({ id: editingItem.id, data: formData });
          break;
        case 'testimonial':
          console.log('Sending testimonial update:', { id: editingItem.id, data: formData });
          updateTestimonialMutation.mutate({ id: editingItem.id, data: formData });
          break;
      }
    } else {
      // Create new
      console.log('Creating new item');
      switch (modalType) {
        case 'experience':
          console.log('Sending experience create:', formData);
          createExperienceMutation.mutate(formData);
          break;
        case 'education':
          console.log('Sending education create:', formData);
          createEducationMutation.mutate(formData);
          break;
        case 'skill':
          console.log('Sending skill create:', formData);
          createSkillMutation.mutate(formData);
          break;
        case 'publication':
          console.log('Sending publication create:', formData);
          createPublicationMutation.mutate(formData);
          break;
        case 'certification':
          console.log('Sending certification create:', formData);
          createCertificationMutation.mutate(formData);
          break;
        case 'volunteer':
          console.log('Sending volunteer create:', formData);
          createVolunteerMutation.mutate(formData);
          break;
        case 'project':
          console.log('Sending project create:', formData);
          createProjectMutation.mutate(formData);
          break;
        case 'testimonial':
          console.log('Sending testimonial create:', formData);
          createTestimonialMutation.mutate(formData);
          break;
      }
    }
  };

  // Fetch portfolio data for knowledge graph
  const { data: portfolioData, isLoading: portfolioLoading } = useQuery({
    queryKey: ['portfolio-data'],
    queryFn: fetchPortfolioData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleGitHubSync = () => {
    if (githubUsername.trim()) {
      syncGitHubMutation.mutate(githubUsername.trim());
    }
  };

  const handleAddNew = (type: string) => {
    setModalType(type);
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (type: string, item: any) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
  };

  const handleMarkAsRead = (messageId: number) => {
    markMessageAsReadMutation.mutate(messageId);
  };

  const collectFormData = () => {
    const form = document.querySelector('.modal-form');
    if (!form) return {};

    const data: any = {};
    
    // Collect all form inputs
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach((input: any) => {
      if (input.name) {
        if (input.type === 'checkbox') {
          data[input.name] = input.checked;
        } else if (input.type === 'range') {
          data[input.name] = parseInt(input.value);
        } else {
          data[input.name] = input.value;
        }
      }
    });

    // Format data based on modal type
    switch (modalType) {
      case 'experience':
        return {
          company: data.company || '',
          position: data.position || '',
          location: data.location || '',
          start_date: data.start_date || '',
          end_date: data.end_date || '',
          current: data.current || false,
          description: data.description || '',
          technologies: data.technologies ? data.technologies.split(',').map((t: string) => t.trim()) : []
        };
      case 'education':
        return {
          institution: data.institution || '',
          degree: data.degree || '',
          field: data.field || '',
          start_date: data.start_date || '',
          end_date: data.end_date || '',
          gpa: data.gpa ? parseFloat(data.gpa) : null,
          description: data.description || ''
        };
      case 'publication':
        return {
          title: data.title || '',
          authors: data.authors || '',
          journal: data.journal || '',
          year: data.year ? parseInt(data.year) : null,
          doi: data.doi || '',
          url: data.url || '',
          description: data.description || ''
        };
      case 'skill':
        return {
          name: data.name || '',
          category: data.category || '',
          level: data.level || 3,
          icon: data.icon || ''
        };
      case 'certification':
        return {
          title: data.title || '',
          issuer: data.issuer || '',
          issue_date: data.issue_date || '',
          expiration_date: data.expiration_date || '',
          credential_id: data.credential_id || '',
          credential_url: data.credential_url || '',
          description: data.description || ''
        };
      case 'volunteer':
        return {
          organization: data.organization || '',
          role: data.role || '',
          location: data.location || '',
          start_date: data.start_date || '',
          end_date: data.end_date || '',
          current: data.current || false,
          description: data.description || '',
          technologies: data.technologies ? data.technologies.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0) : []
        };
      case 'project':
        return {
          name: data.name || '',
          description: data.description || '',
          url: data.url || '',
          github_url: data.github_url || '',
          image_url: data.image_url || '',
          technologies: data.technologies ? data.technologies.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0) : [],
          featured: !!data.featured
        };
      case 'testimonial': {
        const ratingValue = data.rating ? parseInt(data.rating, 10) : 5;
        return {
          name: data.name || '',
          role: data.role || '',
          company: data.company || '',
          content: data.content || '',
          rating: Number.isNaN(ratingValue) ? 5 : Math.min(Math.max(ratingValue, 1), 5),
          avatar_url: data.avatar_url || '',
          company_logo_url: data.company_logo_url || ''
        };
      }
      default:
        return data;
    }
  };

  // Removed blocking loading spinner - let content load independently

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'content', label: 'Content', icon: Edit },
    { id: 'projects', label: 'Projects', icon: Github },
    { id: 'testimonials', label: 'Testimonials', icon: Quote },
    { id: 'knowledge-graph', label: 'Knowledge Graph', icon: Code },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', paddingTop: '80px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px' }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: '32px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '700', background: 'linear-gradient(135deg, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
                Admin Dashboard
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Manage your portfolio content and monitor analytics</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
                <span style={{ color: '#10b981', fontSize: '12px', fontWeight: '500' }}>
                  {realTimeStats.active_users} Active Users
                </span>
              </div>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>
                Welcome, <strong style={{ color: '#e2e8f0' }}>{user}</strong>
              </span>
              <motion.button
                onClick={logout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  color: '#fca5a5',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <LogOut size={16} />
                Logout
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '32px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '4px' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: activeTab === tab.id ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                  color: activeTab === tab.id ? '#10b981' : '#94a3b8',
                  border: activeTab === tab.id ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent'
                }}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'analytics' && (
            <div>
              {/* Real-time Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Users style={{ color: '#10b981' }} size={24} />
                    <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '500' }}>ACTIVE NOW</span>
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#10b981', marginBottom: '8px' }}>
                    {realTimeStats.active_users}
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '14px' }}>Users browsing right now</div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Eye style={{ color: '#3b82f6' }} size={24} />
                    <span style={{ color: '#3b82f6', fontSize: '14px', fontWeight: '500' }}>TODAY</span>
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#3b82f6', marginBottom: '8px' }}>
                    {realTimeStats.unique_visitors_today}
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '14px' }}>Unique visitors today</div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                    <TrendingUp style={{ color: '#f59e0b' }} size={24} />
                    <span style={{ color: '#f59e0b', fontSize: '14px', fontWeight: '500' }}>LAST HOUR</span>
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#f59e0b', marginBottom: '8px' }}>
                    {realTimeStats.page_views_last_hour}
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '14px' }}>Page views in last hour</div>
                </motion.div>
              </div>

              {/* Analytics Summary */}
              {analytics && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
                      📊 Total Statistics
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#9ca3af' }}>Total Visitors</span>
                        <span style={{ color: '#10b981', fontWeight: '600' }}>{analytics.total_visitors || 0}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#9ca3af' }}>Total Page Views</span>
                        <span style={{ color: '#3b82f6', fontWeight: '600' }}>{analytics.total_page_views || 0}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#9ca3af' }}>This Week</span>
                        <span style={{ color: '#f59e0b', fontWeight: '600' }}>{analytics.this_week_visitors || 0}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#9ca3af' }}>This Month</span>
                        <span style={{ color: '#8b5cf6', fontWeight: '600' }}>{analytics.this_month_visitors || 0}</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
                      🔥 Top Pages
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {analytics.top_pages && analytics.top_pages.length > 0 ? (
                        analytics.top_pages.slice(0, 5).map((page: any, index: number) => (
                          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#9ca3af', fontSize: '14px' }}>{page.page}</span>
                            <span style={{ color: '#10b981', fontWeight: '600', fontSize: '14px' }}>{page.views}</span>
                          </div>
                        ))
                      ) : (
                        <div style={{ color: '#9ca3af', fontSize: '14px' }}>No page data available</div>
                      )}
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'content' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Experience Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Briefcase style={{ color: '#10b981' }} size={24} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white' }}>Experience</h3>
                    <span style={{ 
                      padding: '4px 8px', 
                      background: 'rgba(16, 185, 129, 0.1)', 
                      borderRadius: '12px', 
                      color: '#10b981', 
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {experiences?.length || 0} entries
                    </span>
                </div>
                  <button 
                    onClick={() => handleAddNew('experience')}
                    style={{
                      padding: '8px 16px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '8px',
                      color: '#10b981',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Plus size={16} />
                    Add New
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {experiences && experiences.length > 0 ? (
                    experiences.map((exp: any) => (
                      <div 
                        key={exp.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', margin: 0 }}>
                              {exp.position}
                            </h4>
                            {exp.current && (
                              <span style={{
                                padding: '2px 8px',
                                background: 'rgba(16, 185, 129, 0.2)',
                                color: '#10b981',
                                fontSize: '10px',
                                borderRadius: '10px',
                                fontWeight: '600'
                              }}>
                                CURRENT
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '14px', color: '#3b82f6', margin: '0 0 8px 0' }}>
                            {exp.company} • {exp.location}
                          </p>
                          <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                            {new Date(exp.start_date).toLocaleDateString()} - {exp.current ? 'Present' : new Date(exp.end_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                            onClick={() => handleEdit('experience', exp)}
                    style={{
                              padding: '6px 12px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                              borderRadius: '6px',
                      color: '#3b82f6',
                      fontSize: '12px',
                      fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                    }}
                  >
                            <Edit size={14} />
                    Edit
                  </button>
                          <button 
                            onClick={() => handleDelete('experience', exp.id, exp.position)}
                            style={{
                              padding: '6px 12px',
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '6px',
                              color: '#ef4444',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Trash2 size={14} />
                            Delete
                  </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
                      No experience entries yet. Click "Add New" to create one.
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Volunteer Experience Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Heart style={{ color: '#f472b6' }} size={24} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white' }}>Volunteer Experience</h3>
                    <span style={{
                      padding: '4px 8px',
                      background: 'rgba(244, 114, 182, 0.1)',
                      borderRadius: '12px',
                      color: '#f472b6',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {volunteerExperiences?.length || 0} entries
                    </span>
                </div>
                  <button
                    onClick={() => handleAddNew('volunteer')}
                    style={{
                      padding: '8px 16px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '8px',
                      color: '#10b981',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Plus size={16} />
                    Add New
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {volunteerExperiences && volunteerExperiences.length > 0 ? (
                    volunteerExperiences.map((vol: any) => (
                      <div
                        key={vol.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '16px'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', margin: 0 }}>
                              {vol.role}
                            </h4>
                            {vol.current && (
                              <span style={{
                                padding: '2px 8px',
                                background: 'rgba(16, 185, 129, 0.2)',
                                color: '#10b981',
                                fontSize: '10px',
                                borderRadius: '10px',
                                fontWeight: '600'
                              }}>
                                CURRENT
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '14px', color: '#f472b6', margin: '0 0 8px 0' }}>
                            {vol.organization}{vol.location ? ` • ${vol.location}` : ''}
                          </p>
                          <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                            {new Date(vol.start_date).toLocaleDateString()} - {vol.current ? 'Present' : (vol.end_date ? new Date(vol.end_date).toLocaleDateString() : 'Completed')}
                          </p>
                          {vol.technologies && vol.technologies.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                              {vol.technologies.map((tech: string) => (
                                <span
                                  key={tech}
                                  style={{
                                    padding: '4px 8px',
                                    background: 'rgba(244, 114, 182, 0.15)',
                                    color: '#f472b6',
                                    fontSize: '10px',
                                    borderRadius: '10px',
                                    fontWeight: '600'
                                  }}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleEdit('volunteer', vol)}
                            style={{
                              padding: '6px 12px',
                              background: 'rgba(59, 130, 246, 0.1)',
                              border: '1px solid rgba(59, 130, 246, 0.3)',
                              borderRadius: '6px',
                              color: '#3b82f6',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete('volunteer', vol.id, vol.role)}
                            style={{
                              padding: '6px 12px',
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '6px',
                              color: '#ef4444',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
                      No volunteer experience yet. Click "Add New" to create one.
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Education Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <GraduationCap style={{ color: '#3b82f6' }} size={24} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white' }}>Education</h3>
                    <span style={{ 
                      padding: '4px 8px', 
                      background: 'rgba(59, 130, 246, 0.1)', 
                      borderRadius: '12px', 
                      color: '#3b82f6', 
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {education?.length || 0} entries
                    </span>
                </div>
                  <button 
                    onClick={() => handleAddNew('education')}
                    style={{
                      padding: '8px 16px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '8px',
                      color: '#10b981',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Plus size={16} />
                    Add New
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {education && education.length > 0 ? (
                    education.map((edu: any) => (
                      <div 
                        key={edu.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', margin: '0 0 4px 0' }}>
                            {edu.degree}
                          </h4>
                          <p style={{ fontSize: '14px', color: '#3b82f6', margin: '0 0 8px 0' }}>
                            {edu.institution}
                          </p>
                          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#9ca3af' }}>
                            <span>{edu.field}</span>
                            {edu.gpa && <span>GPA: {edu.gpa}</span>}
                            <span>{new Date(edu.start_date).getFullYear()} - {new Date(edu.end_date).getFullYear()}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                            onClick={() => handleEdit('education', edu)}
                    style={{
                              padding: '6px 12px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                              borderRadius: '6px',
                      color: '#3b82f6',
                      fontSize: '12px',
                      fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                    }}
                  >
                            <Edit size={14} />
                    Edit
                  </button>
                          <button 
                            onClick={() => handleDelete('education', edu.id, edu.degree)}
                            style={{
                              padding: '6px 12px',
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '6px',
                              color: '#ef4444',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Trash2 size={14} />
                            Delete
                  </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
                      No education entries yet. Click "Add New" to create one.
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Certifications Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Award style={{ color: '#facc15' }} size={24} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white' }}>Certifications</h3>
                    <span style={{
                      padding: '4px 8px',
                      background: 'rgba(250, 204, 21, 0.1)',
                      borderRadius: '12px',
                      color: '#facc15',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {certifications?.length || 0} entries
                    </span>
                </div>
                  <button
                    onClick={() => handleAddNew('certification')}
                    style={{
                      padding: '8px 16px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '8px',
                      color: '#10b981',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Plus size={16} />
                    Add New
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {certifications && certifications.length > 0 ? (
                    certifications.map((cert: any) => (
                      <div
                        key={cert.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '16px'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', margin: '0 0 4px 0' }}>
                            {cert.title}
                          </h4>
                          <p style={{ fontSize: '14px', color: '#facc15', margin: '0 0 8px 0' }}>
                            {cert.issuer}
                          </p>
                          <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 8px 0' }}>
                            Issued {new Date(cert.issue_date).toLocaleDateString()} • {cert.expiration_date ? `Expires ${new Date(cert.expiration_date).toLocaleDateString()}` : 'No expiration'}
                          </p>
                          {(cert.credential_id || cert.credential_url) && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#9ca3af' }}>
                              {cert.credential_id && <span>Credential ID: <strong style={{ color: '#facc15' }}>{cert.credential_id}</strong></span>}
                              {cert.credential_url && (
                                <a
                                  href={cert.credential_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: '#3b82f6', textDecoration: 'underline' }}
                                >
                                  View credential
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleEdit('certification', cert)}
                            style={{
                              padding: '6px 12px',
                              background: 'rgba(59, 130, 246, 0.1)',
                              border: '1px solid rgba(59, 130, 246, 0.3)',
                              borderRadius: '6px',
                              color: '#3b82f6',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete('certification', cert.id, cert.title)}
                            style={{
                              padding: '6px 12px',
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '6px',
                              color: '#ef4444',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
                      No certifications yet. Click "Add New" to create one.
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Publications Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <BookOpen style={{ color: '#f59e0b' }} size={24} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white' }}>Publications</h3>
                    <span style={{ 
                      padding: '4px 8px', 
                      background: 'rgba(245, 158, 11, 0.1)', 
                      borderRadius: '12px', 
                      color: '#f59e0b', 
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {publications?.length || 0} entries
                    </span>
                </div>
                  <button 
                    onClick={() => handleAddNew('publication')}
                    style={{
                      padding: '8px 16px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '8px',
                      color: '#10b981',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Plus size={16} />
                    Add New
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {publications && publications.length > 0 ? (
                    publications.map((pub: any) => (
                      <div 
                        key={pub.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', margin: '0 0 4px 0' }}>
                            {pub.title}
                          </h4>
                          <p style={{ fontSize: '14px', color: '#f59e0b', margin: '0 0 8px 0' }}>
                            {pub.journal} • {pub.year}
                          </p>
                          <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                            {pub.authors}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                            onClick={() => handleEdit('publication', pub)}
                    style={{
                              padding: '6px 12px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                              borderRadius: '6px',
                      color: '#3b82f6',
                      fontSize: '12px',
                      fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                    }}
                  >
                            <Edit size={14} />
                    Edit
                  </button>
                          <button 
                            onClick={() => handleDelete('publication', pub.id, pub.title)}
                            style={{
                              padding: '6px 12px',
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '6px',
                              color: '#ef4444',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Trash2 size={14} />
                            Delete
                  </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
                      No publications yet. Click "Add New" to create one.
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Skills Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Code style={{ color: '#8b5cf6' }} size={24} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white' }}>Skills</h3>
                    <span style={{ 
                      padding: '4px 8px', 
                      background: 'rgba(139, 92, 246, 0.1)', 
                      borderRadius: '12px', 
                      color: '#8b5cf6', 
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {skills?.length || 0} entries
                    </span>
                </div>
                  <button 
                    onClick={() => handleAddNew('skill')}
                    style={{
                      padding: '8px 16px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '8px',
                      color: '#10b981',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Plus size={16} />
                    Add New
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
                  {skills && skills.length > 0 ? (
                    skills.map((skill: any) => (
                      <div 
                        key={skill.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'white', margin: '0 0 4px 0' }}>
                            {skill.name}
                          </h4>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', color: '#8b5cf6' }}>
                              {skill.category}
                            </span>
                            <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                              Level: {skill.level}/100
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                  <button 
                            onClick={() => handleEdit('skill', skill)}
                    style={{
                              padding: '4px 8px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                              borderRadius: '6px',
                      color: '#3b82f6',
                              fontSize: '11px',
                      fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                    }}
                  >
                            <Edit size={12} />
                    Edit
                  </button>
                          <button 
                            onClick={() => handleDelete('skill', skill.id, skill.name)}
                            style={{
                              padding: '4px 8px',
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '6px',
                              color: '#ef4444',
                              fontSize: '11px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Trash2 size={12} />
                            Delete
                  </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af', gridColumn: '1 / -1' }}>
                      No skills yet. Click "Add New" to create one.
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === 'projects' && (
            <>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                marginBottom: '24px'
              }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
                  GitHub Projects Sync
                </h3>
                <p style={{ color: '#9ca3af', marginBottom: '24px' }}>
                  Automatically fetch and sync your GitHub repositories to your portfolio.
                </p>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    placeholder="Enter GitHub Username"
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px'
                    }}
                  />
                  <motion.button
                    onClick={handleGitHubSync}
                    disabled={syncGitHubMutation.isPending || !githubUsername.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 20px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '8px',
                      color: '#10b981',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      opacity: syncGitHubMutation.isPending || !githubUsername.trim() ? 0.5 : 1
                    }}
                  >
                    {syncGitHubMutation.isPending ? (
                      <>
                        <LoadingSpinner />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <Github size={16} />
                        Sync Projects
                      </>
                    )}
                  </motion.button>
                </div>
                {syncGitHubMutation.isSuccess && (
                  <p style={{ color: '#10b981', marginTop: '12px', fontSize: '14px' }}>
                    GitHub projects synced successfully!
                  </p>
                )}
                {syncGitHubMutation.isError && (
                  <p style={{ color: '#ef4444', marginTop: '12px', fontSize: '14px' }}>
                    Error syncing GitHub projects: {syncGitHubMutation.error?.message}
                  </p>
                )}
              </div>

              <motion.div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Code style={{ color: '#60a5fa' }} size={24} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white' }}>Projects</h3>
                    <span style={{
                      padding: '4px 8px',
                      background: 'rgba(96, 165, 250, 0.1)',
                      borderRadius: '12px',
                      color: '#60a5fa',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {projects?.length || 0} entries
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddNew('project')}
                    style={{
                      padding: '8px 16px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      color: '#3b82f6',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Plus size={16} />
                    Add New
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {projects && projects.length > 0 ? (
                    projects.map((project: any) => (
                      <div
                        key={project.id}
                        style={{
                          background: 'rgba(15, 23, 42, 0.6)',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '16px'
                        }}
                      >
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', margin: 0 }}>
                              {project.name}
                            </h4>
                            {project.featured && (
                              <span style={{
                                padding: '4px 8px',
                                background: 'rgba(16, 185, 129, 0.15)',
                                borderRadius: '999px',
                                color: '#10b981',
                                fontSize: '11px',
                                fontWeight: '600'
                              }}>
                                Featured
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '0.95rem', color: '#cbd5f5', margin: 0 }}>
                            {project.description}
                          </p>
                          {project.technologies && project.technologies.length > 0 && (
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {project.technologies.map((tech: string, idx: number) => (
                                <span
                                  key={`${project.id}-tech-${idx}`}
                                  style={{
                                    padding: '4px 8px',
                                    background: 'rgba(59, 130, 246, 0.12)',
                                    borderRadius: '999px',
                                    color: '#60a5fa',
                                    fontSize: '11px',
                                    fontWeight: '500'
                                  }}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '12px' }}>
                            {project.github_url && (
                              <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#93c5fd', textDecoration: 'underline' }}
                              >
                                GitHub
                              </a>
                            )}
                            {project.url && (
                              <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#93c5fd', textDecoration: 'underline' }}
                              >
                                Live Demo
                              </a>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleEdit('project', project)}
                            style={{
                              padding: '6px 12px',
                              background: 'rgba(59, 130, 246, 0.1)',
                              border: '1px solid rgba(59, 130, 246, 0.3)',
                              borderRadius: '6px',
                              color: '#3b82f6',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete('project', project.id, project.name)}
                            style={{
                              padding: '6px 12px',
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '6px',
                              color: '#ef4444',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
                      No projects yet. Click "Add New" to create one.
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}

          {activeTab === 'testimonials' && (
            <motion.div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Quote style={{ color: '#f472b6' }} size={24} />
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white' }}>Client Testimonials</h3>
                  <span style={{
                    padding: '4px 8px',
                    background: 'rgba(244, 114, 182, 0.12)',
                    borderRadius: '12px',
                    color: '#f472b6',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {testimonials?.length || 0} entries
                  </span>
                </div>
                <button
                  onClick={() => handleAddNew('testimonial')}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(244, 114, 182, 0.12)',
                    border: '1px solid rgba(244, 114, 182, 0.3)',
                    borderRadius: '8px',
                    color: '#f472b6',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={16} />
                  Add New
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {testimonials && testimonials.length > 0 ? (
                  testimonials.map((testimonial: any) => (
                    <div
                      key={testimonial.id}
                      style={{
                        background: 'rgba(15, 23, 42, 0.6)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                        {(testimonial.company_logo_url || testimonial.avatar_url) && (
                          <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: testimonial.company_logo_url ? '12px' : '50%',
                            overflow: 'hidden',
                            border: '3px solid rgba(244, 114, 182, 0.3)',
                            background: testimonial.company_logo_url ? 'white' : 'transparent',
                            padding: testimonial.company_logo_url ? '6px' : '0'
                          }}>
                            <img
                              src={testimonial.company_logo_url || testimonial.avatar_url}
                              alt={testimonial.company_logo_url ? `${testimonial.company} logo` : testimonial.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'white', margin: 0 }}>
                              {testimonial.name}
                            </h4>
                            <span style={{
                              padding: '4px 8px',
                              background: 'rgba(244, 114, 182, 0.1)',
                              borderRadius: '999px',
                              color: '#f472b6',
                              fontSize: '11px',
                              fontWeight: '600'
                            }}>
                              {testimonial.rating || 5}★
                            </span>
                          </div>
                          <p style={{ fontSize: '0.9rem', color: '#e5e7eb', margin: 0 }}>
                            {testimonial.role} • {testimonial.company}
                          </p>
                          <p style={{ fontSize: '0.95rem', color: '#cbd5f5', margin: 0, fontStyle: 'italic' }}>
                            "{testimonial.content}"
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEdit('testimonial', testimonial)}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '6px',
                            color: '#3b82f6',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete('testimonial', testimonial.id, testimonial.name)}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '6px',
                            color: '#ef4444',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
                    No testimonials yet. Click "Add New" to create one.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'knowledge-graph' && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              height: 'calc(100vh - 200px)',
              overflow: 'visible',
              minHeight: '600px'
            }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '8px' }}>
                  Career Knowledge Graph
                </h3>
                <p style={{ color: '#9ca3af', marginBottom: '16px' }}>
                  Explore the interconnected relationships between your skills, projects, roles, and publications.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '6px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                    <div style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%' }}></div>
                    <span style={{ fontSize: '12px', color: '#3b82f6' }}>Skills</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                    <span style={{ fontSize: '12px', color: '#10b981' }}>Projects</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                    <div style={{ width: '8px', height: '8px', background: '#f59e0b', borderRadius: '50%' }}></div>
                    <span style={{ fontSize: '12px', color: '#f59e0b' }}>Roles</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '6px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                    <div style={{ width: '8px', height: '8px', background: '#8b5cf6', borderRadius: '50%' }}></div>
                    <span style={{ fontSize: '12px', color: '#8b5cf6' }}>Publications</span>
                  </div>
                </div>
              </div>
              
              {portfolioLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                  <LoadingSpinner />
                </div>
              ) : (
                <CareerKnowledgeGraph 
                  data={portfolioData || getMockPortfolioData()}
                />
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
                Contact Messages ({messages?.filter((msg: any) => !msg.read).length || 0} unread of {messages?.length || 0} total)
              </h3>
              <p style={{ color: '#9ca3af', marginBottom: '24px' }}>
                View and manage messages from your contact form.
              </p>
              
              {messages && messages.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {messages.map((message: any, index: number) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s ease'
                      }}
                      whileHover={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(16, 185, 129, 0.3)',
                        transition: { duration: 0.3 }
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'white', marginBottom: '4px' }}>
                            {message.name}
                          </h4>
                          <p style={{ fontSize: '14px', color: '#10b981', marginBottom: '8px' }}>
                            {message.email}
                          </p>
                          <p style={{ fontSize: '14px', color: '#9ca3af' }}>
                            {new Date(message.created_at).toLocaleString()}
                          </p>
              </div>
                        <button
                          onClick={() => handleMarkAsRead(message.id)}
                          disabled={message.read}
                          style={{
                            padding: '4px 8px',
                            background: message.read ? 'rgba(107, 114, 128, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                            borderRadius: '6px',
                            fontSize: '12px',
                            color: message.read ? '#9ca3af' : '#10b981',
                            border: `1px solid ${message.read ? 'rgba(107, 114, 128, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                            cursor: message.read ? 'default' : 'pointer',
                            transition: 'all 0.2s ease',
                            opacity: message.read ? 0.7 : 1
                          }}
                          onMouseEnter={(e) => {
                            if (!message.read) {
                              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.3)';
                              e.currentTarget.style.transform = 'scale(1.05)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!message.read) {
                              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)';
                              e.currentTarget.style.transform = 'scale(1)';
                            }
                          }}
                        >
                          {message.read ? 'Read' : 'Mark as Read'}
                        </button>
                      </div>
                      
                      <div style={{ marginBottom: '12px' }}>
                        <h5 style={{ fontSize: '16px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                          {message.subject}
                        </h5>
                        <p style={{ 
                          fontSize: '14px', 
                          color: '#94a3b8', 
                          lineHeight: '1.6',
                          background: 'rgba(255, 255, 255, 0.02)',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}>
                          {message.message}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px',
                  color: '#9ca3af' 
                }}>
                  <Mail style={{ width: '48px', height: '48px', margin: '0 auto 16px', opacity: 0.5 }} />
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#6b7280' }}>
                    No messages yet
                  </h4>
                  <p style={{ fontSize: '14px' }}>
                    Messages from your contact form will appear here when visitors reach out to you.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
                Portfolio Settings
              </h3>
              <p style={{ color: '#9ca3af', marginBottom: '24px' }}>
                Configure your portfolio information and preferences.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                    Portfolio Name
                  </label>
                  <input
                    type="text"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px'
                    }}
                    placeholder="Your portfolio name"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      resize: 'none'
                    }}
                    placeholder="Tell us about yourself"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '12px 24px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '8px',
                    color: '#10b981',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    alignSelf: 'flex-start'
                  }}
                >
                  Save Changes
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modal for adding/editing content */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              background: 'rgba(15, 23, 42, 0.95)',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white' }}>
                {editingItem ? `Edit ${modalTitles[modalType] || modalType}` : `Add New ${modalTitles[modalType] || modalType}`}
              </h2>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={24} />
              </button>
            </div>

            <form className="modal-form" style={{ color: '#94a3b8', marginBottom: '24px' }}>
              {/* Experience Form */}
              {modalType === 'experience' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Company *
                    </label>
                    <input
                      type="text"
                      name="company"
                      defaultValue={editingItem?.company || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Position *
                    </label>
                    <input
                      type="text"
                      name="position"
                      defaultValue={editingItem?.position || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                      placeholder="Enter job title"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      defaultValue={editingItem?.location || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                      placeholder="Enter location"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                        Start Date *
                      </label>
                      <input
                        type="date"
                        name="start_date"
                        defaultValue={editingItem?.start_date ? new Date(editingItem.start_date).toISOString().split('T')[0] : ''}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                        End Date
                      </label>
                      <input
                        type="date"
                        name="end_date"
                        defaultValue={editingItem?.end_date ? new Date(editingItem.end_date).toISOString().split('T')[0] : ''}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      <input type="checkbox" name="current" defaultChecked={editingItem?.current || false} />
                      Currently working here
                    </label>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Description *
                    </label>
                    <textarea
                      name="description"
                      rows={4}
                      defaultValue={editingItem?.description || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                        resize: 'none'
                      }}
                      placeholder="Describe your role and responsibilities"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Technologies (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="technologies"
                      defaultValue={editingItem?.technologies?.join(', ') || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                      placeholder="React, Node.js, Python, etc."
                    />
                  </div>
                </div>
              )}

              {/* Volunteer Experience Form */}
              {modalType === 'volunteer' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Organization *
                    </label>
                    <input
                      type="text"
                      name="organization"
                      defaultValue={editingItem?.organization || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                      placeholder="Enter organization name"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Role *
                    </label>
                    <input
                      type="text"
                      name="role"
                      defaultValue={editingItem?.role || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                      placeholder="Enter volunteer role"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      defaultValue={editingItem?.location || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                      placeholder="Enter location"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                        Start Date *
                      </label>
                      <input
                        type="date"
                        name="start_date"
                        defaultValue={editingItem?.start_date ? new Date(editingItem.start_date).toISOString().split('T')[0] : ''}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                        End Date
                      </label>
                      <input
                        type="date"
                        name="end_date"
                        defaultValue={editingItem?.end_date ? new Date(editingItem.end_date).toISOString().split('T')[0] : ''}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      <input type="checkbox" name="current" defaultChecked={editingItem?.current || false} />
                      Currently volunteering here
                    </label>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Description *
                    </label>
                    <textarea
                      name="description"
                      rows={4}
                      defaultValue={editingItem?.description || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                        resize: 'none'
                      }}
                      placeholder="Describe your volunteer work and impact"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Technologies / Skills (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="technologies"
                      defaultValue={editingItem?.technologies?.join(', ') || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                      placeholder="Community Engagement, Python, AWS, etc."
                    />
                  </div>
                </div>
              )}

              {/* Project Form */}
              {modalType === 'project' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Project Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingItem?.name || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                      placeholder="Enter project title"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Description *
                    </label>
                    <textarea
                      name="description"
                      rows={4}
                      defaultValue={editingItem?.description || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                        resize: 'none'
                      }}
                      placeholder="Describe the project impact, responsibilities, and outcomes"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                        Live URL
                      </label>
                      <input
                        type="url"
                        name="url"
                        defaultValue={editingItem?.url || ''}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        name="github_url"
                        defaultValue={editingItem?.github_url || ''}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        placeholder="https://github.com/username/repo"
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Image URL
                    </label>
                    <input
                      type="url"
                      name="image_url"
                      defaultValue={editingItem?.image_url || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                      placeholder="https://example.com/preview.png"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Technologies (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="technologies"
                      defaultValue={editingItem?.technologies?.join(', ') || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                      placeholder="Go, PostgreSQL, Docker"
                    />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: '#e2e8f0' }}>
                    <input type="checkbox" name="featured" defaultChecked={editingItem?.featured || false} />
                    Feature this project on the homepage
                  </label>
                </div>
              )}

              {/* Testimonial Form */}
              {modalType === 'testimonial' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Client Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingItem?.name || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                      placeholder="Enter client name"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                        Role / Title *
                      </label>
                      <input
                        type="text"
                        name="role"
                        defaultValue={editingItem?.role || ''}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        placeholder="e.g. Founder, Director"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                        Company / Organization *
                      </label>
                      <input
                        type="text"
                        name="company"
                        defaultValue={editingItem?.company || ''}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        placeholder="Enter client company"
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Testimonial *
                    </label>
                    <textarea
                      name="content"
                      rows={4}
                      defaultValue={editingItem?.content || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                        resize: 'none'
                      }}
                      placeholder="What did the client say about your work?"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                        Rating (1-5)
                      </label>
                      <input
                        type="number"
                        name="rating"
                        min={1}
                        max={5}
                        defaultValue={editingItem?.rating || 5}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                        Avatar URL
                      </label>
                      <input
                        type="url"
                        name="avatar_url"
                        defaultValue={editingItem?.avatar_url || ''}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        placeholder="https://images.example.com/avatar.jpg"
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Company Logo URL
                    </label>
                    <input
                      type="url"
                      name="company_logo_url"
                      defaultValue={editingItem?.company_logo_url || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                      placeholder="https://images.example.com/logo.png"
                    />
                  </div>
                </div>
              )}

              {/* Certification Form */}
              {modalType === 'certification' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Certification Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={editingItem?.title || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                      placeholder="e.g., AWS Certified Solutions Architect"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Issuer *
                    </label>
                    <input
                      type="text"
                      name="issuer"
                      defaultValue={editingItem?.issuer || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                      placeholder="Organization issuing the certification"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                        Issue Date *
                      </label>
                      <input
                        type="date"
                        name="issue_date"
                        defaultValue={editingItem?.issue_date ? new Date(editingItem.issue_date).toISOString().split('T')[0] : ''}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                        Expiration Date
                      </label>
                      <input
                        type="date"
                        name="expiration_date"
                        defaultValue={editingItem?.expiration_date ? new Date(editingItem.expiration_date).toISOString().split('T')[0] : ''}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                        Credential ID
                      </label>
                      <input
                        type="text"
                        name="credential_id"
                        defaultValue={editingItem?.credential_id || ''}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        placeholder="ID provided by issuer"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                        Credential URL
                      </label>
                      <input
                        type="url"
                        name="credential_url"
                        defaultValue={editingItem?.credential_url || ''}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        placeholder="https://"
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={4}
                      defaultValue={editingItem?.description || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                        resize: 'none'
                      }}
                      placeholder="Optional details about this certification"
                    />
                  </div>
                </div>
              )}

              {/* Education Form */}
              {modalType === 'education' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Institution *
                    </label>
                    <input
                      type="text"
                      name="institution"
                      defaultValue={editingItem?.institution || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                      placeholder="Enter institution name"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                        Degree *
                      </label>
                      <input
                        type="text"
                        name="degree"
                        defaultValue={editingItem?.degree || ''}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        placeholder="e.g., Bachelor of Science"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                        Field of Study *
                      </label>
                      <input
                        type="text"
                        name="field"
                        defaultValue={editingItem?.field || ''}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                        Start Date *
                      </label>
                      <input
                        type="date"
                        name="start_date"
                        defaultValue={editingItem?.start_date ? new Date(editingItem.start_date).toISOString().split('T')[0] : ''}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                        End Date
                      </label>
                      <input
                        type="date"
                        name="end_date"
                        defaultValue={editingItem?.end_date ? new Date(editingItem.end_date).toISOString().split('T')[0] : ''}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      GPA
                    </label>
                    <input
                      type="number"
                      name="gpa"
                      step="0.01"
                      min="0"
                      max="4"
                      defaultValue={editingItem?.gpa || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                      placeholder="3.85"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Description
                    </label>
                    <textarea
                      rows={3}
                      defaultValue={editingItem?.description || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                        resize: 'none'
                      }}
                      placeholder="Additional details about your education"
                    />
                  </div>
                </div>
              )}

              {/* Publication Form */}
              {modalType === 'publication' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={editingItem?.title || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                      placeholder="Enter publication title"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Authors *
                    </label>
                    <input
                      type="text"
                      name="authors"
                      defaultValue={editingItem?.authors || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                      placeholder="Author 1, Author 2, etc."
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Journal/Conference *
                    </label>
                    <input
                      type="text"
                      defaultValue={editingItem?.journal || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                      placeholder="Journal name or conference"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Year *
                    </label>
                    <input
                      type="number"
                      min="1900"
                      max="2030"
                      defaultValue={editingItem?.year || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                      placeholder="2024"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                        DOI
                      </label>
                      <input
                        type="text"
                        defaultValue={editingItem?.doi || ''}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        placeholder="10.1000/182"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                        URL
                      </label>
                      <input
                        type="url"
                        defaultValue={editingItem?.url || ''}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Description
                    </label>
                    <textarea
                      rows={3}
                      defaultValue={editingItem?.description || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                        resize: 'none'
                      }}
                      placeholder="Brief description of the publication"
                    />
                  </div>
                </div>
              )}

              {/* Skill Form */}
              {modalType === 'skill' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Skill Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingItem?.name || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                      placeholder="e.g., React, Python, Docker"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Category *
                    </label>
                    <select
                      name="category"
                      defaultValue={editingItem?.category || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Select category</option>
                      <option value="Programming Languages">Programming Languages</option>
                      <option value="Frameworks">Frameworks</option>
                      <option value="Tools">Tools</option>
                      <option value="Databases">Databases</option>
                      <option value="Cloud">Cloud</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Skill Level * (0-100)
                    </label>
                    <input
                      type="range"
                      name="level"
                      min="0"
                      max="100"
                      defaultValue={editingItem?.level || 50}
                      style={{
                        width: '100%',
                        height: '6px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '3px',
                        outline: 'none'
                      }}
                      onInput={(e: any) => {
                        const display = e.target.nextElementSibling?.querySelector('.level-value');
                        if (display) display.textContent = e.target.value;
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                      <span>Beginner (0)</span>
                      <span className="level-value" style={{ color: '#10b981', fontWeight: '600' }}>{editingItem?.level || 50}</span>
                      <span>Expert (100)</span>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                      Icon Class/URL
                    </label>
                    <input
                      type="text"
                      name="icon"
                      defaultValue={editingItem?.icon || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                      placeholder="fab fa-react or icon URL"
                    />
                  </div>
                </div>
              )}
            </form>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCloseModal}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(107, 114, 128, 0.1)',
                  border: '1px solid rgba(107, 114, 128, 0.3)',
                  borderRadius: '8px',
                  color: '#9ca3af',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '8px',
                  color: '#10b981',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {editingItem && editingItem.id ? 'Update' : 'Add'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Admin;