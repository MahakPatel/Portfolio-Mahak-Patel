import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

const FooterSimple: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: 'https://github.com/mahakpatel', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/mahakpatel/', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:mahakpatel0208@gmail.com', label: 'Email' },
  ];

  return (
    <footer style={{
      background: 'rgba(0, 0, 0, 0.5)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      marginTop: '80px',
      padding: '48px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '32px',
          marginBottom: '32px'
        }}>
          {/* Brand */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}
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
                  fontSize: '14px',
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
              <span className="gradient-text" style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Mahak Patel</span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ color: '#9ca3af', fontSize: '0.875rem' }}
            >
              Transforming AI research into scalable software solutions that make a real impact.
            </motion.p>
          </div>

          {/* Quick Links */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ color: 'white', fontWeight: '600', marginBottom: '16px' }}
            >
              Quick Links
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {['Projects', 'Skills', 'Experience', 'Contact'].map((link) => (
                <a
                  key={link}
                  href={`/${link.toLowerCase()}`}
                  style={{
                    color: '#9ca3af',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'white'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#9ca3af'}
                >
                  {link}
                </a>
              ))}
            </motion.div>
          </div>

          {/* Social Links */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ color: 'white', fontWeight: '600', marginBottom: '16px' }}
            >
              Connect With Me
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ display: 'flex', gap: '16px' }}
            >
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none'
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  aria-label={label}
                >
                  <Icon style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '32px',
            textAlign: 'center'
          }}
        >
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            © {currentYear} Portfolio. Built with React, Go, and lots of ☕
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterSimple;
