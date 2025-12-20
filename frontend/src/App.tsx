import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion } from 'framer-motion';

// Components
import NavbarSimple from './components/NavbarSimple';
import FooterSimple from './components/FooterSimple';
import ProtectedRoute from './components/ProtectedRoute';
import AnalyticsTracker from './components/AnalyticsTracker';

// Contexts
import { AuthProvider } from './contexts/AuthContext';

// Pages
import HomeSimple from './pages/HomeSimple';
import ProjectsSimple from './pages/ProjectsSimple';
import SkillsSimple from './pages/SkillsSimple';
import ExperienceSimple from './pages/ExperienceSimple';
import EducationSimple from './pages/EducationSimple';
import PublicationsSimple from './pages/PublicationsSimple';
import ContactSimple from './pages/ContactSimple';
import Login from './pages/Login';
import Admin from './pages/Admin';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    },
  },
});

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween' as const,
  ease: 'anticipate' as const,
  duration: 0.5
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
            <NavbarSimple />
            <AnalyticsTracker>
              <motion.main
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                style={{ paddingTop: '80px' }}
              >
                <Routes>
                  <Route path="/" element={<HomeSimple />} />
                  <Route path="/projects" element={<ProjectsSimple />} />
                  <Route path="/skills" element={<SkillsSimple />} />
                  <Route path="/experience" element={<ExperienceSimple />} />
                  <Route path="/education" element={<EducationSimple />} />
                  <Route path="/publications" element={<PublicationsSimple />} />
                  <Route path="/contact" element={<ContactSimple />} />
                  <Route path="/login" element={<Login />} />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute>
                        <Admin />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </motion.main>
            </AnalyticsTracker>
            <FooterSimple />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;