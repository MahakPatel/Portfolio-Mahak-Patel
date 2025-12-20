// Mock data for development without backend
export const mockPortfolio = {
  id: 1,
  name: "Mahakbhai Patel",
  title: "Software Engineer & Graduate Research Assistant",
  bio: "Experienced software engineer with expertise in Go, Python, specializing in backend development, scalable solutions, and system optimization. Experienced in Kafka-based event-driven architecture, REST API, and CI/CD automation. Proficient in Django, Gofr, MySQL, PostgreSQL, and performance optimization. Possesses strong problem-solving skills and effective teamwork abilities.",
  email: "mahakpatel0208@gmail.com",
  phone: "+1 (840) 231-9761",
  location: "Pomona, CA",
  linkedin_url: "https://www.linkedin.com/in/mahakpatel/",
  github_url: "https://github.com/mahakpatel",
  twitter_url: "https://twitter.com/mahakpatel",
  website_url: "https://mahakpatel.dev",
  avatar_url: "",
  resume_url: "/resume.pdf",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z"
};

export const mockSkills = [
  { id: 1, name: "Go", category: "Programming Languages", level: 5, icon: "🐹", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: 2, name: "Python", category: "Programming Languages", level: 5, icon: "🐍", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: 3, name: "C/C++", category: "Programming Languages", level: 4, icon: "⚙️", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: 4, name: "Django", category: "Frameworks", level: 4, icon: "🎯", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: 5, name: "Gofr", category: "Frameworks", level: 4, icon: "🚀", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: 6, name: "MySQL", category: "Databases", level: 5, icon: "🗄️", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: 7, name: "PostgreSQL", category: "Databases", level: 5, icon: "🐘", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: 8, name: "Postman", category: "Tools", level: 4, icon: "📮", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: 9, name: "AWS CloudWatch", category: "Tools", level: 4, icon: "☁️", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: 10, name: "Git", category: "Tools", level: 5, icon: "📝", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: 11, name: "GitHub Actions", category: "Tools", level: 4, icon: "⚡", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: 12, name: "REST API", category: "Tools", level: 5, icon: "🔗", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: 13, name: "Algorithms", category: "Tools", level: 4, icon: "🧮", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: 14, name: "Data Structures", category: "Tools", level: 4, icon: "🏗️", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" }
];

export const mockProjects = [
  {
    id: 1,
    name: "Lane Detection in Severe Weather Condition",
    description: "Formulated and executed a robust lane detection algorithm for superior performance in adverse weather conditions (heavy rain, limited visibility at night, foggy environments). Utilized CARLA sensors for evaluation. Achieved a 90% accuracy rate in identifying and delineating lanes using advanced image processing techniques.",
    url: "",
    github_url: "https://github.com/mahakpatel/lane-detection",
    image_url: "",
    technologies: ["CARLA Simulator", "Python", "OpenCV", "NumPy"],
    featured: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Car Dealership Web API",
    description: "Developed a high-performance Web API, streamlining inventory management and diminishing manual errors by 40%, while improving data accuracy by 25%. Constructed and implemented an API for streamlined CRUD operations for car and engine details, reducing data entry time by 40% and minimizing data errors.",
    url: "",
    github_url: "https://github.com/mahakpatel/car-dealership-api",
    image_url: "",
    technologies: ["Go", "MySQL", "Postman", "AWS CloudWatch"],
    featured: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    name: "Online Salon Management System",
    description: "Devised a robust Online Salon Management System to optimize appointment scheduling, leading to a 40% increase in customer bookings and a 25% reduction in no-shows. Designed a seamless online booking system with user/admin dashboards and integrated online payments, streamlining scheduling and reducing manual data entry by 50%.",
    url: "",
    github_url: "https://github.com/mahakpatel/salon-management",
    image_url: "",
    technologies: ["Python", "Django", "MySQL", "HTML", "CSS", "PostgreSQL"],
    featured: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
];

export const mockTestimonials = [
  {
    id: 1,
    name: "Asha Patel",
    role: "Owner",
    company: "Hope Salon",
    content: "Mahak delivered an exceptional salon management system that transformed our business operations. The online booking system increased our customer bookings by 40% and reduced no-shows by 25%.",
    rating: 5,
    avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    company_logo_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100&h=100&fit=crop&crop=center",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Paul Daniel Knopf",
    role: "Founder",
    company: "Impact Earth Organization",
    content: "Working with Mahak was a game-changer for our organization. His technical expertise in developing scalable solutions helped us streamline our operations and reach more people.",
    rating: 5,
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    company_logo_url: "",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
];

export const mockExperience = [
  {
    id: 1,
    company: "IMA360",
    position: "Software Engineer",
    location: "Irving, Texas, United States",
    start_date: "2025-09-01T00:00:00Z",
    end_date: undefined,
    current: true,
    description: "Full-time Software Engineer role focusing on scalable software solutions and system optimization.",
    technologies: ["Go", "Python", "Microservices", "Cloud Computing", "System Optimization"],
    achievements: [
      "Developing scalable software solutions",
      "Implementing system optimization techniques",
      "Working on enterprise-level applications",
      "Focusing on microservices architecture"
    ],
    company_size: "50-200",
    industry: "Technology",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    company: "IMA360",
    position: "Software Engineer Intern",
    location: "Irving, Texas, United States",
    start_date: "2025-06-01T00:00:00Z",
    end_date: "2025-08-31T00:00:00Z",
    current: false,
    description: "Internship role focusing on software development and gaining hands-on experience with modern technologies.",
    technologies: ["Go", "Python", "Software Development", "Team Collaboration"],
    achievements: [
      "Completed successful internship program",
      "Gained experience in enterprise software development",
      "Learned modern development practices",
      "Contributed to team projects"
    ],
    company_size: "50-200",
    industry: "Technology",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    company: "California State Polytechnic University, Pomona",
    position: "Graduate Research Assistant",
    location: "Pomona, California, United States",
    start_date: "2024-09-01T00:00:00Z",
    end_date: undefined,
    current: true,
    description: "Conducting research in computer vision and machine learning, focusing on lane detection algorithms for autonomous vehicles in severe weather conditions.\n\nFormulated and executed a robust lane detection algorithm for superior performance in adverse weather conditions (heavy rain, limited visibility at night, foggy environments).\n\nUtilized CARLA sensors for comprehensive evaluation and testing.\n\nAchieved an impressive 90% accuracy rate in identifying and delineating lanes using advanced image processing techniques and machine learning algorithms.",
    technologies: ["Python", "OpenCV", "CARLA Simulator", "Machine Learning", "Computer Vision", "Analytical Skills"],
    achievements: [
      "Developed robust lane detection algorithm with 90% accuracy",
      "Published research on severe weather condition lane detection",
      "Collaborated with faculty on computer vision research",
      "Presented findings at academic conferences"
    ],
    company_size: "1000+",
    industry: "Education",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    company: "ZopSmart Technology",
    position: "Software Development Engineer - I",
    location: "Bengaluru, Karnataka, India",
    start_date: "2022-07-01T00:00:00Z",
    end_date: "2023-06-30T00:00:00Z",
    current: false,
    description: "As a backend developer within the Golang team, analyzed backend infrastructure and devised solutions to optimize system performance and stability, resulting in a remarkable 40% improvement in response time SLA compliance.\n\nIntegrated event publishing and consuming (KAFKA) support for 5 services using a robust event publishing framework, enhancing real-time data processing capabilities and streamlining system workflows.\n\nAnalyzed production services to optimize database requirements, resulting in a 40% rise in application performance and reduced response time by 24ms, enhancing user experience and increasing customer satisfaction.",
    technologies: ["Go", "Kafka", "Microservices", "Database Optimization", "Performance Tuning", "Git", "Amazon CloudWatch"],
    achievements: [
      "40% improvement in response time SLA compliance",
      "Integrated Kafka event publishing for 5 services",
      "40% rise in application performance",
      "Reduced response time by 24ms",
      "Enhanced user experience and customer satisfaction"
    ],
    company_size: "50-200",
    industry: "Technology",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 5,
    company: "ZopSmart Technology",
    position: "Software Engineer Intern",
    location: "Bengaluru, Karnataka, India",
    start_date: "2022-01-01T00:00:00Z",
    end_date: "2022-06-30T00:00:00Z",
    current: false,
    description: "Spearheaded the adoption of Test-driven development (TDD) as a Golang Microservices Developer, leading to a 50% decrease in regression issues and ensuring the delivery of high-quality, reliable microservices.\n\nUpgraded workflow efficiency by implementing GitHub Actions for CI/CD, replacing previous Harness/TeamCity setup; shortened deployment time by 40% and achieved higher code quality through automated testing.\n\nSpearheaded extensive JMeter performance testing, resulting in a 40% improvement in response time and enhanced system scalability for a high-traffic platform.",
    technologies: ["Go", "TDD", "GitHub Actions", "CI/CD", "JMeter", "Performance Testing", "Microservices", "Git", "Amazon CloudWatch"],
    achievements: [
      "50% decrease in regression issues through TDD adoption",
      "40% reduction in deployment time with GitHub Actions",
      "40% improvement in response time through JMeter testing",
      "Enhanced system scalability for high-traffic platform",
      "Improved code quality through automated testing"
    ],
    company_size: "50-200",
    industry: "Technology",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
];

export const mockCertifications = [
  {
    id: 1,
    title: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    issue_date: "2024-05-01T00:00:00Z",
    expiration_date: "2027-05-01T00:00:00Z",
    credential_id: "ABC123456789",
    credential_url: "https://aws.amazon.com/certification/",
    description: "Validated expertise in designing and deploying scalable systems on AWS.",
    created_at: "2024-05-02T00:00:00Z",
    updated_at: "2024-05-02T00:00:00Z"
  },
  {
    id: 2,
    title: "Certified Kubernetes Administrator (CKA)",
    issuer: "The Linux Foundation",
    issue_date: "2023-11-01T00:00:00Z",
    expiration_date: "2026-11-01T00:00:00Z",
    credential_id: "CKA-987654321",
    credential_url: "https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/",
    description: "Demonstrated ability to install, configure, and manage Kubernetes clusters.",
    created_at: "2023-11-02T00:00:00Z",
    updated_at: "2023-11-02T00:00:00Z"
  }
];

export const mockVolunteerExperience = [
  {
    id: 1,
    organization: "Tech for Good",
    role: "Volunteer Backend Developer",
    location: "Remote",
    start_date: "2023-01-01T00:00:00Z",
    end_date: "2023-12-01T00:00:00Z",
    current: false,
    description: "Developed and maintained REST APIs for a non-profit platform helping charities manage donations.",
    technologies: ["Go", "PostgreSQL", "Docker"],
    created_at: "2023-01-05T00:00:00Z",
    updated_at: "2023-12-01T00:00:00Z"
  },
  {
    id: 2,
    organization: "Code Mentors Collective",
    role: "Mentor",
    location: "Pomona, CA",
    start_date: "2024-02-01T00:00:00Z",
    end_date: undefined,
    current: true,
    description: "Mentoring aspiring developers on backend best practices and cloud deployments.",
    technologies: ["Python", "AWS", "CI/CD"],
    created_at: "2024-02-05T00:00:00Z",
    updated_at: "2024-08-01T00:00:00Z"
  }
];

export const mockEducation = [
  {
    id: 1,
    institution: "California State Polytechnic University",
    degree: "M.S in Computer Science",
    field: "Computer Science",
    start_date: "2023-08-01T00:00:00Z",
    end_date: undefined,
    gpa: 4.0,
    description: "Currently pursuing Master of Science in Computer Science with focus on machine learning, computer vision, and advanced algorithms. Maintaining perfect GPA while conducting research in AI applications for agriculture.",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
];

export const mockPublications = [
  {
    id: 1,
    title: "Scalable Microservices Architecture Patterns",
    authors: "Mahak Patel, John Smith",
    journal: "IEEE Software Engineering",
    year: 2023,
    doi: "10.1109/SE.2023.123456",
    url: "https://ieee.org/publications/scalable-microservices",
    description: "A comprehensive study on implementing scalable microservices architectures in modern cloud environments.",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
];
