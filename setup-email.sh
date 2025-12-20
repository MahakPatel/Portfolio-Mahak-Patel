#!/bin/bash

# Email Configuration Setup Script for Portfolio
# This script helps you set up email notifications for contact form

echo "================================================"
echo "📧 Email Notification Setup"
echo "================================================"
echo ""

# Check if .env already exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to update it? (y/n): " update
    if [ "$update" != "y" ]; then
        echo "Setup cancelled."
        exit 0
    fi
    # Backup existing .env
    cp .env .env.backup
    echo "✅ Backed up existing .env to .env.backup"
fi

echo ""
echo "Please provide the following information:"
echo ""

# Get email configuration
read -p "📧 Your Gmail address (e.g., yourname@gmail.com): " smtp_username
read -p "📧 Recipient email (where to receive messages) [mahakpatel0208@gmail.com]: " to_email
to_email=${to_email:-mahakpatel0208@gmail.com}

echo ""
echo "================================================"
echo "🔐 Gmail App Password Setup"
echo "================================================"
echo ""
echo "To get your Gmail App Password:"
echo "1. Go to: https://myaccount.google.com/apppasswords"
echo "2. Enable 2-Factor Authentication if not enabled"
echo "3. Generate an app password for 'Mail'"
echo "4. Copy the 16-character password"
echo ""

read -sp "🔑 Gmail App Password (16 characters, will be hidden): " smtp_password
echo ""

# Generate JWT secret if not exists
jwt_secret=$(openssl rand -hex 32 2>/dev/null || echo "change-this-secret-key-$(date +%s)")

# Create .env file
cat > .env << EOF
# GitHub Token (optional - for GitHub integration)
GITHUB_TOKEN=

# JWT Secret for admin authentication
JWT_SECRET=${jwt_secret}

# ============================================
# EMAIL CONFIGURATION FOR CONTACT FORM
# ============================================

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=${smtp_username}
SMTP_PASSWORD=${smtp_password}
FROM_EMAIL=${smtp_username}
TO_EMAIL=${to_email}
EOF

echo ""
echo "================================================"
echo "✅ Email Configuration Complete!"
echo "================================================"
echo ""
echo "Configuration saved to .env file:"
echo "  • SMTP: Gmail (smtp.gmail.com:587)"
echo "  • From: ${smtp_username}"
echo "  • To: ${to_email}"
echo ""
echo "Next steps:"
echo "1. Restart Docker containers:"
echo "   docker-compose down && docker-compose up -d"
echo ""
echo "2. Test the contact form at:"
echo "   http://localhost:3000/contact"
echo ""
echo "3. Check your inbox at: ${to_email}"
echo ""
echo "📖 For more details, see EMAIL_CONFIGURATION.md"
echo ""

