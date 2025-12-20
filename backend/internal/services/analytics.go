package services

import (
	"fmt"
	"log"
	"strings"
	"time"

	"gorm.io/gorm"

	"portfolio-backend/internal/models"
)

type AnalyticsService struct {
	db *gorm.DB
}

func NewAnalyticsService(db *gorm.DB) *AnalyticsService {
	return &AnalyticsService{
		db: db,
	}
}

// TrackVisitor records a new visitor
func (s *AnalyticsService) TrackVisitor(ipAddress, userAgent, referrer string) (*models.Visitor, error) {
	// Check if visitor already exists today
	var existingVisitor models.Visitor
	result := s.db.Where("ip_address = ? AND user_agent = ? AND DATE(created_at) = ?",
		ipAddress, userAgent, time.Now().Format("2006-01-02")).First(&existingVisitor)

	if result.Error == nil {
		// Visitor already exists today, return existing
		return &existingVisitor, nil
	}

	// Get location info (simplified - in production you'd use a GeoIP service)
	country, city := s.getLocationFromIP(ipAddress)

	visitor := &models.Visitor{
		IPAddress: ipAddress,
		UserAgent: userAgent,
		Country:   country,
		City:      city,
		Referrer:  referrer,
		CreatedAt: time.Now(),
	}

	if err := s.db.Create(visitor).Error; err != nil {
		return nil, fmt.Errorf("failed to create visitor: %w", err)
	}

	log.Printf("New visitor tracked: %s from %s, %s", ipAddress, city, country)
	return visitor, nil
}

// TrackPageView records a page view
func (s *AnalyticsService) TrackPageView(visitorID uint, page string, duration int) error {
	pageView := &models.PageView{
		VisitorID: visitorID,
		Page:      page,
		Duration:  duration,
		CreatedAt: time.Now(),
	}

	if err := s.db.Create(pageView).Error; err != nil {
		return fmt.Errorf("failed to create page view: %w", err)
	}

	return nil
}

// UpdateActiveUser updates or creates an active user session
func (s *AnalyticsService) UpdateActiveUser(sessionID, ipAddress, userAgent, page string) error {
	now := time.Now()

	// Clean up old active users (older than 30 minutes)
	s.db.Where("last_seen < ?", now.Add(-30*time.Minute)).Delete(&models.ActiveUser{})

	var activeUser models.ActiveUser
	result := s.db.Where("session_id = ?", sessionID).First(&activeUser)

	if result.Error == gorm.ErrRecordNotFound {
		// Create new active user
		activeUser = models.ActiveUser{
			SessionID: sessionID,
			IPAddress: ipAddress,
			UserAgent: userAgent,
			Page:      page,
			LastSeen:  now,
			CreatedAt: now,
		}
		return s.db.Create(&activeUser).Error
	} else if result.Error != nil {
		return fmt.Errorf("failed to query active user: %w", result.Error)
	}

	// Update existing active user
	activeUser.Page = page
	activeUser.LastSeen = now
	return s.db.Save(&activeUser).Error
}

