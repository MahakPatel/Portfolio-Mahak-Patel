# 📧 Email Notification Setup for Contact Form

Your portfolio already has email notifications **fully implemented**! When someone sends a message through your contact form, you'll automatically receive an email with all the details.

## ✅ What's Already Done

The email notification system is **completely ready** and includes:
- ✅ Beautiful HTML email template
- ✅ Sender's name, email, subject, and message
- ✅ Reply-To header (you can reply directly to the sender)
- ✅ Error handling and logging
- ✅ Saves to database even if email fails

## 🚀 Quick Setup (5 minutes)

### Step 1: Create `.env` File

Create a file called `.env` in the root directory of your project:

```bash
# Navigate to your project root
cd /Users/mahakpatel/Portfolio

# Create .env file
touch .env
```

### Step 2: Add Email Configuration

Open the `.env` file and add these lines:

```bash
# GitHub Token (optional)
GITHUB_TOKEN=

# JWT Secret
JWT_SECRET=your-secret-key-change-this

# ============================================
# EMAIL CONFIGURATION
# ============================================

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password_here
FROM_EMAIL=your_email@gmail.com
TO_EMAIL=mahakpatel0208@gmail.com
```

### Step 3: Get Gmail App Password

1. **Go to your Google Account**: https://myaccount.google.com/
2. **Enable 2-Factor Authentication**:
   - Click "Security" in the left sidebar
   - Find "2-Step Verification" and turn it on
3. **Create App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Portfolio Website"
   - Click "Generate"
   - Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)
4. **Use this password as `SMTP_PASSWORD`** in your `.env` file

### Step 4: Restart Docker Containers

```bash
# Stop current containers
docker-compose down

# Start with new environment variables
docker-compose up -d
```

## 📧 What You'll Receive

When someone submits the contact form, you'll get an email like this:

```
Subject: New Contact Message: [Their Subject]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
New Contact Message from Portfolio Website
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contact Details
━━━━━━━━━━━━━
Name: John Doe
Email: john@example.com
Subject: Interested in collaboration

Message
━━━━━━━
Hello! I'm interested in working with you...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This message was sent from your portfolio website.
Reply directly to respond to John Doe.
```

## 🔧 Alternative Email Providers

### Outlook/Hotmail
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USERNAME=your_email@outlook.com
SMTP_PASSWORD=your_password
```

### Yahoo
```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USERNAME=your_email@yahoo.com
SMTP_PASSWORD=your_app_password
```

### SendGrid (Professional option)
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your_sendgrid_api_key
FROM_EMAIL=verified_sender@yourdomain.com
```

### Mailgun (Professional option)
```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USERNAME=postmaster@yourdomain.com
SMTP_PASSWORD=your_mailgun_password
```

## ✅ Testing

1. Fill out your contact form on: http://localhost:3000/contact
2. Submit the message
3. Check your email inbox (may take a few seconds)
4. Check spam folder if you don't see it

## 🐛 Troubleshooting

### No emails received?
- ✅ Check spam/junk folder
- ✅ Verify all environment variables are set correctly
- ✅ Make sure you used the App Password, not your regular Gmail password
- ✅ Check backend logs: `docker-compose logs backend`

### "Authentication failed" error?
- ✅ Enable 2-Factor Authentication on Gmail
- ✅ Generate a new App Password
- ✅ Copy it exactly (no spaces)

### Still not working?
Check backend logs for detailed error messages:
```bash
docker-compose logs backend --tail=50
```

## 🎉 That's It!

Once configured, you'll automatically receive emails whenever someone contacts you through your portfolio website!

**Note**: The contact form will still work even without email configuration - messages will be saved to the database and visible in your admin panel.

