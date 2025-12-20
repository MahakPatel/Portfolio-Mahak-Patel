import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';

const NavbarSimple: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Skills', path: '/skills' },
    { name: 'Experience', path: '/experience' },
    { name: 'Education', path: '/education' },
    { name: 'Publications', path: '/publications' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`navbar ${scrolled ? 'glass' : ''}`}
    >
      <div className="navbar-content">
        {/* Logo */}
          <Link to="/" className="logo">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="logo-icon"
            >
              <motion.div
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #10b981)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)',
                    transform: 'translateX(-100%)'
                  }}
                  animate={{
                    transform: ['translateX(-100%)', 'translateX(100%)']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                />
                MP
              </motion.div>
            </motion.div>
            <span className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Mahak Patel</span>
          </Link>

        {/* Desktop Navigation */}
        <div className="nav-links" style={{ display: 'flex', gap: '32px', listStyle: 'none' }}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              style={{
                color: location.pathname === item.path ? '#3b82f6' : '#94a3b8',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.3s ease'
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Social Links */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <a
            href="https://github.com/mahakpatel"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#94a3b8', transition: 'color 0.3s ease' }}
          >
            <Github style={{ width: '20px', height: '20px' }} />
          </a>
          <a
            href="https://www.linkedin.com/in/mahakpatel/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#94a3b8', transition: 'color 0.3s ease' }}
          >
            <Linkedin style={{ width: '20px', height: '20px' }} />
          </a>
          <a
            href="mailto:contact@example.com"
            style={{ color: '#94a3b8', transition: 'color 0.3s ease' }}
          >
            <Mail style={{ width: '20px', height: '20px' }} />
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer'
          }}
        >
          {isOpen ? <X style={{ width: '24px', height: '24px' }} /> : <Menu style={{ width: '24px', height: '24px' }} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                style={{
                  color: location.pathname === item.path ? '#3b82f6' : '#94a3b8',
                  textDecoration: 'none',
                  fontWeight: '500',
                  padding: '8px 0'
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default NavbarSimple;
