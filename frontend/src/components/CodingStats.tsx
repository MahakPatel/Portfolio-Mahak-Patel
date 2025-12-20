import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Trophy, Target, TrendingUp, Calendar, Award } from 'lucide-react';

interface CodingStatsProps {
  leetcodeStats?: {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    acceptanceRate: number;
    ranking: number;
    contestRating: number;
    streak: number;
    maxStreak: number;
  };
  geeksforgeeksStats?: {
    totalSolved: number;
    schoolSolved: number;
    basicSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    ranking: number;
    streak: number;
    codingScore: number;
  };
}

const CodingStats: React.FC<CodingStatsProps> = ({ 
  leetcodeStats, 
  geeksforgeeksStats 
}) => {
  const [realLeetcodeStats, setRealLeetcodeStats] = useState<any>(null);
  const [isLoadingLeetcode, setIsLoadingLeetcode] = useState(true);

  // Fetch real LeetCode data
  useEffect(() => {
    const fetchLeetcodeStats = async () => {
      try {
        const response = await fetch('https://leetcode-stats-api.herokuapp.com/mahakpatel0208');
        const data = await response.json();
        setRealLeetcodeStats(data);
      } catch (error) {
        console.error('Failed to fetch LeetCode stats:', error);
      } finally {
        setIsLoadingLeetcode(false);
      }
    };

    fetchLeetcodeStats();
  }, []);

  // Mock data - replace with real API calls
  // Note: totalSolved: 89 matches your actual LeetCode profile: https://leetcode.com/u/mahakpatel0208/
  const mockLeetcodeStats = {
    totalSolved: 89,
    easySolved: 45,
    mediumSolved: 38,
    hardSolved: 6,
    acceptanceRate: 78.5,
    ranking: 125000,
    contestRating: 1450,
    streak: 7,
    maxStreak: 47
  };

  // Note: Updated to match your actual GeeksforGeeks profile: https://www.geeksforgeeks.org/user/mahakpat5zpi/
  const mockGeeksforgeeksStats = {
    totalSolved: 120,
    schoolSolved: 0,
    basicSolved: 10,
    easySolved: 37,
    mediumSolved: 66,
    hardSolved: 7,
    ranking: 1, // Institute Rank
    streak: 2,
    codingScore: 385
  };

  // Use real LeetCode data if available, otherwise fall back to mock data
  const stats = realLeetcodeStats ? {
    totalSolved: realLeetcodeStats.totalSolved || 0,
    easySolved: realLeetcodeStats.easySolved || 0,
    mediumSolved: realLeetcodeStats.mediumSolved || 0,
    hardSolved: realLeetcodeStats.hardSolved || 0,
    acceptanceRate: realLeetcodeStats.acceptanceRate || 0,
    ranking: realLeetcodeStats.ranking || 0,
    contestRating: realLeetcodeStats.contestRating || 0,
    streak: realLeetcodeStats.currentStreak || 0,
    maxStreak: realLeetcodeStats.maxStreak || 47
  } : (leetcodeStats || mockLeetcodeStats);
  
  const gfgStats = geeksforgeeksStats || mockGeeksforgeeksStats;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div style={{ padding: '32px 0' }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 16px'
        }}
      >
        {/* LeetCode Stats */}
        <motion.div
          variants={itemVariants}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer'
          }}
          whileHover={{ 
            rotateX: 3,
            boxShadow: '0 20px 40px rgba(255, 165, 0, 0.3)',
            background: 'rgba(255, 165, 0, 0.05)',
            borderColor: 'rgba(255, 165, 0, 0.3)',
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.open('https://leetcode.com/u/mahakpatel0208/', '_blank')}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #ff6b35, #f7931e)',
            borderRadius: '16px 16px 0 0'
          }} />
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <Code style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: 'white', 
                margin: 0 
              }}>
                <a 
                  href="https://leetcode.com/u/mahakpatel0208/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: 'white', 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  LeetCode
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>↗</span>
                </a>
              </h3>
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#94a3b8', 
                margin: 0 
              }}>
                Algorithm Practice
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ff6b35', marginBottom: '4px' }}>
                {isLoadingLeetcode ? '...' : stats.totalSolved}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Problems Solved</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f7931e', marginBottom: '4px' }}>
                {isLoadingLeetcode ? '...' : `${stats.acceptanceRate}%`}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Acceptance Rate</div>
            </div>
          </div>

          <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Easy</span>
              <span style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: '600' }}>
                {stats.easySolved}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Medium</span>
              <span style={{ fontSize: '0.875rem', color: '#f59e0b', fontWeight: '600' }}>
                {stats.mediumSolved}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Hard</span>
              <span style={{ fontSize: '0.875rem', color: '#ef4444', fontWeight: '600' }}>
                {stats.hardSolved}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '0.875rem' }}>
            <div style={{ color: '#94a3b8' }}>
              <Trophy style={{ width: '16px', height: '16px', display: 'inline', marginRight: '4px' }} />
              Rank: #{stats.ranking.toLocaleString()}
            </div>
            <div style={{ color: '#94a3b8' }}>
              <TrendingUp style={{ width: '16px', height: '16px', display: 'inline', marginRight: '4px' }} />
              Rating: {stats.contestRating}
            </div>
          </div>
          
          {/* Max Streak Achievement */}
          <div style={{
            background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
            borderRadius: '8px',
            padding: '12px 16px',
            marginTop: '16px',
            textAlign: 'center',
            border: '2px solid rgba(255, 107, 53, 0.3)'
          }}>
            <div style={{ 
              fontSize: '1rem', 
              fontWeight: '700', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <Calendar style={{ width: '18px', height: '18px', color: 'white' }} />
              Max Streak: {stats.maxStreak} days
              <Calendar style={{ width: '18px', height: '18px', color: 'white' }} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)', marginTop: '4px' }}>
              Impressive consistency in problem solving!
            </div>
          </div>
        </motion.div>

        {/* GeeksforGeeks Stats */}
        <motion.div
          variants={itemVariants}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer'
          }}
          whileHover={{ 
            rotateY: -3,
            boxShadow: '0 20px 40px rgba(34, 197, 94, 0.3)',
            background: 'rgba(34, 197, 94, 0.05)',
            borderColor: 'rgba(34, 197, 94, 0.3)',
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.open('https://www.geeksforgeeks.org/user/mahakpat5zpi/', '_blank')}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #0f9d58, #34a853)',
            borderRadius: '16px 16px 0 0'
          }} />
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0f9d58, #34a853)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <Award style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: 'white', 
                margin: 0 
              }}>
                <a 
                  href="https://www.geeksforgeeks.org/user/mahakpat5zpi/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: 'white', 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  GeeksforGeeks
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>↗</span>
                </a>
              </h3>
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#94a3b8', 
                margin: 0 
              }}>
                Coding Practice • #1 University Ranking
              </p>
            </div>
          </div>

          {/* Achievement Badge */}
          <div style={{
            background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            textAlign: 'center',
            border: '2px solid rgba(255, 215, 0, 0.3)'
          }}>
            <div style={{ 
              fontSize: '1.125rem', 
              fontWeight: '700', 
              color: '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <Trophy style={{ width: '20px', height: '20px', color: '#1a1a1a' }} />
              #1 University Ranking
              <Trophy style={{ width: '20px', height: '20px', color: '#1a1a1a' }} />
            </div>
            <div style={{ fontSize: '0.875rem', color: '#4a4a4a', marginTop: '4px' }}>
              California State Polytechnic University Pomona
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#0f9d58', marginBottom: '4px' }}>
                {gfgStats.totalSolved}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Problems Solved</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#34a853', marginBottom: '4px' }}>
                {gfgStats.codingScore}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Coding Score</div>
            </div>
          </div>

          <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>School</span>
              <span style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: '600' }}>
                {gfgStats.schoolSolved}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Basic</span>
              <span style={{ fontSize: '0.875rem', color: '#3b82f6', fontWeight: '600' }}>
                {gfgStats.basicSolved}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Easy</span>
              <span style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: '600' }}>
                {gfgStats.easySolved}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Medium</span>
              <span style={{ fontSize: '0.875rem', color: '#f59e0b', fontWeight: '600' }}>
                {gfgStats.mediumSolved}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '0.875rem' }}>
            <div style={{ color: '#94a3b8' }}>
              <Calendar style={{ width: '16px', height: '16px', display: 'inline', marginRight: '4px' }} />
              Streak: {gfgStats.streak} days
            </div>
            <div style={{ color: '#94a3b8' }}>
              <Trophy style={{ width: '16px', height: '16px', display: 'inline', marginRight: '4px' }} />
              Institute Rank: #{gfgStats.ranking}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CodingStats;
