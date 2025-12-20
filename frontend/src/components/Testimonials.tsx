import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../services/api';
import { Testimonial } from '../types';

const Testimonials: React.FC = () => {
  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ['testimonials'],
    queryFn: publicApi.getTestimonials,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div style={{ padding: '80px 0', background: 'rgba(255, 255, 255, 0.02)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      whileHover={{ 
        rotateY: 3,
        boxShadow: '0 15px 30px rgba(16, 185, 129, 0.3)',
        background: 'rgba(16, 185, 129, 0.05)',
        borderColor: 'rgba(16, 185, 129, 0.3)',
        transition: { duration: 0.3, ease: "easeOut" }
      }}
        style={{ textAlign: 'center', marginBottom: '48px', cursor: 'pointer', borderRadius: '16px', padding: '24px' }}
      >
        <h2 className="gradient-text" style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '24px' }}>
          Client Testimonials
        </h2>
        <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
          What clients say about working with me
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '32px',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 16px'
        }}
      >
        {testimonials.map((testimonial) => {
          const imageSource = testimonial.company_logo_url || testimonial.avatar_url || '';
          const isCompanyLogo = Boolean(testimonial.company_logo_url);
          const rating = testimonial.rating && testimonial.rating > 0 ? testimonial.rating : 5;

          return (
          <motion.div
            key={testimonial.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Quote Icon */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              opacity: 0.1,
              fontSize: '48px',
              color: '#3b82f6'
            }}>
              <Quote style={{ width: '48px', height: '48px' }} />
            </div>

            {/* Rating Stars */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
              {[...Array(rating)].map((_, i) => (
                <Star
                  key={i}
                  style={{ 
                    width: '20px', 
                    height: '20px', 
                    color: '#fbbf24',
                    fill: '#fbbf24'
                  }}
                />
              ))}
            </div>

            {/* Testimonial Content */}
            <p style={{
              fontSize: '1rem',
              lineHeight: '1.6',
              color: '#e5e7eb',
              marginBottom: '24px',
              fontStyle: 'italic'
            }}>
              "{testimonial.content}"
            </p>

            {/* Client Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {imageSource && (
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: isCompanyLogo ? '12px' : '50%',
                  overflow: 'hidden',
                  border: '3px solid rgba(59, 130, 246, 0.3)',
                  background: isCompanyLogo ? 'white' : 'transparent',
                  padding: isCompanyLogo ? '8px' : '0'
                }}>
                  <img
                    src={imageSource}
                    alt={isCompanyLogo ? `${testimonial.company} logo` : testimonial.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              )}
              <div>
                <h4 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '4px'
                }}>
                  {testimonial.name}
                </h4>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#94a3b8',
                  marginBottom: '2px'
                }}>
                  {testimonial.role}
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#3b82f6',
                  fontWeight: '500'
                }}>
                  {testimonial.company}
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
              borderRadius: '0 0 16px 16px'
            }} />
          </motion.div>
        );})}
      </motion.div>
    </div>
  );
};

export default Testimonials;
