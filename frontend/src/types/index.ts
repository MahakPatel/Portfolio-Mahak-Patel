export interface Portfolio {
  id: number;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url: string;
  github_url: string;
  twitter_url: string;
  website_url: string;
  avatar_url: string;
  resume_url: string;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description: string;
  technologies: string[];
  achievements?: string[];
  company_size?: string;
  industry?: string;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: number;
  title: string;
  issuer: string;
  issue_date: string;
  expiration_date?: string;
  credential_id?: string;
  credential_url?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface VolunteerExperience {
  id: number;
  organization: string;
  role: string;
  location: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description: string;
  technologies: string[];
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date?: string;
  gpa?: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Publication {
  id: number;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi: string;
  url: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  url: string;
  github_url: string;
  image_url: string;
  technologies: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar_url?: string;
  company_logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  skills_count: number;
  experience_count: number;
  education_count: number;
  publications_count: number;
  projects_count: number;
  messages_count: number;
  certifications_count: number;
  volunteer_experience_count: number;
}

export interface Dashboard {
  stats: DashboardStats;
}
