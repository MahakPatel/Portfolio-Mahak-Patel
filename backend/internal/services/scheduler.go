package services

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"gorm.io/gorm"
)

type SchedulerService struct {
	db            *gorm.DB
	githubService *GitHubService
	emailService  *EmailService
}

type CachedStats struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Platform    string    `json:"platform" gorm:"uniqueIndex"`
	Data        string    `json:"data" gorm:"type:text"`
	LastUpdated time.Time `json:"last_updated"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func NewSchedulerService(db *gorm.DB, githubService *GitHubService, emailService *EmailService) *SchedulerService {
	return &SchedulerService{
		db:            db,
		githubService: githubService,
		emailService:  emailService,
	}
}

func (s *SchedulerService) StartScheduler() {
	log.Println("Starting scheduler service...")

	// Run immediately on startup
	go s.runScheduledTasks()

	// Schedule weekly runs (every Sunday at 2 AM)
	ticker := time.NewTicker(24 * time.Hour)
	go func() {
		for {
			select {
			case <-ticker.C:
				now := time.Now()
				// Check if it's Sunday at 2 AM
				if now.Weekday() == time.Sunday && now.Hour() == 2 {
					log.Println("Running weekly scheduled tasks...")
					s.runScheduledTasks()
				}
			}
		}
	}()
}

func (s *SchedulerService) runScheduledTasks() {
	log.Println("Running scheduled data fetching tasks...")

	// Fetch GitHub stats
	if err := s.fetchGitHubStats(); err != nil {
		log.Printf("Error fetching GitHub stats: %v", err)
	}

	// Fetch LeetCode stats
	if err := s.fetchLeetCodeStats(); err != nil {
		log.Printf("Error fetching LeetCode stats: %v", err)
	}

	// Fetch GeeksforGeeks stats
	if err := s.fetchGeeksforGeeksStats(); err != nil {
		log.Printf("Error fetching GeeksforGeeks stats: %v", err)
	}

	log.Println("Scheduled tasks completed")
}

// Public method to manually trigger stats update
func (s *SchedulerService) RunScheduledTasks() {
	s.runScheduledTasks()
}

func (s *SchedulerService) fetchGitHubStats() error {
	log.Println("Fetching GitHub stats...")

	// Get GitHub username from environment or config
	username := "mahakpatel" // Updated to correct username

	// Fetch GitHub stats (this would need to be implemented in GitHubService)
	// For now, we'll create a placeholder
	stats := map[string]interface{}{
		"username":            username,
		"totalStars":          10,
		"totalForks":          0,
		"totalRepos":          10,
		"totalCommits":        150,
		"totalContributions":  3323,
		"longestStreak":       104,
		"streakEndDate":       "Sep 30, 2024",
		"longestStreakPeriod": "Jun 19, 2024 - Sep 30, 2024",
		"languages": map[string]int{
			"C++":    40,
			"Python": 25,
			"CSS":    15,
			"Dart":   10,
			"Go":     10,
		},
		"recentRepos": []map[string]interface{}{
			{
				"name":        "LeetCode",
				"description": "LeetCode solutions and algorithms",
				"url":         fmt.Sprintf("https://github.com/%s/LeetCode", username),
				"stars":       1,
				"language":    "C++",
			},
			{
				"name":        "GeeksForGeeks",
				"description": "GeeksforGeeks practice problems",
				"url":         fmt.Sprintf("https://github.com/%s/GeeksForGeeks", username),
				"stars":       1,
				"language":    "C++",
			},
			{
				"name":        "Online-Salon-Management",
				"description": "Salon booking and management system",
				"url":         fmt.Sprintf("https://github.com/%s/Online-Salon-Management", username),
				"stars":       1,
				"language":    "CSS",
			},
			{
				"name":        "Restaurant-Billing-System",
				"description": "Restaurant billing and inventory system",
				"url":         fmt.Sprintf("https://github.com/%s/Restaurant-Billing-System", username),
				"stars":       1,
				"language":    "Python",
			},
			{
				"name":        "News_App",
				"description": "Mobile news application",
				"url":         fmt.Sprintf("https://github.com/%s/News_App", username),
				"stars":       1,
				"language":    "Dart",
			},
		},
		"fetchedAt": time.Now(),
	}

	return s.cacheStats("github", stats)
}

func (s *SchedulerService) fetchLeetCodeStats() error {
	log.Println("Fetching LeetCode stats...")

	// Fetch from LeetCode Stats API
	username := "mahakpatel0208"
	_ = fmt.Sprintf("https://leetcode-stats-api.herokuapp.com/%s", username) // URL for future API implementation

	// For now, we'll use mock data, but you can implement actual API calls
	stats := map[string]interface{}{
		"username":     username,
		"totalSolved":  89,
		"easySolved":   45,
		"mediumSolved": 35,
		"hardSolved":   9,
		"maxStreak":    47,
		"ranking":      12345,
		"fetchedAt":    time.Now(),
	}

	return s.cacheStats("leetcode", stats)
}

func (s *SchedulerService) fetchGeeksforGeeksStats() error {
	log.Println("Fetching GeeksforGeeks stats...")

	// Mock data for GeeksforGeeks (since they don't have a public API)
	stats := map[string]interface{}{
		"username":     "mahakpat5zpi",
		"totalSolved":  120,
		"codingScore":  385,
		"ranking":      1,
		"streak":       2,
		"basicSolved":  30,
		"easySolved":   50,
		"mediumSolved": 35,
		"hardSolved":   5,
		"fetchedAt":    time.Now(),
	}

	return s.cacheStats("geeksforgeeks", stats)
}

func (s *SchedulerService) cacheStats(platform string, data map[string]interface{}) error {
	// Convert data to JSON string for storage
	jsonData, err := json.Marshal(data)
	if err != nil {
		return fmt.Errorf("failed to marshal stats data: %w", err)
	}

	// Check if stats already exist
	var cachedStats CachedStats
	result := s.db.Where("platform = ?", platform).First(&cachedStats)

	if result.Error == gorm.ErrRecordNotFound {
		// Create new record
		cachedStats = CachedStats{
			Platform:    platform,
			Data:        string(jsonData),
			LastUpdated: time.Now(),
		}
		return s.db.Create(&cachedStats).Error
	} else if result.Error != nil {
		return fmt.Errorf("failed to query cached stats: %w", result.Error)
	}

	// Update existing record
	cachedStats.Data = string(jsonData)
	cachedStats.LastUpdated = time.Now()
	return s.db.Save(&cachedStats).Error
}

func (s *SchedulerService) GetCachedStats(platform string) (map[string]interface{}, error) {
	var cachedStats CachedStats
	result := s.db.Where("platform = ?", platform).First(&cachedStats)

	if result.Error == gorm.ErrRecordNotFound {
		return nil, fmt.Errorf("no cached stats found for platform: %s", platform)
	} else if result.Error != nil {
		return nil, fmt.Errorf("failed to query cached stats: %w", result.Error)
	}

	var data map[string]interface{}
	if err := json.Unmarshal([]byte(cachedStats.Data), &data); err != nil {
		return nil, fmt.Errorf("failed to unmarshal cached stats: %w", err)
	}

	return data, nil
}

func (s *SchedulerService) IsStatsFresh(platform string, maxAge time.Duration) bool {
	var cachedStats CachedStats
	result := s.db.Where("platform = ?", platform).First(&cachedStats)

	if result.Error != nil {
		return false
	}

	return time.Since(cachedStats.LastUpdated) < maxAge
}
