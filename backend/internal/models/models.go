package models

import (
	"time"

	"github.com/lib/pq"
)

type Portfolio struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name"`
	Title       string    `json:"title"`
	Bio         string    `json:"bio"`
	Email       string    `json:"email"`
	Phone       string    `json:"phone"`
	Location    string    `json:"location"`
	LinkedInURL string    `json:"linkedin_url"`
	GitHubURL   string    `json:"github_url"`
	TwitterURL  string    `json:"twitter_url"`
	WebsiteURL  string    `json:"website_url"`
	AvatarURL   string    `json:"avatar_url"`
	ResumeURL   string    `json:"resume_url"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Skill struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name"`
	Category  string    `json:"category"` // Programming, Tools, Frameworks, etc.
	Level     int       `json:"level"`    // 1-5 scale
	Icon      string    `json:"icon"`     // Icon class or URL
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Experience struct {
	ID           uint           `json:"id" gorm:"primaryKey"`
	Company      string         `json:"company"`
	Position     string         `json:"position"`
	Location     string         `json:"location"`
	StartDate    time.Time      `json:"start_date"`
	EndDate      *time.Time     `json:"end_date,omitempty"`
	Current      bool           `json:"current"`
	Description  string         `json:"description"`
	Technologies pq.StringArray `json:"technologies" gorm:"type:text[]"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
}

type Certification struct {
	ID             uint       `json:"id" gorm:"primaryKey"`
	Title          string     `json:"title"`
	Issuer         string     `json:"issuer"`
	IssueDate      time.Time  `json:"issue_date"`
	ExpirationDate *time.Time `json:"expiration_date,omitempty"`
	CredentialID   string     `json:"credential_id"`
	CredentialURL  string     `json:"credential_url"`
	Description    string     `json:"description"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
}

type VolunteerExperience struct {
	ID           uint           `json:"id" gorm:"primaryKey"`
	Organization string         `json:"organization"`
	Role         string         `json:"role"`
	Location     string         `json:"location"`
	StartDate    time.Time      `json:"start_date"`
	EndDate      *time.Time     `json:"end_date,omitempty"`
	Current      bool           `json:"current"`
	Description  string         `json:"description"`
	Technologies pq.StringArray `json:"technologies" gorm:"type:text[]"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
}

type Education struct {
	ID          uint       `json:"id" gorm:"primaryKey"`
	Institution string     `json:"institution"`
	Degree      string     `json:"degree"`
	Field       string     `json:"field"`
	StartDate   time.Time  `json:"start_date"`
	EndDate     *time.Time `json:"end_date,omitempty"`
	GPA         float64    `json:"gpa,omitempty"`
	Description string     `json:"description"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

type Publication struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Title       string    `json:"title"`
	Authors     string    `json:"authors"`
	Journal     string    `json:"journal"`
	Year        int       `json:"year"`
	DOI         string    `json:"doi"`
	URL         string    `json:"url"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Project struct {
	ID           uint           `json:"id" gorm:"primaryKey"`
	Name         string         `json:"name"`
	Description  string         `json:"description"`
	URL          string         `json:"url"`
	GitHubURL    string         `json:"github_url"`
	ImageURL     string         `json:"image_url"`
	Technologies pq.StringArray `json:"technologies" gorm:"type:text[]"`
	Featured     bool           `json:"featured"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
}

type ClientTestimonial struct {
	ID             uint      `json:"id" gorm:"primaryKey"`
	Name           string    `json:"name"`
	Role           string    `json:"role"`
	Company        string    `json:"company"`
	Content        string    `json:"content"`
	Rating         int       `json:"rating"`
	AvatarURL      string    `json:"avatar_url"`
	CompanyLogoURL string    `json:"company_logo_url"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type ContactMessage struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Subject   string    `json:"subject"`
	Message   string    `json:"message"`
	Read      bool      `json:"read"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Admin struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Username  string    `json:"username" gorm:"unique"`
	Email     string    `json:"email" gorm:"unique"`
	Password  string    `json:"-"` // Don't include password in JSON
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type CachedStats struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Platform    string    `json:"platform" gorm:"uniqueIndex"`
	Data        string    `json:"data" gorm:"type:text"`
	LastUpdated time.Time `json:"last_updated"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Analytics Models
type Visitor struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	IPAddress string    `json:"ip_address"`
	UserAgent string    `json:"user_agent"`
	Country   string    `json:"country"`
	City      string    `json:"city"`
	Referrer  string    `json:"referrer"`
	CreatedAt time.Time `json:"created_at"`
}

type PageView struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	VisitorID uint      `json:"visitor_id"`
	Page      string    `json:"page"`
	Duration  int       `json:"duration"` // in seconds
	CreatedAt time.Time `json:"created_at"`
}

type ActiveUser struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	SessionID string    `json:"session_id" gorm:"uniqueIndex"`
	IPAddress string    `json:"ip_address"`
	UserAgent string    `json:"user_agent"`
	Page      string    `json:"page"`
	LastSeen  time.Time `json:"last_seen"`
	CreatedAt time.Time `json:"created_at"`
}

type PageStats struct {
	Page        string `json:"page"`
	Views       int64  `json:"views"`
	UniqueViews int64  `json:"unique_views"`
}

type AnalyticsSummary struct {
	TotalVisitors     int64        `json:"total_visitors"`
	ActiveUsers       int64        `json:"active_users"`
	TotalPageViews    int64        `json:"total_page_views"`
	TodayVisitors     int64        `json:"today_visitors"`
	ThisWeekVisitors  int64        `json:"this_week_visitors"`
	ThisMonthVisitors int64        `json:"this_month_visitors"`
	TopPages          []PageStats  `json:"top_pages"`
	RecentVisitors    []Visitor    `json:"recent_visitors"`
	ActiveUsersList   []ActiveUser `json:"active_users_list"`
}
