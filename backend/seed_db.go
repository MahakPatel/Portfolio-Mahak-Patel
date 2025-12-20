package main

import (
	"log"
	"time"

	"portfolio-backend/internal/config"
	"portfolio-backend/internal/database"
	"portfolio-backend/internal/models"

	"github.com/joho/godotenv"
	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize configuration
	cfg := config.Load()

	// Initialize database
	db, err := database.Initialize(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Run migrations
	if err := database.Migrate(db); err != nil {
		log.Fatal("Failed to run migrations:", err)
	}

	log.Println("Seeding database with portfolio data...")

	// Create admin user
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	admin := models.Admin{
		Username: "admin",
		Password: string(hashedPassword),
	}
	db.FirstOrCreate(&admin, models.Admin{Username: "admin"})

	// Create portfolio
	portfolio := models.Portfolio{
		Name:        "Mahak Patel",
		Title:       "Software Engineer",
		Email:       "mahakpatel0208@gmail.com",
		Location:    "Irving, Texas, United States",
		GitHubURL:   "https://github.com/mahakpatel",
		LinkedInURL: "https://www.linkedin.com/in/mahakpatel/",
	}
	db.FirstOrCreate(&portfolio, models.Portfolio{Email: "mahakpatel0208@gmail.com"})

	// Create skills
	skills := []models.Skill{
		{Name: "Go", Category: "Programming Languages", Level: 90},
		{Name: "Python", Category: "Programming Languages", Level: 85},
		{Name: "Java", Category: "Programming Languages", Level: 80},
		{Name: "JavaScript", Category: "Programming Languages", Level: 75},
		{Name: "React", Category: "Frontend", Level: 80},
		{Name: "TypeScript", Category: "Frontend", Level: 75},
		{Name: "Docker", Category: "DevOps", Level: 75},
		{Name: "Kubernetes", Category: "DevOps", Level: 70},
		{Name: "Kafka", Category: "Backend", Level: 85},
		{Name: "PostgreSQL", Category: "Databases", Level: 80},
		{Name: "MySQL", Category: "Databases", Level: 80},
		{Name: "Git", Category: "Tools", Level: 90},
	}
	for _, skill := range skills {
		db.FirstOrCreate(&skill, models.Skill{Name: skill.Name})
	}

	// Create experiences
	experiences := []models.Experience{
		{
			Company:      "IMA360",
			Position:     "Software Engineer",
			Location:     "Irving, Texas, United States",
			StartDate:    time.Date(2025, 9, 1, 0, 0, 0, 0, time.UTC),
			EndDate:      nil,
			Current:      true,
			Description:  "Developing scalable backend solutions and microservices architecture. Implementing event-driven systems using Kafka for real-time data processing. Optimizing database performance and API response times. Collaborating with cross-functional teams to deliver high-quality software solutions.",
			Technologies: pq.StringArray{"Go", "Kafka", "PostgreSQL", "Docker", "Kubernetes", "AWS"},
		},
		{
			Company:      "IMA360",
			Position:     "Software Engineer Intern",
			Location:     "Irving, Texas, United States",
			StartDate:    time.Date(2025, 6, 16, 0, 0, 0, 0, time.UTC),
			EndDate:      ptrTime(time.Date(2025, 8, 31, 0, 0, 0, 0, time.UTC)),
			Current:      false,
			Description:  "Gained hands-on experience in software development lifecycle. Worked on backend services and API development. Participated in code reviews and agile development processes. Contributed to testing and debugging of production systems.",
			Technologies: pq.StringArray{"Go", "Python", "MySQL", "Git", "Docker"},
		},
		{
			Company:      "California State Polytechnic University, Pomona",
			Position:     "Graduate Research Assistant",
			Location:     "Pomona, California, United States",
			StartDate:    time.Date(2024, 9, 1, 0, 0, 0, 0, time.UTC),
			EndDate:      nil,
			Current:      true,
			Description:  "Conducting research in computer vision and machine learning for autonomous vehicle applications. Developing lane detection algorithms for severe weather conditions using CARLA simulator. Publishing research findings in peer-reviewed conferences. Mentoring undergraduate students in research projects.",
			Technologies: pq.StringArray{"Python", "OpenCV", "TensorFlow", "CARLA", "C++", "Linux"},
		},
		{
			Company:      "ZopSmart Technology",
			Position:     "Software Development Engineer - I",
			Location:     "Bengaluru, Karnataka, India",
			StartDate:    time.Date(2022, 7, 1, 0, 0, 0, 0, time.UTC),
			EndDate:      ptrTime(time.Date(2023, 6, 30, 0, 0, 0, 0, time.UTC)),
			Current:      false,
			Description:  "As a backend developer within the Golang team, I analyzed backend infrastructure and devised solutions to optimize system performance and stability, resulting in a remarkable 40% improvement in response time SLA compliance. Integrated event publishing and consuming (KAFKA) support for 5 services using a robust event publishing framework, enhancing real-time data processing capabilities and streamlining system workflows. Analyzed production services to optimize database requirements, resulting in a 40% rise in application performance and reduced response time by 24ms, enhancing user experience and increasing customer satisfaction.",
			Technologies: pq.StringArray{"Go", "Kafka", "MySQL", "PostgreSQL", "Docker", "AWS CloudWatch"},
		},
		{
			Company:      "ZopSmart Technology",
			Position:     "Software Engineer Intern",
			Location:     "Bengaluru, Karnataka, India",
			StartDate:    time.Date(2022, 1, 1, 0, 0, 0, 0, time.UTC),
			EndDate:      ptrTime(time.Date(2022, 6, 30, 0, 0, 0, 0, time.UTC)),
			Current:      false,
			Description:  "Spearheaded the adoption of Test-driven development (TDD) as a Golang Microservices Developer, leading to a 50% decrease in regression issues and ensuring the delivery of high-quality, reliable microservices. Upgraded workflow efficiency by implementing GitHub Actions for CI/CD, replacing previous Harness/TeamCity setup; shortened deployment time by 40% and achieved higher code quality through automated testing. Spearheaded extensive JMeter performance testing, resulting in a 40% devaluation in response time and enhanced system scalability for a high-traffic platform.",
			Technologies: pq.StringArray{"Go", "Docker", "GitHub Actions", "JMeter", "MySQL", "PostgreSQL"},
		},
	}
	for _, exp := range experiences {
		db.FirstOrCreate(&exp, models.Experience{Company: exp.Company, Position: exp.Position})
	}

	// Create education
	educations := []models.Education{
		{
			Institution: "California State Polytechnic University, Pomona",
			Degree:      "Master of Science in Computer Science",
			Field:       "Computer Science",
			StartDate:   time.Date(2023, 9, 1, 0, 0, 0, 0, time.UTC),
			EndDate:     ptrTime(time.Date(2025, 5, 1, 0, 0, 0, 0, time.UTC)),
		},
		{
			Institution: "Gujarat Technological University",
			Degree:      "Bachelor of Engineering in Computer Engineering",
			Field:       "Computer Engineering",
			StartDate:   time.Date(2018, 8, 1, 0, 0, 0, 0, time.UTC),
			EndDate:     ptrTime(time.Date(2022, 5, 1, 0, 0, 0, 0, time.UTC)),
		},
	}
	for _, edu := range educations {
		db.FirstOrCreate(&edu, models.Education{Institution: edu.Institution, Degree: edu.Degree})
	}

	// Create publications
	publications := []models.Publication{
		{
			Title:   "Machine-learning techniques for the detection of powdery mildew in vineyards",
			Authors: "Mahak Patel, Dr. Shalini Rawal",
			Journal: "SPIE Defense + Commercial Sensing, 2025",
			Year:    2025,
			DOI:     "10.1117/12.3066315",
		},
	}
	for _, pub := range publications {
		db.FirstOrCreate(&pub, models.Publication{Title: pub.Title})
	}

	// Create projects
	projects := []models.Project{
		{
			Name:         "Lane Detection in Severe Weather Condition",
			Description:  "Formulated and executed a robust lane detection algorithm for superior performance in adverse weather conditions.",
			Technologies: pq.StringArray{"CARLA Simulator", "Python", "OpenCV", "NumPy"},
			GitHubURL:    "https://github.com/mahakpatel/lane-detection",
			Featured:     true,
		},
		{
			Name:         "Online Salon Management System",
			Description:  "Devised a robust Online Salon Management System to optimize appointment scheduling.",
			Technologies: pq.StringArray{"Python", "Django", "MySQL", "HTML", "CSS"},
			GitHubURL:    "https://github.com/mahakpatel/Online-Salon-Management",
			Featured:     true,
		},
		{
			Name:         "Car Dealership Web API",
			Description:  "Developed a high-performance Web API, streamlining inventory management and diminishing manual errors while improving data accuracy.",
			Technologies: pq.StringArray{"Go", "MySQL", "Postman", "AWS CloudWatch"},
			GitHubURL:    "https://github.com/mahakpatel/car-dealership-api",
			Featured:     false,
		},
	}
	for _, proj := range projects {
		db.FirstOrCreate(&proj, models.Project{Name: proj.Name})
	}

	// Create client testimonials
	testimonials := []models.ClientTestimonial{
		{
			Name:           "Asha Patel",
			Role:           "Owner",
			Company:        "Hope Salon",
			Content:        "Mahak delivered an exceptional salon management system that transformed our business operations. The online booking system increased our customer bookings by 40% and reduced no-shows by 25%.",
			Rating:         5,
			AvatarURL:      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
			CompanyLogoURL: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100&h=100&fit=crop&crop=center",
		},
		{
			Name:      "Paul Daniel Knopf",
			Role:      "Founder",
			Company:   "Impact Earth Organization",
			Content:   "Working with Mahak was a game-changer for our organization. His technical expertise in developing scalable solutions helped us streamline our operations and reach more people.",
			Rating:    5,
			AvatarURL: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
		},
	}

	for _, testimonial := range testimonials {
		db.FirstOrCreate(&testimonial, models.ClientTestimonial{Name: testimonial.Name, Company: testimonial.Company})
	}

	log.Println("Database seeding completed successfully!")
}

func ptrTime(t time.Time) *time.Time {
	return &t
}
