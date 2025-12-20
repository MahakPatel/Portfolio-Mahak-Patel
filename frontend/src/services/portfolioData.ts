// Service to fetch portfolio data for the knowledge graph
import { publicApi } from './api';
import { Skill, Project, Experience, Publication } from '../types';

export interface PortfolioData {
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  publications: Publication[];
  talks: Talk[];
}

export interface Talk {
  id: number;
  title: string;
  event: string;
  date: string;
  url?: string;
  description?: string;
  slides_url?: string;
}

export const fetchPortfolioData = async (): Promise<PortfolioData> => {
  try {
    // Fetch all portfolio data in parallel using publicApi methods
    const [skills, projects, experiences, publications] = await Promise.all([
      publicApi.getSkills(),
      publicApi.getProjects(),
      publicApi.getExperience(),
      publicApi.getPublications()
    ]);

    return {
      skills: skills || [],
      projects: projects || [],
      experiences: experiences || [],
      publications: publications || [],
      talks: [] // Add talks endpoint when available
    };
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    // Return mock data as fallback
    return getMockPortfolioData();
  }
};

// Mock data for demonstration
export const getMockPortfolioData = (): PortfolioData => ({
  skills: [
    { id: 1, name: 'React', level: 4, category: 'frameworks', icon: 'fab fa-react', created_at: '2024-01-01', updated_at: '2024-01-01' },
    { id: 2, name: 'Node.js', level: 4, category: 'tools', icon: 'fab fa-node-js', created_at: '2024-01-01', updated_at: '2024-01-01' },
    { id: 3, name: 'Python', level: 3, category: 'programming', icon: 'fab fa-python', created_at: '2024-01-01', updated_at: '2024-01-01' },
    { id: 4, name: 'TypeScript', level: 4, category: 'programming', icon: 'fab fa-js-square', created_at: '2024-01-01', updated_at: '2024-01-01' },
    { id: 5, name: 'Docker', level: 3, category: 'tools', icon: 'fab fa-docker', created_at: '2024-01-01', updated_at: '2024-01-01' },
    { id: 6, name: 'PostgreSQL', level: 3, category: 'databases', icon: 'fas fa-database', created_at: '2024-01-01', updated_at: '2024-01-01' },
    { id: 7, name: 'AWS', level: 2, category: 'cloud', icon: 'fab fa-aws', created_at: '2024-01-01', updated_at: '2024-01-01' },
    { id: 8, name: 'GraphQL', level: 3, category: 'tools', icon: 'fas fa-project-diagram', created_at: '2024-01-01', updated_at: '2024-01-01' }
  ],
  projects: [
    { 
      id: 1, 
      name: 'Portfolio Website', 
      description: 'Personal portfolio website built with React and TypeScript', 
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'], 
      url: 'https://yourportfolio.com',
      github_url: 'https://github.com/yourusername/portfolio',
      image_url: 'https://via.placeholder.com/400x300',
      featured: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    },
    { 
      id: 2, 
      name: 'E-commerce API', 
      description: 'RESTful API for e-commerce platform with microservices architecture', 
      technologies: ['Node.js', 'Python', 'Docker', 'PostgreSQL'], 
      url: '',
      github_url: 'https://github.com/yourusername/ecommerce-api',
      image_url: 'https://via.placeholder.com/400x300',
      featured: true,
      created_at: '2023-01-01',
      updated_at: '2023-01-01'
    },
    { 
      id: 3, 
      name: 'Data Analysis Dashboard', 
      description: 'Real-time data analysis dashboard with interactive visualizations', 
      technologies: ['Python', 'Docker', 'AWS'], 
      url: 'https://dashboard.example.com',
      github_url: '',
      image_url: 'https://via.placeholder.com/400x300',
      featured: false,
      created_at: '2023-01-01',
      updated_at: '2023-01-01'
    },
    { 
      id: 4, 
      name: 'GraphQL API', 
      description: 'Modern GraphQL API with real-time subscriptions', 
      technologies: ['Node.js', 'GraphQL', 'PostgreSQL'], 
      url: '',
      github_url: 'https://github.com/yourusername/graphql-api',
      image_url: 'https://via.placeholder.com/400x300',
      featured: false,
      created_at: '2022-01-01',
      updated_at: '2022-01-01'
    }
  ],
  experiences: [
    { 
      id: 1, 
      position: 'Senior Software Engineer', 
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      description: 'Led development of web applications and microservices architecture', 
      start_date: '2022-01-01',
      end_date: '',
      current: true,
      technologies: ['React', 'Node.js', 'TypeScript', 'Docker', 'AWS'],
      achievements: ['Led team of 5 developers', 'Improved system performance by 40%'],
      company_size: '1000+',
      industry: 'Technology',
      created_at: '2022-01-01',
      updated_at: '2022-01-01'
    },
    { 
      id: 2, 
      position: 'Full Stack Developer', 
      company: 'StartupXYZ',
      location: 'Remote',
      description: 'Built full-stack applications from scratch using modern technologies', 
      start_date: '2020-06-01',
      end_date: '2021-12-31',
      current: false,
      technologies: ['React', 'Node.js', 'Python', 'PostgreSQL'],
      achievements: ['Built MVP in 3 months', 'Scaled to 10k users'],
      company_size: '10-50',
      industry: 'SaaS',
      created_at: '2020-06-01',
      updated_at: '2021-12-31'
    },
    { 
      id: 3, 
      position: 'Frontend Developer', 
      company: 'Web Agency',
      location: 'New York, NY',
      description: 'Developed responsive websites and web applications', 
      start_date: '2019-01-01',
      end_date: '2020-05-31',
      current: false,
      technologies: ['React', 'TypeScript'],
      achievements: ['Delivered 20+ client projects', 'Improved page load times by 50%'],
      company_size: '50-100',
      industry: 'Marketing',
      created_at: '2019-01-01',
      updated_at: '2020-05-31'
    }
  ],
  publications: [
    { 
      id: 1, 
      title: 'Modern Web Development Practices', 
      authors: 'Your Name',
      journal: 'Tech Journal',
      description: 'Comprehensive guide to modern web development best practices', 
      year: 2023, 
      doi: '10.1000/xyz123',
      url: 'https://example.com/publication1',
      created_at: '2023-01-01',
      updated_at: '2023-01-01'
    },
    { 
      id: 2, 
      title: 'React Performance Optimization Techniques', 
      authors: 'Your Name',
      journal: 'Frontend Weekly',
      description: 'Advanced techniques for optimizing React applications', 
      year: 2022, 
      doi: '10.1000/xyz124',
      url: 'https://example.com/publication2',
      created_at: '2022-01-01',
      updated_at: '2022-01-01'
    },
    { 
      id: 3, 
      title: 'Building Scalable APIs with Node.js', 
      authors: 'Your Name',
      journal: 'Backend Engineering',
      description: 'Best practices for building scalable Node.js APIs', 
      year: 2021, 
      doi: '10.1000/xyz125',
      url: 'https://example.com/publication3',
      created_at: '2021-01-01',
      updated_at: '2021-01-01'
    }
  ],
  talks: [
    { 
      id: 1, 
      title: 'The Future of Web Development', 
      event: 'Tech Conference 2023',
      date: '2023-06-15',
      description: 'Exploring emerging trends in web development',
      url: 'https://example.com/talk1',
      slides_url: 'https://slides.example.com/talk1'
    },
    { 
      id: 2, 
      title: 'React Best Practices', 
      event: 'React Meetup',
      date: '2022-11-20',
      description: 'Sharing best practices for React development',
      url: 'https://example.com/talk2'
    }
  ]
});
