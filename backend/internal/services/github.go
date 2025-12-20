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

	repos, _, err := s.client.Repositories.List(ctx, username, opt)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch repositories: %w", err)
	}

	return repos, nil
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
