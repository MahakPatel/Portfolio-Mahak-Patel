package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/lib/pq"

	"portfolio-backend/internal/models"
	"portfolio-backend/internal/services"
)

type AdminHandler struct {
	service   *services.PortfolioService
	jwtSecret string
}

func NewAdminHandler(service *services.PortfolioService, jwtSecret string) *AdminHandler {
	return &AdminHandler{
		service:   service,
		jwtSecret: jwtSecret,
	}
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token string `json:"token"`
	User  string `json:"user"`
}

type UpdateExperienceRequest struct {
	Company      string   `json:"company"`
	Position     string   `json:"position"`
	Location     string   `json:"location"`
	StartDate    string   `json:"start_date"`
	EndDate      *string  `json:"end_date,omitempty"`
	Current      bool     `json:"current"`
	Description  string   `json:"description"`
	Technologies []string `json:"technologies"`
}

type CertificationRequest struct {
	Title          string  `json:"title"`
	Issuer         string  `json:"issuer"`
	IssueDate      string  `json:"issue_date"`
	ExpirationDate *string `json:"expiration_date,omitempty"`
	CredentialID   string  `json:"credential_id"`
	CredentialURL  string  `json:"credential_url"`
	Description    string  `json:"description"`
}

type VolunteerExperienceRequest struct {
	Organization string   `json:"organization"`
	Role         string   `json:"role"`
	Location     string   `json:"location"`
	StartDate    string   `json:"start_date"`
	EndDate      *string  `json:"end_date,omitempty"`
	Current      bool     `json:"current"`
	Description  string   `json:"description"`
	Technologies []string `json:"technologies"`
}

type ProjectRequest struct {
	Name         string   `json:"name"`
	Description  string   `json:"description"`
	URL          string   `json:"url"`
	GitHubURL    string   `json:"github_url"`
	ImageURL     string   `json:"image_url"`
	Technologies []string `json:"technologies"`
	Featured     bool     `json:"featured"`
}

type TestimonialRequest struct {
	Name           string `json:"name"`
	Role           string `json:"role"`
	Company        string `json:"company"`
	Content        string `json:"content"`
	Rating         int    `json:"rating"`
	AvatarURL      string `json:"avatar_url"`
	CompanyLogoURL string `json:"company_logo_url"`
}

type EducationRequest struct {
	Institution string  `json:"institution"`
	Degree      string  `json:"degree"`
	Field       string  `json:"field"`
	StartDate   string  `json:"start_date"`
	EndDate     *string `json:"end_date,omitempty"`
	GPA         *float64 `json:"gpa,omitempty"`
	Description string  `json:"description"`
}

func parseHTMLDate(dateStr string) (time.Time, error) {
	if dateStr == "" {
		return time.Time{}, fmt.Errorf("date string is required")
	}

	parsed, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		return time.Time{}, err
	}
	return parsed, nil
}

func parseOptionalHTMLDate(dateStr *string) (*time.Time, error) {
	if dateStr == nil {
		return nil, nil
	}
	if *dateStr == "" {
		return nil, nil
	}
	parsed, err := parseHTMLDate(*dateStr)
	if err != nil {
		return nil, err
	}
	return &parsed, nil
}

func (h *AdminHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Simple hardcoded credentials for demo (you should use environment variables)
	if req.Username == "admin" && req.Password == "admin123" {
		// Create JWT token
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"username": req.Username,
			"exp":      time.Now().Add(time.Hour * 24).Unix(), // 24 hours
		})

		tokenString, err := token.SignedString([]byte(h.jwtSecret))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create token"})
			return
		}

		c.JSON(http.StatusOK, LoginResponse{
			Token: tokenString,
			User:  req.Username,
		})
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
	}
}

func (h *AdminHandler) GetDashboard(c *gin.Context) {
	dashboard, err := h.service.GetDashboard()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, dashboard)
}

func (h *AdminHandler) UpdatePortfolio(c *gin.Context) {
	var portfolio models.Portfolio
	if err := c.ShouldBindJSON(&portfolio); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.UpdatePortfolio(&portfolio); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Portfolio updated successfully"})
}

func (h *AdminHandler) CreateSkill(c *gin.Context) {
	var skill models.Skill
	if err := c.ShouldBindJSON(&skill); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.CreateSkill(&skill); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, skill)
}

func (h *AdminHandler) UpdateSkill(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var skill models.Skill
	if err := c.ShouldBindJSON(&skill); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.UpdateSkill(uint(id), &skill); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Skill updated successfully"})
}

func (h *AdminHandler) DeleteSkill(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := h.service.DeleteSkill(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Skill deleted successfully"})
}

func (h *AdminHandler) CreateExperience(c *gin.Context) {
	var experience models.Experience
	if err := c.ShouldBindJSON(&experience); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.CreateExperience(&experience); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, experience)
}

