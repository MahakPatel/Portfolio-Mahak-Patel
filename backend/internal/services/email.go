package services

import (
	"fmt"
	"os"
	"strconv"

	"gopkg.in/gomail.v2"
)

type EmailService struct {
	smtpHost     string
	smtpPort     int
	smtpUsername string
	smtpPassword string
	fromEmail    string
	toEmail      string
}

func NewEmailService() *EmailService {
	port, _ := strconv.Atoi(os.Getenv("SMTP_PORT"))
	if port == 0 {
		port = 587 // Default SMTP port
	}

	return &EmailService{
		smtpHost:     os.Getenv("SMTP_HOST"),
		smtpPort:     port,
		smtpUsername: os.Getenv("SMTP_USERNAME"),
		smtpPassword: os.Getenv("SMTP_PASSWORD"),
		fromEmail:    os.Getenv("FROM_EMAIL"),
		toEmail:      os.Getenv("TO_EMAIL"),
	}
}

func (e *EmailService) SendContactNotification(name, email, subject, message string) error {
	// Create the email message
	m := gomail.NewMessage()
	m.SetHeader("From", e.fromEmail)
	m.SetHeader("To", e.toEmail)
	m.SetHeader("Subject", fmt.Sprintf("New Contact Message: %s", subject))

	// Create HTML email body
	htmlBody := fmt.Sprintf(`
		<html>
		<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
			<div style="max-width: 600px; margin: 0 auto; padding: 20px;">
				<h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
					New Contact Message from Portfolio Website
				</h2>
				
				<div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
					<h3 style="color: #1f2937; margin-top: 0;">Contact Details</h3>
					<p><strong>Name:</strong> %s</p>
					<p><strong>Email:</strong> <a href="mailto:%s">%s</a></p>
					<p><strong>Subject:</strong> %s</p>
				</div>
				
				<div style="background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
					<h3 style="color: #1f2937; margin-top: 0;">Message</h3>
					<p style="white-space: pre-wrap;">%s</p>
				</div>
				
				<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
					<p>This message was sent from your portfolio website contact form.</p>
					<p>Reply directly to this email to respond to %s.</p>
				</div>
			</div>
		</body>
		</html>
	`, name, email, email, subject, message, name)

	m.SetBody("text/html", htmlBody)

	// Set reply-to header so you can reply directly to the sender
	m.SetHeader("Reply-To", email)

	// Create the SMTP dialer
	d := gomail.NewDialer(e.smtpHost, e.smtpPort, e.smtpUsername, e.smtpPassword)

	// Send the email
	if err := d.DialAndSend(m); err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}

	return nil
}

func (e *EmailService) IsConfigured() bool {
	return e.smtpHost != "" && e.smtpUsername != "" && e.smtpPassword != "" && e.fromEmail != "" && e.toEmail != ""
}
