package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"portfolio-backend/internal/models"
	"portfolio-backend/internal/services"
)

type PortfolioHandler struct {
	service          *services.PortfolioService
	schedulerService *services.SchedulerService
}

func NewPortfolioHandler(service *services.PortfolioService, schedulerService *services.SchedulerService) *PortfolioHandler {
	return &PortfolioHandler{
		service:          service,
		schedulerService: schedulerService,
	}
}

func (h *PortfolioHandler) GetPortfolio(c *gin.Context) {
	portfolio, err := h.service.GetPortfolio()
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, portfolio)
}

func (h *PortfolioHandler) GetSkills(c *gin.Context) {
	skills, err := h.service.GetSkills()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, skills)
}

func (h *PortfolioHandler) GetExperience(c *gin.Context) {
	experience, err := h.service.GetExperience()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, experience)
}

func (h *PortfolioHandler) GetCertifications(c *gin.Context) {
	certifications, err := h.service.GetCertifications()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, certifications)
}

func (h *PortfolioHandler) GetVolunteerExperience(c *gin.Context) {
	volunteer, err := h.service.GetVolunteerExperience()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, volunteer)
}

func (h *PortfolioHandler) GetEducation(c *gin.Context) {
	education, err := h.service.GetEducation()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, education)
}

func (h *PortfolioHandler) GetPublications(c *gin.Context) {
	publications, err := h.service.GetPublications()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, publications)
}

func (h *PortfolioHandler) GetProjects(c *gin.Context) {
	projects, err := h.service.GetProjects()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, projects)
}

func (h *PortfolioHandler) GetTestimonials(c *gin.Context) {
	testimonials, err := h.service.GetTestimonials()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, testimonials)
}

func (h *PortfolioHandler) SendContactMessage(c *gin.Context) {
	var message models.ContactMessage
	if err := c.ShouldBindJSON(&message); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.SendContactMessage(&message); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Contact message sent successfully"})
}

func (h *PortfolioHandler) GetGitHubStats(c *gin.Context) {
	stats, err := h.schedulerService.GetCachedStats("github")
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "GitHub stats not available"})
		return
	}
	c.JSON(http.StatusOK, stats)
}

func (h *PortfolioHandler) GetLeetCodeStats(c *gin.Context) {
	stats, err := h.schedulerService.GetCachedStats("leetcode")
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "LeetCode stats not available"})
		return
	}
	c.JSON(http.StatusOK, stats)
}

func (h *PortfolioHandler) GetGeeksforGeeksStats(c *gin.Context) {
	stats, err := h.schedulerService.GetCachedStats("geeksforgeeks")
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "GeeksforGeeks stats not available"})
		return
	}
	c.JSON(http.StatusOK, stats)
}

// Manual trigger for updating stats (for testing)
func (h *PortfolioHandler) UpdateStats(c *gin.Context) {
	// Trigger immediate stats update
	go func() {
		h.schedulerService.RunScheduledTasks()
	}()

	c.JSON(http.StatusOK, gin.H{
		"message": "Stats update triggered successfully",
		"status":  "processing",
	})
}
