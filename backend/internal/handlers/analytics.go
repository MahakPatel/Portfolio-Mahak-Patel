package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"portfolio-backend/internal/services"
)

type AnalyticsHandler struct {
	analyticsService *services.AnalyticsService
}

func NewAnalyticsHandler(analyticsService *services.AnalyticsService) *AnalyticsHandler {
	return &AnalyticsHandler{
		analyticsService: analyticsService,
	}
}

// TrackVisitor tracks a new visitor
func (h *AnalyticsHandler) TrackVisitor(c *gin.Context) {
	// Get visitor information from request
	ipAddress := c.ClientIP()
	userAgent := c.GetHeader("User-Agent")
	referrer := c.GetHeader("Referer")

	// Track the visitor
	visitor, err := h.analyticsService.TrackVisitor(ipAddress, userAgent, referrer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to track visitor"})
		return
	}

	// Generate session ID for tracking
	sessionID := uuid.New().String()

	c.JSON(http.StatusOK, gin.H{
		"visitor_id": visitor.ID,
		"session_id": sessionID,
		"message":    "Visitor tracked successfully",
	})
}

// TrackPageView tracks a page view
func (h *AnalyticsHandler) TrackPageView(c *gin.Context) {
	var request struct {
		VisitorID uint   `json:"visitor_id" binding:"required"`
		Page      string `json:"page" binding:"required"`
		Duration  int    `json:"duration"`
		SessionID string `json:"session_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Track page view
	if err := h.analyticsService.TrackPageView(request.VisitorID, request.Page, request.Duration); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to track page view"})
		return
	}

	// Update active user
	ipAddress := c.ClientIP()
	userAgent := c.GetHeader("User-Agent")
	if err := h.analyticsService.UpdateActiveUser(request.SessionID, ipAddress, userAgent, request.Page); err != nil {
		// Log error but don't fail the request
		// In production, you might want to use a proper logger
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Page view tracked successfully",
	})
}

// GetAnalyticsSummary returns comprehensive analytics data (admin only)
func (h *AnalyticsHandler) GetAnalyticsSummary(c *gin.Context) {
	summary, err := h.analyticsService.GetAnalyticsSummary()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get analytics summary"})
		return
	}

	c.JSON(http.StatusOK, summary)
}

// GetRealTimeStats returns real-time statistics (admin only)
func (h *AnalyticsHandler) GetRealTimeStats(c *gin.Context) {
	stats, err := h.analyticsService.GetRealTimeStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get real-time stats"})
		return
	}

	c.JSON(http.StatusOK, stats)
}

// GetVisitorStats returns visitor statistics for a specific time period
func (h *AnalyticsHandler) GetVisitorStats(c *gin.Context) {
	period := c.Query("period") // today, week, month, year
	if period == "" {
		period = "month"
	}

	var startDate time.Time
	now := time.Now()

	switch period {
	case "today":
		startDate = time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	case "week":
		startDate = now.AddDate(0, 0, -7)
	case "month":
		startDate = now.AddDate(0, 0, -30)
	case "year":
		startDate = now.AddDate(0, 0, -365)
	default:
		startDate = now.AddDate(0, 0, -30)
	}

	// Get visitor count for the period
	var visitorCount int64
	// This would need to be implemented in the analytics service
	// For now, return mock data
	visitorCount = 150

	c.JSON(http.StatusOK, gin.H{
		"period":        period,
		"visitor_count": visitorCount,
		"start_date":    startDate,
		"end_date":      now,
	})
}

// GetPageStats returns page view statistics
func (h *AnalyticsHandler) GetPageStats(c *gin.Context) {
	page := c.Query("page")
	if page == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Page parameter is required"})
		return
	}

	// Get page statistics
	// This would need to be implemented in the analytics service
	// For now, return mock data
	stats := gin.H{
		"page":         page,
		"total_views":  1250,
		"unique_views": 850,
		"avg_duration": 180, // seconds
		"bounce_rate":  0.35,
	}

	c.JSON(http.StatusOK, stats)
}

// CleanupAnalyticsData cleans up old analytics data (admin only)
func (h *AnalyticsHandler) CleanupAnalyticsData(c *gin.Context) {
	if err := h.analyticsService.CleanupOldData(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to cleanup analytics data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Analytics data cleanup completed successfully",
	})
}