func (h *AdminHandler) UpdateExperience(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var req UpdateExperienceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "JSON binding failed: " + err.Error()})
		return
	}

	// Debug logging
	fmt.Printf("Received update request: %+v\n", req)

	// Parse start date
	startDate, err := parseHTMLDate(req.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start_date format: " + req.StartDate + " - " + err.Error()})
		return
	}

	// Parse end date if provided
	endDate, err := parseOptionalHTMLDate(req.EndDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end_date format: " + *req.EndDate + " - " + err.Error()})
		return
	}

	// Convert to Experience model
	experience := models.Experience{
		Company:      req.Company,
		Position:     req.Position,
		Location:     req.Location,
		StartDate:    startDate,
		EndDate:      endDate,
		Current:      req.Current,
		Description:  req.Description,
		Technologies: req.Technologies,
	}

	if err := h.service.UpdateExperience(uint(id), &experience); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Experience updated successfully"})
}

func (h *AdminHandler) DeleteExperience(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := h.service.DeleteExperience(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Experience deleted successfully"})
}

func (h *AdminHandler) CreateCertification(c *gin.Context) {
	var req CertificationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	issueDate, err := parseHTMLDate(req.IssueDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid issue_date format: " + req.IssueDate + " - " + err.Error()})
		return
	}

	expirationDate, err := parseOptionalHTMLDate(req.ExpirationDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid expiration_date format: " + *req.ExpirationDate + " - " + err.Error()})
		return
	}

	certification := models.Certification{
		Title:          req.Title,
		Issuer:         req.Issuer,
		IssueDate:      issueDate,
		CredentialID:   req.CredentialID,
		CredentialURL:  req.CredentialURL,
		Description:    req.Description,
		ExpirationDate: expirationDate,
	}

	if err := h.service.CreateCertification(&certification); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, certification)
}

func (h *AdminHandler) UpdateCertification(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var req CertificationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	issueDate, err := parseHTMLDate(req.IssueDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid issue_date format: " + req.IssueDate + " - " + err.Error()})
		return
	}

	expirationDate, err := parseOptionalHTMLDate(req.ExpirationDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid expiration_date format: " + *req.ExpirationDate + " - " + err.Error()})
		return
	}

	certification := models.Certification{
		Title:          req.Title,
		Issuer:         req.Issuer,
		IssueDate:      issueDate,
		CredentialID:   req.CredentialID,
		CredentialURL:  req.CredentialURL,
		Description:    req.Description,
		ExpirationDate: expirationDate,
	}

	if err := h.service.UpdateCertification(uint(id), &certification); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Certification updated successfully"})
}

func (h *AdminHandler) DeleteCertification(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := h.service.DeleteCertification(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Certification deleted successfully"})
}

func (h *AdminHandler) CreateVolunteerExperience(c *gin.Context) {
	var req VolunteerExperienceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	startDate, err := parseHTMLDate(req.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start_date format: " + req.StartDate + " - " + err.Error()})
		return
	}

	endDate, err := parseOptionalHTMLDate(req.EndDate)
	if err != nil && req.EndDate != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end_date format: " + *req.EndDate + " - " + err.Error()})
		return
	}

	current := req.Current
	if endDate != nil {
		current = false
	}

	entry := models.VolunteerExperience{
		Organization: req.Organization,
		Role:         req.Role,
		Location:     req.Location,
		StartDate:    startDate,
		EndDate:      endDate,
		Current:      current,
		Description:  req.Description,
		Technologies: pq.StringArray(req.Technologies),
	}

	if err := h.service.CreateVolunteerExperience(&entry); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, entry)
}

func (h *AdminHandler) UpdateVolunteerExperience(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var req VolunteerExperienceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	startDate, err := parseHTMLDate(req.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start_date format: " + req.StartDate + " - " + err.Error()})
		return
	}

	endDate, err := parseOptionalHTMLDate(req.EndDate)
	if err != nil && req.EndDate != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end_date format: " + *req.EndDate + " - " + err.Error()})
		return
	}

	current := req.Current
	if endDate != nil {
		current = false
	}

	entry := models.VolunteerExperience{
		Organization: req.Organization,
		Role:         req.Role,
		Location:     req.Location,
		StartDate:    startDate,
		EndDate:      endDate,
		Current:      current,
		Description:  req.Description,
		Technologies: pq.StringArray(req.Technologies),
	}

	if err := h.service.UpdateVolunteerExperience(uint(id), &entry); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Volunteer experience updated successfully"})
}