// GetAnalyticsSummary returns comprehensive analytics data
func (s *AnalyticsService) GetAnalyticsSummary() (*models.AnalyticsSummary, error) {
	now := time.Now()
	today := now.Format("2006-01-02")
	weekAgo := now.AddDate(0, 0, -7).Format("2006-01-02")
	monthAgo := now.AddDate(0, 0, -30).Format("2006-01-02")

	var summary models.AnalyticsSummary

	// Total visitors
	s.db.Model(&models.Visitor{}).Count(&summary.TotalVisitors)

	// Active users (last 30 minutes)
	s.db.Model(&models.ActiveUser{}).Where("last_seen > ?", now.Add(-30*time.Minute)).Count(&summary.ActiveUsers)

	// Total page views
	s.db.Model(&models.PageView{}).Count(&summary.TotalPageViews)

	// Today's visitors
	s.db.Model(&models.Visitor{}).Where("DATE(created_at) = ?", today).Count(&summary.TodayVisitors)

	// This week's visitors
	s.db.Model(&models.Visitor{}).Where("created_at >= ?", weekAgo).Count(&summary.ThisWeekVisitors)

	// This month's visitors
	s.db.Model(&models.Visitor{}).Where("created_at >= ?", monthAgo).Count(&summary.ThisMonthVisitors)

	// Top pages
	var topPages []models.PageStats
	s.db.Raw(`
		SELECT page, COUNT(*) as views, COUNT(DISTINCT visitor_id) as unique_views
		FROM page_views 
		WHERE created_at >= ?
		GROUP BY page 
		ORDER BY views DESC 
		LIMIT 10
	`, monthAgo).Scan(&topPages)
	summary.TopPages = topPages

	// Recent visitors (last 10)
	var recentVisitors []models.Visitor
	s.db.Order("created_at DESC").Limit(10).Find(&recentVisitors)
	summary.RecentVisitors = recentVisitors

	// Active users list
	var activeUsersList []models.ActiveUser
	s.db.Where("last_seen > ?", now.Add(-30*time.Minute)).Order("last_seen DESC").Find(&activeUsersList)
	summary.ActiveUsersList = activeUsersList

	return &summary, nil
}

// GetRealTimeStats returns real-time statistics
func (s *AnalyticsService) GetRealTimeStats() (map[string]interface{}, error) {
	now := time.Now()

	var activeUsers int64
	var pageViewsLastHour int64
	var uniqueVisitorsToday int64

	// Active users (last 30 minutes)
	s.db.Model(&models.ActiveUser{}).Where("last_seen > ?", now.Add(-30*time.Minute)).Count(&activeUsers)

	// Page views in last hour
	s.db.Model(&models.PageView{}).Where("created_at > ?", now.Add(-1*time.Hour)).Count(&pageViewsLastHour)

	// Unique visitors today
	s.db.Model(&models.Visitor{}).Where("DATE(created_at) = ?", now.Format("2006-01-02")).Count(&uniqueVisitorsToday)

	return map[string]interface{}{
		"active_users":          activeUsers,
		"page_views_last_hour":  pageViewsLastHour,
		"unique_visitors_today": uniqueVisitorsToday,
		"timestamp":             now,
	}, nil
}

// getLocationFromIP gets location from IP address (simplified version)
func (s *AnalyticsService) getLocationFromIP(ipAddress string) (string, string) {
	// Skip localhost and private IPs
	if ipAddress == "127.0.0.1" || ipAddress == "::1" || strings.HasPrefix(ipAddress, "192.168.") || strings.HasPrefix(ipAddress, "10.") {
		return "Local", "Local"
	}

	// For demo purposes, return generic location
	// In production, you'd use a GeoIP service like MaxMind or ipapi
	return "Unknown", "Unknown"
}

// CleanupOldData removes old analytics data to keep database clean
func (s *AnalyticsService) CleanupOldData() error {
	// Keep only last 90 days of data
	cutoffDate := time.Now().AddDate(0, 0, -90)

	// Delete old visitors
	if err := s.db.Where("created_at < ?", cutoffDate).Delete(&models.Visitor{}).Error; err != nil {
		return fmt.Errorf("failed to cleanup old visitors: %w", err)
	}

	// Delete old page views
	if err := s.db.Where("created_at < ?", cutoffDate).Delete(&models.PageView{}).Error; err != nil {
		return fmt.Errorf("failed to cleanup old page views: %w", err)
	}

	// Delete old active users (keep only last 7 days)
	activeUserCutoff := time.Now().AddDate(0, 0, -7)
	if err := s.db.Where("created_at < ?", activeUserCutoff).Delete(&models.ActiveUser{}).Error; err != nil {
		return fmt.Errorf("failed to cleanup old active users: %w", err)
	}

	log.Println("Analytics data cleanup completed")
	return nil
}
