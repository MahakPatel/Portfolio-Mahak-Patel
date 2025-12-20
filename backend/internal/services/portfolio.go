package services

import (
	"fmt"
	"time"

	"gorm.io/gorm"

	"portfolio-backend/internal/models"
)

type PortfolioService struct {
	db            *gorm.DB
	githubService *GitHubService
	emailService  *EmailService
}

func NewPortfolioService(db *gorm.DB, githubService *GitHubService, emailService *EmailService) *PortfolioService {
	return &PortfolioService{
		db:            db,
		githubService: githubService,
		emailService:  emailService,
	}
}

func (s *PortfolioService) GetPortfolio() (*models.Portfolio, error) {
	var portfolio models.Portfolio
	if err := s.db.First(&portfolio).Error; err != nil {
		return nil, fmt.Errorf("portfolio not found: %w", err)
	}
	return &portfolio, nil
}

func (s *PortfolioService) UpdatePortfolio(portfolio *models.Portfolio) error {
	return s.db.Save(portfolio).Error
}

func (s *PortfolioService) GetSkills() ([]models.Skill, error) {
	var skills []models.Skill
	if err := s.db.Order("category, level DESC").Find(&skills).Error; err != nil {
		return nil, err
	}
	return skills, nil
}

func (s *PortfolioService) CreateSkill(skill *models.Skill) error {
	return s.db.Create(skill).Error
}

func (s *PortfolioService) UpdateSkill(id uint, skill *models.Skill) error {
	return s.db.Model(&models.Skill{}).Where("id = ?", id).Updates(skill).Error
}

func (s *PortfolioService) DeleteSkill(id uint) error {
	return s.db.Delete(&models.Skill{}, id).Error
}

func (s *PortfolioService) GetExperience() ([]models.Experience, error) {
	var experiences []models.Experience
	if err := s.db.Order("start_date DESC").Find(&experiences).Error; err != nil {
		return nil, err
	}
	return experiences, nil
}

func (s *PortfolioService) CreateExperience(experience *models.Experience) error {
	return s.db.Create(experience).Error
}

func (s *PortfolioService) UpdateExperience(id uint, experience *models.Experience) error {
	return s.db.Model(&models.Experience{}).Where("id = ?", id).Updates(experience).Error
}

func (s *PortfolioService) DeleteExperience(id uint) error {
	return s.db.Delete(&models.Experience{}, id).Error
}

func (s *PortfolioService) GetCertifications() ([]models.Certification, error) {
	var certifications []models.Certification
	if err := s.db.Order("issue_date DESC").Find(&certifications).Error; err != nil {
		return nil, err
	}
	return certifications, nil
}

func (s *PortfolioService) CreateCertification(certification *models.Certification) error {
	return s.db.Create(certification).Error
}

func (s *PortfolioService) UpdateCertification(id uint, certification *models.Certification) error {
	return s.db.Model(&models.Certification{}).Where("id = ?", id).Updates(certification).Error
}

func (s *PortfolioService) DeleteCertification(id uint) error {
	return s.db.Delete(&models.Certification{}, id).Error
}

func (s *PortfolioService) GetVolunteerExperience() ([]models.VolunteerExperience, error) {
	var volunteer []models.VolunteerExperience
	if err := s.db.Order("start_date DESC").Find(&volunteer).Error; err != nil {
		return nil, err
	}
	return volunteer, nil
}

func (s *PortfolioService) CreateVolunteerExperience(entry *models.VolunteerExperience) error {
	return s.db.Create(entry).Error
}

func (s *PortfolioService) UpdateVolunteerExperience(id uint, entry *models.VolunteerExperience) error {
	updateData := map[string]interface{}{
		"organization": entry.Organization,
		"role":         entry.Role,
		"location":     entry.Location,
		"start_date":   entry.StartDate,
		"end_date":     entry.EndDate,
		"current":      entry.Current,
		"description":  entry.Description,
		"technologies": entry.Technologies,
		"updated_at":   time.Now(),
	}
	return s.db.Model(&models.VolunteerExperience{}).Where("id = ?", id).Updates(updateData).Error
}

func (s *PortfolioService) DeleteVolunteerExperience(id uint) error {
	return s.db.Delete(&models.VolunteerExperience{}, id).Error
}

func (s *PortfolioService) GetEducation() ([]models.Education, error) {
	var education []models.Education
	if err := s.db.Order("start_date DESC").Find(&education).Error; err != nil {
		return nil, err
	}
	return education, nil
}

func (s *PortfolioService) CreateEducation(education *models.Education) error {
	return s.db.Create(education).Error
}

func (s *PortfolioService) UpdateEducation(id uint, education *models.Education) error {
	return s.db.Model(&models.Education{}).Where("id = ?", id).Updates(education).Error
}

func (s *PortfolioService) DeleteEducation(id uint) error {
	return s.db.Delete(&models.Education{}, id).Error
}

func (s *PortfolioService) GetPublications() ([]models.Publication, error) {
	var publications []models.Publication
	if err := s.db.Order("year DESC").Find(&publications).Error; err != nil {
		return nil, err
	}
	return publications, nil
}

