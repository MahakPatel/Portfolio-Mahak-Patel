# Email Configuration Setup

To enable email notifications for contact messages, you need to configure the following environment variables:

## Required Environment Variables

Create a `.env` file in the backend directory with the following variables:

```bash
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password_here
FROM_EMAIL=your_email@gmail.com
TO_EMAIL=mahakpatel0208@gmail.com
```

## Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password as `SMTP_PASSWORD`

## Other Email Providers

### Outlook/Hotmail
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

### Yahoo
```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

### Custom SMTP Server
```bash
SMTP_HOST=your_smtp_server.com
SMTP_PORT=587
```

## How It Works

1. When someone submits the contact form, the message is saved to the database
2. An email notification is sent to `TO_EMAIL` (mahakpatel0208@gmail.com)
3. The email includes:
   - Sender's name and email
   - Subject and message content
   - Reply-To header set to sender's email (so you can reply directly)

## Testing

To test the email functionality:

1. Set up the environment variables
2. Start the backend server
3. Submit a contact form from the frontend
4. Check your email inbox

## Troubleshooting

- **Authentication failed**: Check your SMTP credentials and app password
- **Connection timeout**: Verify SMTP_HOST and SMTP_PORT
- **No emails received**: Check spam folder and email service logs
