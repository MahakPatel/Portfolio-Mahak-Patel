import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Star, GitFork, Eye, Calendar, Code, TrendingUp } from 'lucide-react';

interface GitHubStats {
  username: string;
  totalStars: number;
  totalForks: number;
  totalRepos: number;
  totalCommits: number;
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  streakEndDate: string;
  longestStreakPeriod: string;
  languages: { [key: string]: number };
  recentRepos: Array<{
    name: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
    url: string;
    updated_at: string;
  }>;
}

const GitHubStats: React.FC = () => {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // For now, we'll use mock data since we need your actual GitHub username
    // Replace 'mahakpatel' with your actual GitHub username
    const mockStats: GitHubStats = {
      username: 'MahakPatel',
      totalStars: 6,
      totalForks: 3,
      totalRepos: 10,
      totalCommits: 89,
      totalContributions: 3323,
      currentStreak: 0,
      longestStreak: 104,
      streakEndDate: 'Oct 4',
      longestStreakPeriod: 'Jun 19, 2024 - Sep 30, 2024',
      languages: {
        'Go': 30,
        'Python': 25,
        'C++': 20,
        'CSS': 15,
        'Dart': 10
      },
      recentRepos: [
        {
          name: 'LeetCode',
          description: 'My LeetCode problem solutions and practice',
          stars: 1,
          forks: 0,
          language: 'C++',
          url: 'https://github.com/MahakPatel/LeetCode',
          updated_at: '2024-01-15T10:30:00Z'
        },
        {
          name: 'GeeksForGeeks',
          description: 'GeeksForGeeks problem solutions and algorithms',
          stars: 1,
          forks: 0,
          language: 'C++',
          url: 'https://github.com/MahakPatel/GeeksForGeeks',
          updated_at: '2024-01-10T14:20:00Z'
        },
        {
          name: 'Online-Salon-Management',
          description: 'Online Salon Management System with booking functionality',
          stars: 1,
          forks: 0,
          language: 'CSS',
          url: 'https://github.com/MahakPatel/Online-Salon-Management',
          updated_at: '2024-01-08T09:15:00Z'
        },
        {
          name: 'portfolio-website',
          description: 'Dynamic portfolio website with Go backend and React frontend',
          stars: 3,
          forks: 1,
          language: 'TypeScript',
          url: 'https://github.com/Mahakpatel02/portfolio-website',
          updated_at: '2024-01-05T16:45:00Z'
        }
      ]
    };

    // Simulate API call
    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(59, 130, 246, 0.3)',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            margin: '0 auto 16px'
          }}
        />
        <p style={{ color: '#9ca3af' }}>Loading GitHub stats...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
        <Github style={{ width: '48px', height: '48px', color: '#9ca3af', margin: '0 auto 16px' }} />
        <p style={{ color: '#9ca3af' }}>Unable to load GitHub stats</p>
      </div>
    );
  }

  const topLanguages = Object.entries(stats.languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div>
      {/* GitHub Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="card"
        style={{ marginBottom: '32px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Github style={{ width: '24px', height: '24px' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '4px' }}>
              GitHub Activity
            </h3>
            <p style={{ color: '#3b82f6', fontSize: '14px' }}>@{stats.username}</p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '24px',
          marginBottom: '24px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
              <Star style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>{stats.totalStars}</span>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>Total Stars</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
              <GitFork style={{ width: '20px', height: '20px', color: '#10b981' }} />
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>{stats.totalForks}</span>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>Total Forks</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
              <Code style={{ width: '20px', height: '20px', color: '#8b5cf6' }} />
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>{stats.totalRepos}</span>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>Repositories</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
              <TrendingUp style={{ width: '20px', height: '20px', color: '#ef4444' }} />
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>{stats.totalCommits}</span>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>Total Commits</p>
          </div>
        </div>

        {/* Contribution Stats */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.05)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', marginBottom: '16px', textAlign: 'center' }}>
            Contribution Statistics
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            justifyContent: 'center'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#3b82f6', marginBottom: '4px' }}>
                {stats.totalContributions.toLocaleString()}
              </div>
              <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '4px' }}>Total Contributions</p>
              <p style={{ color: '#6b7280', fontSize: '12px' }}>Sep 10, 2020 - Present</p>
            </div>


            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>
                {stats.longestStreak}
              </div>
              <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '4px' }}>Longest Streak</p>
              <p style={{ color: '#6b7280', fontSize: '12px' }}>{stats.longestStreakPeriod}</p>
            </div>
          </div>
        </div>

        {/* Language Distribution */}
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '12px' }}>
            Top Languages
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {topLanguages.map(([language, percentage]) => (
              <div
                key={language}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  fontSize: '14px'
                }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: `hsl(${Math.random() * 360}, 70%, 50%)`
                  }}
                />
                <span style={{ color: 'white' }}>{language}</span>
                <span style={{ color: '#9ca3af' }}>{percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recent Repositories */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '24px', textAlign: 'center' }}>
          Recent Repositories
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {stats.recentRepos.map((repo, index) => (
            <motion.div
              key={repo.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card"
              style={{ cursor: 'pointer' }}
              onClick={() => window.open(repo.url, '_blank')}
              whileHover={{ 
                rotateY: 3,
                boxShadow: '0 15px 30px rgba(16, 185, 129, 0.3)',
                background: 'rgba(16, 185, 129, 0.05)',
                borderColor: 'rgba(16, 185, 129, 0.3)',
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white' }}>
                  {repo.name}
                </h4>
                <div style={{
                  padding: '4px 8px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#3b82f6',
                  fontSize: '12px',
                  borderRadius: '12px'
                }}>
                  {repo.language}
                </div>
              </div>

              <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '16px', lineHeight: '1.5' }}>
                {repo.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: '#9ca3af' }}>
                    <Star style={{ width: '16px', height: '16px' }} />
                    <span>{repo.stars}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: '#9ca3af' }}>
                    <GitFork style={{ width: '16px', height: '16px' }} />
                    <span>{repo.forks}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6b7280' }}>
                  <Calendar style={{ width: '14px', height: '14px' }} />
                  <span>{new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GitHubStats;