func (s *PortfolioService) CreatePublication(publication *models.Publication) error {
	return s.db.Create(publication).Error
}

func (s *PortfolioService) UpdatePublication(id uint, publication *models.Publication) error {
	return s.db.Model(&models.Publication{}).Where("id = ?", id).Updates(publication).Error
}

func (s *PortfolioService) DeletePublication(id uint) error {
	return s.db.Delete(&models.Publication{}, id).Error
}

func (s *PortfolioService) GetProjects() ([]models.Project, error) {
	var projects []models.Project
	if err := s.db.Order("featured DESC, created_at DESC").Find(&projects).Error; err != nil {
		return nil, err
	}
	return projects, nil
}

func (s *PortfolioService) CreateProject(project *models.Project) error {
	return s.db.Create(project).Error
}

func (s *PortfolioService) UpdateProject(id uint, project *models.Project) error {
	updateData := map[string]interface{}{
		"name":         project.Name,
		"description":  project.Description,
		"url":          project.URL,
		"github_url":   project.GitHubURL,
		"image_url":    project.ImageURL,
		"technologies": project.Technologies,
		"featured":     project.Featured,
		"updated_at":   time.Now(),
	}
	return s.db.Model(&models.Project{}).Where("id = ?", id).Updates(updateData).Error
}

func (s *PortfolioService) DeleteProject(id uint) error {
	return s.db.Delete(&models.Project{}, id).Error
}

func (s *PortfolioService) GetTestimonials() ([]models.ClientTestimonial, error) {
	var testimonials []models.ClientTestimonial
	if err := s.db.Order("created_at DESC").Find(&testimonials).Error; err != nil {
		return nil, err
	}
	return testimonials, nil
}

func (s *PortfolioService) CreateTestimonial(testimonial *models.ClientTestimonial) error {
	return s.db.Create(testimonial).Error
}

func (s *PortfolioService) UpdateTestimonial(id uint, testimonial *models.ClientTestimonial) error {
	updateData := map[string]interface{}{
		"name":             testimonial.Name,
		"role":             testimonial.Role,
		"company":          testimonial.Company,
		"content":          testimonial.Content,
		"rating":           testimonial.Rating,
		"avatar_url":       testimonial.AvatarURL,
		"company_logo_url": testimonial.CompanyLogoURL,
		"updated_at":       time.Now(),
	}
	return s.db.Model(&models.ClientTestimonial{}).Where("id = ?", id).Updates(updateData).Error
}

func (s *PortfolioService) DeleteTestimonial(id uint) error {
	return s.db.Delete(&models.ClientTestimonial{}, id).Error
}

func (s *PortfolioService) SyncGitHubProjects(username string) error {
	return s.githubService.SyncProjectsToDatabase(s.db, username)
}

func (s *PortfolioService) SendContactMessage(message *models.ContactMessage) error {
	// Save message to database
	if err := s.db.Create(message).Error; err != nil {
		return err
	}

	// Send email notification if email service is configured
	if s.emailService != nil && s.emailService.IsConfigured() {
		if err := s.emailService.SendContactNotification(
			message.Name,
			message.Email,
			message.Subject,
			message.Message,
		); err != nil {
			// Log error but don't fail the request if email fails
			fmt.Printf("Failed to send email notification: %v\n", err)
		}
	}

	return nil
}

func (s *PortfolioService) GetContactMessages() ([]models.ContactMessage, error) {
	var messages []models.ContactMessage
	if err := s.db.Order("created_at DESC").Find(&messages).Error; err != nil {
		return nil, err
	}
	return messages, nil
}

func (s *PortfolioService) MarkMessageAsRead(id uint) error {
	return s.db.Model(&models.ContactMessage{}).Where("id = ?", id).Update("read", true).Error
}

func (s *PortfolioService) GetDashboard() (map[string]interface{}, error) {
	var stats struct {
		SkillsCount              int64
		ExperienceCount          int64
		EducationCount           int64
		PublicationsCount        int64
		ProjectsCount            int64
		MessagesCount            int64
		CertificationsCount      int64
		VolunteerExperienceCount int64
		TestimonialsCount        int64
	}

	s.db.Model(&models.Skill{}).Count(&stats.SkillsCount)
	s.db.Model(&models.Experience{}).Count(&stats.ExperienceCount)
	s.db.Model(&models.Education{}).Count(&stats.EducationCount)
	s.db.Model(&models.Publication{}).Count(&stats.PublicationsCount)
	s.db.Model(&models.Project{}).Count(&stats.ProjectsCount)
	s.db.Model(&models.ContactMessage{}).Count(&stats.MessagesCount)
	s.db.Model(&models.Certification{}).Count(&stats.CertificationsCount)
	s.db.Model(&models.VolunteerExperience{}).Count(&stats.VolunteerExperienceCount)
	s.db.Model(&models.ClientTestimonial{}).Count(&stats.TestimonialsCount)

	return map[string]interface{}{
		"stats": stats,
	}, nil
}
