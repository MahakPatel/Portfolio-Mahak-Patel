import axios from 'axios';
import {
  Portfolio,
  Skill,
  Experience,
  Certification,
  VolunteerExperience,
  Education,
  Publication,
  Project,
  ContactMessage,
  Dashboard,
  Testimonial,
} from '../types';
import {
  mockPortfolio,
  mockSkills,
  mockProjects,
  mockExperience,
  mockEducation,
  mockPublications,
  mockCertifications,
  mockVolunteerExperience,
  mockTestimonials,
} from '../data/mockData';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper function to check if backend is available
const isBackendAvailable = async (): Promise<boolean> => {
  try {
    await api.get('/health');
    return true;
  } catch {
    return false;
  }
};

// Public API endpoints
export const publicApi = {
  // Portfolio
  getPortfolio: async (): Promise<Portfolio> => {
    if (await isBackendAvailable()) {
      return api.get('/portfolio').then((res) => res.data);
    }
    return mockPortfolio;
  },

  // Skills
  getSkills: async (): Promise<Skill[]> => {
    if (await isBackendAvailable()) {
      return api.get('/skills').then((res) => res.data);
    }
    return mockSkills;
  },

  // Experience
  getExperience: async (): Promise<Experience[]> => {
    if (await isBackendAvailable()) {
      return api.get('/experience').then((res) => res.data);
    }
    return mockExperience;
  },

  // Certifications
  getCertifications: async (): Promise<Certification[]> => {
    if (await isBackendAvailable()) {
      return api.get('/certifications').then((res) => res.data);
    }
    return mockCertifications;
  },

  // Volunteer Experience
  getVolunteerExperience: async (): Promise<VolunteerExperience[]> => {
    if (await isBackendAvailable()) {
      return api.get('/volunteer-experiences').then((res) => res.data);
    }
    return mockVolunteerExperience;
  },

  // Education
  getEducation: async (): Promise<Education[]> => {
    if (await isBackendAvailable()) {
      return api.get('/education').then((res) => res.data);
    }
    return mockEducation;
  },

  // Publications
  getPublications: async (): Promise<Publication[]> => {
    if (await isBackendAvailable()) {
      return api.get('/publications').then((res) => res.data);
    }
    return mockPublications;
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    if (await isBackendAvailable()) {
      return api.get('/projects').then((res) => res.data);
    }
    return mockProjects;
  },

  // Testimonials
  getTestimonials: async (): Promise<Testimonial[]> => {
    if (await isBackendAvailable()) {
      return api.get('/testimonials').then((res) => res.data);
    }
    return mockTestimonials;
  },

  // Contact
  sendContactMessage: async (message: Omit<ContactMessage, 'id' | 'read' | 'created_at' | 'updated_at'>): Promise<void> => {
    if (await isBackendAvailable()) {
      return api.post('/contact', message).then((res) => res.data);
    }
    // Mock success for demo
    return Promise.resolve();
  },
};

// Admin API endpoints
export const adminApi = {
  // Dashboard
  getDashboard: (): Promise<Dashboard> =>
    api.get('/admin/dashboard').then((res) => res.data),

  // Portfolio
  updatePortfolio: (portfolio: Partial<Portfolio>): Promise<void> =>
    api.put('/admin/portfolio', portfolio).then((res) => res.data),

  // Skills
  createSkill: (skill: Omit<Skill, 'id' | 'created_at' | 'updated_at'>): Promise<Skill> =>
    api.post('/admin/skills', skill).then((res) => res.data),

  updateSkill: (id: number, skill: Partial<Skill>): Promise<void> =>
    api.put(`/admin/skills/${id}`, skill).then((res) => res.data),

  deleteSkill: (id: number): Promise<void> =>
    api.delete(`/admin/skills/${id}`).then((res) => res.data),

  // Experience
  createExperience: (experience: Omit<Experience, 'id' | 'created_at' | 'updated_at'>): Promise<Experience> =>
    api.post('/admin/experience', experience).then((res) => res.data),

  updateExperience: (id: number, experience: Partial<Experience>): Promise<void> =>
    api.put(`/admin/experience/${id}`, experience).then((res) => res.data),

  deleteExperience: (id: number): Promise<void> =>
    api.delete(`/admin/experience/${id}`).then((res) => res.data),

  // Certifications
  createCertification: (certification: Omit<Certification, 'id' | 'created_at' | 'updated_at'>): Promise<Certification> =>
    api.post('/admin/certifications', certification).then((res) => res.data),

  updateCertification: (id: number, certification: Partial<Certification>): Promise<void> =>
    api.put(`/admin/certifications/${id}`, certification).then((res) => res.data),

  deleteCertification: (id: number): Promise<void> =>
    api.delete(`/admin/certifications/${id}`).then((res) => res.data),

  // Volunteer Experience
  createVolunteerExperience: (entry: Omit<VolunteerExperience, 'id' | 'created_at' | 'updated_at'>): Promise<VolunteerExperience> =>
    api.post('/admin/volunteer-experiences', entry).then((res) => res.data),

  updateVolunteerExperience: (id: number, entry: Partial<VolunteerExperience>): Promise<void> =>
    api.put(`/admin/volunteer-experiences/${id}`, entry).then((res) => res.data),

  deleteVolunteerExperience: (id: number): Promise<void> =>
    api.delete(`/admin/volunteer-experiences/${id}`).then((res) => res.data),

  // Education
  createEducation: (education: Omit<Education, 'id' | 'created_at' | 'updated_at'>): Promise<Education> =>
    api.post('/admin/education', education).then((res) => res.data),

  updateEducation: (id: number, education: Partial<Education>): Promise<void> =>
    api.put(`/admin/education/${id}`, education).then((res) => res.data),

  deleteEducation: (id: number): Promise<void> =>
    api.delete(`/admin/education/${id}`).then((res) => res.data),

  // Publications
  createPublication: (publication: Omit<Publication, 'id' | 'created_at' | 'updated_at'>): Promise<Publication> =>
    api.post('/admin/publications', publication).then((res) => res.data),

  updatePublication: (id: number, publication: Partial<Publication>): Promise<void> =>
    api.put(`/admin/publications/${id}`, publication).then((res) => res.data),

  deletePublication: (id: number): Promise<void> =>
    api.delete(`/admin/publications/${id}`).then((res) => res.data),

  // Contact Messages
  getContactMessages: (): Promise<ContactMessage[]> =>
    api.get('/admin/messages').then((res) => res.data),

  markMessageAsRead: (id: number): Promise<void> =>
    api.put(`/admin/messages/${id}/read`).then((res) => res.data),

  // GitHub Sync
  syncGitHubProjects: (username: string): Promise<void> =>
    api.post('/admin/sync-github', { username }).then((res) => res.data),

  // Projects
  createProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> =>
    api.post('/admin/projects', project).then((res) => res.data),

  updateProject: (id: number, project: Partial<Project>): Promise<void> =>
    api.put(`/admin/projects/${id}`, project).then((res) => res.data),

  deleteProject: (id: number): Promise<void> =>
    api.delete(`/admin/projects/${id}`).then((res) => res.data),

  // Testimonials
  createTestimonial: (testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>): Promise<Testimonial> =>
    api.post('/admin/testimonials', testimonial).then((res) => res.data),

  updateTestimonial: (id: number, testimonial: Partial<Testimonial>): Promise<void> =>
    api.put(`/admin/testimonials/${id}`, testimonial).then((res) => res.data),

  deleteTestimonial: (id: number): Promise<void> =>
    api.delete(`/admin/testimonials/${id}`).then((res) => res.data),
};

export default api;
