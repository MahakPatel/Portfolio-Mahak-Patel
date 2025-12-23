package main

import (
	"log"
	"os"
	"strings"

	"portfolio-backend/internal/config"
	"portfolio-backend/internal/database"
	"portfolio-backend/internal/handlers"
	"portfolio-backend/internal/middleware"
	"portfolio-backend/internal/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env only for local development
	if os.Getenv("RENDER") == "" {
		_ = godotenv.Load()
	}

	// Load config
	cfg := config.Load()

	// Initialize database
	db, err := database.Initialize(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Run migrations (non-fatal)
	if err := database.Migrate(db); err != nil {
		log.Printf("Migration warning (non-fatal): %v", err)
	}

	// Initialize services
	githubService := services.NewGitHubService(cfg.GitHubToken)
	emailService := services.NewEmailService()
	portfolioService := services.NewPortfolioService(db, githubService, emailService)
	schedulerService := services.NewSchedulerService(db, githubService, emailService)
	analyticsService := services.NewAnalyticsService(db)

	// Set GitHub username for scheduler
	schedulerService.SetGitHubUsername(cfg.GitHubUsername)

	// Start scheduler service
	schedulerService.StartScheduler()

	// Initialize handlers
	portfolioHandler := handlers.NewPortfolioHandler(portfolioService, schedulerService)
	adminHandler := handlers.NewAdminHandler(portfolioService, cfg.JWTSecret)
	analyticsHandler := handlers.NewAnalyticsHandler(analyticsService)

	// Create Gin router
	router := gin.New()
	router.Use(gin.Logger(), gin.Recovery())

	// =========================
	// ✅ CORS CONFIGURATION
	// =========================
	router.Use(cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			// Allow local dev
			if origin == "http://localhost:3000" {
				return true
			}
			// Allow Vercel prod + preview deployments
			if strings.HasSuffix(origin, ".vercel.app") {
				return true
			}
			return false
		},
		AllowMethods: []string{
			"GET", "POST", "PUT", "DELETE", "OPTIONS",
		},
		AllowHeaders: []string{
			"Origin", "Content-Type", "Accept", "Authorization",
		},
		ExposeHeaders: []string{
			"Content-Length",
		},
		AllowCredentials: true,
	}))

	// =========================
	// Health check
	// =========================
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "healthy"})
	})

	// =========================
	// Public API routes
	// =========================
	api := router.Group("/api/v1")
	{
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "healthy"})
		})

		api.GET("/portfolio", portfolioHandler.GetPortfolio)
		api.GET("/projects", portfolioHandler.GetProjects)
		api.GET("/testimonials", portfolioHandler.GetTestimonials)
		api.GET("/skills", portfolioHandler.GetSkills)
		api.GET("/experience", portfolioHandler.GetExperience)
		api.GET("/certifications", portfolioHandler.GetCertifications)
		api.GET("/volunteer-experiences", portfolioHandler.GetVolunteerExperience)
		api.GET("/education", portfolioHandler.GetEducation)
		api.GET("/publications", portfolioHandler.GetPublications)
		api.POST("/contact", portfolioHandler.SendContactMessage)

		// Stats routes
		api.GET("/stats/github", portfolioHandler.GetGitHubStats)
		api.GET("/stats/leetcode", portfolioHandler.GetLeetCodeStats)
		api.GET("/stats/geeksforgeeks", portfolioHandler.GetGeeksforGeeksStats)
		api.POST("/stats/update", portfolioHandler.UpdateStats)

		// Admin login (public route)
		api.POST("/admin/login", adminHandler.Login)
	}

	// =========================
	// Admin routes (JWT protected)
	// =========================
	admin := router.Group("/api/v1/admin")
	admin.Use(middleware.AuthMiddleware(cfg.JWTSecret))
	{
		admin.GET("/dashboard", adminHandler.GetDashboard)

		admin.PUT("/portfolio", adminHandler.UpdatePortfolio)

		admin.POST("/skills", adminHandler.CreateSkill)
		admin.PUT("/skills/:id", adminHandler.UpdateSkill)
		admin.DELETE("/skills/:id", adminHandler.DeleteSkill)

		admin.POST("/experience", adminHandler.CreateExperience)
		admin.PUT("/experience/:id", adminHandler.UpdateExperience)
		admin.DELETE("/experience/:id", adminHandler.DeleteExperience)

		admin.POST("/certifications", adminHandler.CreateCertification)
		admin.PUT("/certifications/:id", adminHandler.UpdateCertification)
		admin.DELETE("/certifications/:id", adminHandler.DeleteCertification)

		admin.POST("/volunteer-experiences", adminHandler.CreateVolunteerExperience)
		admin.PUT("/volunteer-experiences/:id", adminHandler.UpdateVolunteerExperience)
		admin.DELETE("/volunteer-experiences/:id", adminHandler.DeleteVolunteerExperience)

		admin.POST("/education", adminHandler.CreateEducation)
		admin.PUT("/education/:id", adminHandler.UpdateEducation)
		admin.DELETE("/education/:id", adminHandler.DeleteEducation)

		admin.POST("/publications", adminHandler.CreatePublication)
		admin.PUT("/publications/:id", adminHandler.UpdatePublication)
		admin.DELETE("/publications/:id", adminHandler.DeletePublication)

		admin.POST("/projects", adminHandler.CreateProject)
		admin.PUT("/projects/:id", adminHandler.UpdateProject)
		admin.DELETE("/projects/:id", adminHandler.DeleteProject)

		admin.POST("/testimonials", adminHandler.CreateTestimonial)
		admin.PUT("/testimonials/:id", adminHandler.UpdateTestimonial)
		admin.DELETE("/testimonials/:id", adminHandler.DeleteTestimonial)

		admin.GET("/messages", adminHandler.GetContactMessages)
		admin.PUT("/messages/:id/read", adminHandler.MarkMessageAsRead)

		admin.POST("/sync-github", adminHandler.SyncGitHubProjects)

		// Analytics routes
		admin.GET("/analytics", analyticsHandler.GetAnalyticsSummary)
		admin.GET("/analytics/realtime", analyticsHandler.GetRealTimeStats)
	}

	// =========================
	// Start server
	// =========================
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(router.Run(":" + port))
}
