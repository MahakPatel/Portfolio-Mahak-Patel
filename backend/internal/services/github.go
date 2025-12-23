package services

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/google/go-github/v56/github"
	"golang.org/x/oauth2"
	"gorm.io/gorm"

	"portfolio-backend/internal/models"
)

type GitHubService struct {
	client *github.Client
	token  string
}

func NewGitHubService(token string) *GitHubService {
	var client *github.Client

	if token != "" {
		ctx := context.Background()
		ts := oauth2.StaticTokenSource(
			&oauth2.Token{AccessToken: token},
		)
		tc := oauth2.NewClient(ctx, ts)
		client = github.NewClient(tc)
	} else {
		client = github.NewClient(nil)
	}

	return &GitHubService{
		client: client,
		token:  token,
	}
}

func (s *GitHubService) GetUserRepositories(username string) ([]*github.Repository, error) {
	ctx := context.Background()

	opt := &github.RepositoryListOptions{
		Type:        "public",
		Sort:        "updated",
		Direction:   "desc",
		ListOptions: github.ListOptions{PerPage: 100},
	}

	var allRepos []*github.Repository
	for {
		repos, resp, err := s.client.Repositories.List(ctx, username, opt)
		if err != nil {
			return nil, fmt.Errorf("failed to fetch repositories: %w", err)
		}
		allRepos = append(allRepos, repos...)
		if resp.NextPage == 0 {
			break
		}
		opt.Page = resp.NextPage
	}

	return allRepos, nil
}

func (s *GitHubService) SyncProjectsToDatabase(db *gorm.DB, username string) error {
	repos, err := s.GetUserRepositories(username)
	if err != nil {
		return err
	}

	for _, repo := range repos {
		if repo.Fork != nil && *repo.Fork {
			continue // Skip forked repositories
		}

		var project models.Project
		result := db.Where("github_url = ?", repo.GetHTMLURL()).First(&project)

		if result.Error == gorm.ErrRecordNotFound {
			// Create new project
			language := repo.GetLanguage()
			project = models.Project{
				Name:         repo.GetName(),
				Description:  repo.GetDescription(),
				URL:          repo.GetHomepage(),
				GitHubURL:    repo.GetHTMLURL(),
				Technologies: extractTechnologies(&language),
				Featured:     false,
			}

			if err := db.Create(&project).Error; err != nil {
				log.Printf("Failed to create project %s: %v", repo.GetName(), err)
			}
		} else if result.Error == nil {
			// Update existing project
			language := repo.GetLanguage()
			project.Name = repo.GetName()
			project.Description = repo.GetDescription()
			project.URL = repo.GetHomepage()
			project.Technologies = extractTechnologies(&language)
			project.UpdatedAt = time.Now()

			if err := db.Save(&project).Error; err != nil {
				log.Printf("Failed to update project %s: %v", repo.GetName(), err)
			}
		}
	}

	log.Printf("Synced %d projects from GitHub", len(repos))
	return nil
}

func extractTechnologies(language *string) []string {
	if language == nil {
		return []string{}
	}
	return []string{*language}
}

// GitHubStats represents comprehensive GitHub statistics
type GitHubStats struct {
	Username            string                 `json:"username"`
	TotalStars          int                    `json:"totalStars"`
	TotalForks          int                    `json:"totalForks"`
	TotalRepos          int                    `json:"totalRepos"`
	TotalCommits        int                    `json:"totalCommits"`
	TotalContributions  int                    `json:"totalContributions"`
	CurrentStreak       int                    `json:"currentStreak"`
	LongestStreak       int                    `json:"longestStreak"`
	StreakEndDate       string                 `json:"streakEndDate"`
	LongestStreakPeriod string                 `json:"longestStreakPeriod"`
	Languages           map[string]int         `json:"languages"`
	RecentRepos         []RepositoryInfo       `json:"recentRepos"`
	FetchedAt           time.Time              `json:"fetchedAt"`
}

// RepositoryInfo represents repository information
type RepositoryInfo struct {
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Stars       int       `json:"stars"`
	Forks       int       `json:"forks"`
	Language    string    `json:"language"`
	URL         string    `json:"url"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// GetUserStats fetches comprehensive GitHub statistics for a user
func (s *GitHubService) GetUserStats(username string) (*GitHubStats, error) {
	ctx := context.Background()

	// Get user information
	user, _, err := s.client.Users.Get(ctx, username)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user: %w", err)
	}

	// Get all repositories
	repos, err := s.GetUserRepositories(username)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch repositories: %w", err)
	}

	// Calculate statistics
	stats := &GitHubStats{
		Username:   user.GetLogin(),
		TotalRepos: user.GetPublicRepos(),
		Languages:  make(map[string]int),
		RecentRepos: make([]RepositoryInfo, 0),
	}

	// Process repositories
	totalStars := 0
	totalForks := 0
	languageBytes := make(map[string]int)

	for _, repo := range repos {
		// Skip forks
		if repo.GetFork() {
			continue
		}

		// Count stars and forks
		totalStars += repo.GetStargazersCount()
		totalForks += repo.GetForksCount()

		// Get language statistics
		langs, _, err := s.client.Repositories.ListLanguages(ctx, username, repo.GetName())
		if err == nil {
			for lang, bytes := range langs {
				languageBytes[lang] += bytes
			}
		}

		// Add to recent repos (limit to 10 most recent)
		if len(stats.RecentRepos) < 10 {
			stats.RecentRepos = append(stats.RecentRepos, RepositoryInfo{
				Name:        repo.GetName(),
				Description: repo.GetDescription(),
				Stars:       repo.GetStargazersCount(),
				Forks:       repo.GetForksCount(),
				Language:    repo.GetLanguage(),
				URL:         repo.GetHTMLURL(),
				UpdatedAt:   repo.GetUpdatedAt().Time,
			})
		}
	}

	stats.TotalStars = totalStars
	stats.TotalForks = totalForks

	// Calculate language percentages (convert bytes to percentages)
	totalBytes := 0
	for _, bytes := range languageBytes {
		totalBytes += bytes
	}

	if totalBytes > 0 {
		for lang, bytes := range languageBytes {
			// Convert to percentage (0-100)
			percentage := (bytes * 100) / totalBytes
			if percentage > 0 {
				stats.Languages[lang] = percentage
			}
		}
	}

	// Get contribution statistics using GraphQL API
	// Note: GitHub REST API doesn't provide contribution stats directly
	// We'll use a simplified approach or leave these as 0 if not available
	stats.TotalCommits = 0 // Would need GraphQL API for accurate count
	stats.TotalContributions = 0
	stats.CurrentStreak = 0
	stats.LongestStreak = 0
	stats.StreakEndDate = ""
	stats.LongestStreakPeriod = ""

	stats.FetchedAt = time.Now()

	return stats, nil
}

// GetContributionStats attempts to fetch contribution statistics
// Note: This requires GraphQL API or a third-party service
// For now, we'll return placeholder values that can be enhanced later
func (s *GitHubService) GetContributionStats(username string) (map[string]interface{}, error) {
	// GitHub's REST API doesn't provide contribution graph data directly
	// You would need to use GraphQL API or a service like github-readme-stats
	// For now, return empty stats
	return map[string]interface{}{
		"totalContributions": 0,
		"currentStreak":      0,
		"longestStreak":      0,
		"streakEndDate":      "",
		"longestStreakPeriod": "",
	}, nil
}
