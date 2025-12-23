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
	githubUsername string
}

func NewSchedulerService(db *gorm.DB, githubService *GitHubService, emailService *EmailService) *SchedulerService {
	return &SchedulerService{
		db:            db,
		githubService: githubService,
		emailService:  emailService,
		githubUsername: "", // Will be set via SetGitHubUsername
	}
}

// SetGitHubUsername sets the GitHub username for fetching stats
func (s *SchedulerService) SetGitHubUsername(username string) {
	s.githubUsername = username
}

type CachedStats struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Platform    string    `json:"platform" gorm:"uniqueIndex"`
	Data        string    `json:"data" gorm:"type:text"`
	LastUpdated time.Time `json:"last_updated"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}


func (s *SchedulerService) StartScheduler() {
	log.Println("Starting scheduler service...")

	// Run immediately on startup
	go s.runScheduledTasks()

	// Schedule daily runs (every day at 2 AM)
	ticker := time.NewTicker(1 * time.Hour) // Check every hour
	go func() {
		lastRunDate := time.Now().Format("2006-01-02")
		for {
			select {
			case <-ticker.C:
				now := time.Now()
				currentDate := now.Format("2006-01-02")
				// Run at 2 AM every day (only once per day)
				if now.Hour() == 2 && now.Minute() < 5 && currentDate != lastRunDate {
					log.Println("Running daily scheduled tasks...")
					s.runScheduledTasks()
					lastRunDate = currentDate
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

	// Get GitHub username
	username := s.githubUsername
	if username == "" {
		username = "mahakpatel" // Fallback default
		log.Printf("Warning: GitHub username not set, using default: %s", username)
	}

	// Fetch real GitHub stats using GitHubService
	stats, err := s.githubService.GetUserStats(username)
	if err != nil {
		log.Printf("Error fetching GitHub stats: %v", err)
		// Return error to allow retry
		return fmt.Errorf("failed to fetch GitHub stats: %w", err)
	}

	// Convert GitHubStats to map for caching
	statsMap := map[string]interface{}{
		"username":            stats.Username,
		"totalStars":          stats.TotalStars,
		"totalForks":          stats.TotalForks,
		"totalRepos":          stats.TotalRepos,
		"totalCommits":        stats.TotalCommits,
		"totalContributions":  stats.TotalContributions,
		"currentStreak":       stats.CurrentStreak,
		"longestStreak":       stats.LongestStreak,
		"streakEndDate":       stats.StreakEndDate,
		"longestStreakPeriod": stats.LongestStreakPeriod,
		"languages":           stats.Languages,
		"recentRepos":         convertReposToMap(stats.RecentRepos),
		"fetchedAt":           stats.FetchedAt,
	}

	log.Printf("Successfully fetched GitHub stats for %s: %d repos, %d stars, %d forks", 
		username, stats.TotalRepos, stats.TotalStars, stats.TotalForks)

	return s.cacheStats("github", statsMap)
}

// convertReposToMap converts RepositoryInfo slice to map slice for JSON storage
func convertReposToMap(repos []RepositoryInfo) []map[string]interface{} {
	result := make([]map[string]interface{}, len(repos))
	for i, repo := range repos {
		result[i] = map[string]interface{}{
			"name":        repo.Name,
			"description": repo.Description,
			"stars":       repo.Stars,
			"forks":       repo.Forks,
			"language":    repo.Language,
			"url":         repo.URL,
			"updated_at":  repo.UpdatedAt.Format(time.RFC3339),
		}
	}
	return result
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