func (h *AdminHandler) DeleteVolunteerExperience(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := h.service.DeleteVolunteerExperience(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Volunteer experience deleted successfully"})
}

func (h *AdminHandler) CreateProject(c *gin.Context) {
	var req ProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	project := models.Project{
		Name:         req.Name,
		Description:  req.Description,
		URL:          req.URL,
		GitHubURL:    req.GitHubURL,
		ImageURL:     req.ImageURL,
		Technologies: pq.StringArray(req.Technologies),
		Featured:     req.Featured,
	}

	if err := h.service.CreateProject(&project); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, project)
}

func (h *AdminHandler) UpdateProject(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var req ProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	project := models.Project{
		Name:         req.Name,
		Description:  req.Description,
		URL:          req.URL,
		GitHubURL:    req.GitHubURL,
		ImageURL:     req.ImageURL,
		Technologies: pq.StringArray(req.Technologies),
		Featured:     req.Featured,
	}

	if err := h.service.UpdateProject(uint(id), &project); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project updated successfully"})
}

func (h *AdminHandler) DeleteProject(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := h.service.DeleteProject(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project deleted successfully"})
}

func (h *AdminHandler) CreateTestimonial(c *gin.Context) {
	var req TestimonialRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.Rating == 0 {
		req.Rating = 5
	}

	testimonial := models.ClientTestimonial{
		Name:           req.Name,
		Role:           req.Role,
		Company:        req.Company,
		Content:        req.Content,
		Rating:         req.Rating,
		AvatarURL:      req.AvatarURL,
		CompanyLogoURL: req.CompanyLogoURL,
	}

	if err := h.service.CreateTestimonial(&testimonial); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, testimonial)
}

func (h *AdminHandler) UpdateTestimonial(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var req TestimonialRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.Rating == 0 {
		req.Rating = 5
	}

	testimonial := models.ClientTestimonial{
		Name:           req.Name,
		Role:           req.Role,
		Company:        req.Company,
		Content:        req.Content,
		Rating:         req.Rating,
		AvatarURL:      req.AvatarURL,
		CompanyLogoURL: req.CompanyLogoURL,
	}

	if err := h.service.UpdateTestimonial(uint(id), &testimonial); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Testimonial updated successfully"})
}

func (h *AdminHandler) DeleteTestimonial(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := h.service.DeleteTestimonial(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Testimonial deleted successfully"})
}

func (h *AdminHandler) CreateEducation(c *gin.Context) {
	var req EducationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	startDate, err := parseHTMLDate(req.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start_date format: " + req.StartDate + " - " + err.Error()})
		return
	}

	endDate, err := parseOptionalHTMLDate(req.EndDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end_date format: " + *req.EndDate + " - " + err.Error()})
		return
	}

	education := models.Education{
		Institution: req.Institution,
		Degree:      req.Degree,
		Field:       req.Field,
		StartDate:   startDate,
		EndDate:     endDate,
		GPA:         0,
		Description: req.Description,
	}

	if req.GPA != nil {
		education.GPA = *req.GPA
	}

	if err := h.service.CreateEducation(&education); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, education)
}

func (h *AdminHandler) UpdateEducation(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var req EducationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	startDate, err := parseHTMLDate(req.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start_date format: " + req.StartDate + " - " + err.Error()})
		return
	}

	endDate, err := parseOptionalHTMLDate(req.EndDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end_date format: " + *req.EndDate + " - " + err.Error()})
		return
	}

	education := models.Education{
		Institution: req.Institution,
		Degree:      req.Degree,
		Field:       req.Field,
		StartDate:   startDate,
		EndDate:     endDate,
		GPA:         0,
		Description: req.Description,
	}

	if req.GPA != nil {
		education.GPA = *req.GPA
	}

	if err := h.service.UpdateEducation(uint(id), &education); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Education updated successfully"})
}

func (h *AdminHandler) DeleteEducation(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := h.service.DeleteEducation(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Education deleted successfully"})
}

func (h *AdminHandler) CreatePublication(c *gin.Context) {
	var publication models.Publication
	if err := c.ShouldBindJSON(&publication); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.CreatePublication(&publication); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, publication)
}

func (h *AdminHandler) UpdatePublication(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var publication models.Publication
	if err := c.ShouldBindJSON(&publication); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.UpdatePublication(uint(id), &publication); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Publication updated successfully"})
}

func (h *AdminHandler) DeletePublication(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := h.service.DeletePublication(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Publication deleted successfully"})
}

func (h *AdminHandler) SyncGitHubProjects(c *gin.Context) {
	var request struct {
		Username string `json:"username"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.SyncGitHubProjects(request.Username); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "GitHub projects synced successfully"})
}

func (h *AdminHandler) GetContactMessages(c *gin.Context) {
	messages, err := h.service.GetContactMessages()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, messages)
}

func (h *AdminHandler) MarkMessageAsRead(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := h.service.MarkMessageAsRead(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Message marked as read"})
}
