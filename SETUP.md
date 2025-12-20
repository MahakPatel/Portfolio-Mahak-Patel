# Portfolio Website Setup Guide

This guide will help you set up and deploy your dynamic portfolio website.

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Git
- A GitHub account (for GitHub integration)

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd Portfolio

# Make deployment script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

### 2. Configure Environment

1. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration:
```env
GITHUB_TOKEN=your_github_personal_access_token
JWT_SECRET=your_jwt_secret_key
```

### 3. Access Your Portfolio

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Admin Dashboard**: http://localhost:3000/admin

## 🔧 Manual Setup (Development)

### Backend Setup

```bash
cd backend

# Install dependencies
go mod download

# Set environment variables
export DATABASE_URL="postgres://portfolio_user:portfolio_password@localhost:5432/portfolio?sslmode=disable"
export GITHUB_TOKEN="your_github_token"
export JWT_SECRET="your_jwt_secret"

# Run the server
go run main.go
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set environment variables
export REACT_APP_API_URL="http://localhost:8080/api/v1"

# Start development server
npm start
```

### Database Setup

```bash
# Start PostgreSQL
docker run -d \
  --name portfolio-postgres \
  -e POSTGRES_DB=portfolio \
  -e POSTGRES_USER=portfolio_user \
  -e POSTGRES_PASSWORD=portfolio_password \
  -p 5432:5432 \
  postgres:15-alpine
```

## 📝 Initial Configuration

### 1. Create Your Portfolio Profile

Use the admin dashboard at `/admin` to:
- Update your personal information
- Add your skills
- Add work experience
- Add education
- Add publications
- Sync GitHub projects

### 2. GitHub Integration

1. Create a GitHub Personal Access Token:
   - Go to GitHub Settings > Developer settings > Personal access tokens
   - Generate a new token with `repo` scope
   - Add the token to your `.env` file

2. Sync your GitHub projects:
   - Go to Admin Dashboard > Projects
   - Enter your GitHub username
   - Click "Sync Projects"

### 3. Customize Your Portfolio

- Update the `portfolio` table with your information
- Add your skills with categories and proficiency levels
- Add your work experience and education
- Upload project images and descriptions

## 🎨 Customization

### Styling

The frontend uses Tailwind CSS with custom components. Key files:
- `frontend/src/index.css` - Global styles and custom components
- `frontend/tailwind.config.js` - Tailwind configuration
- `frontend/src/components/` - Reusable components

### Colors and Themes

The portfolio uses a futuristic color scheme:
- Primary: Blue gradient (`primary-500` to `primary-600`)
- Secondary: Purple gradient (`secondary-500` to `secondary-600`)
- Accent: Green gradient (`accent-500` to `accent-600`)

### Adding New Pages

1. Create a new component in `frontend/src/pages/`
2. Add the route in `frontend/src/App.tsx`
3. Add navigation link in `frontend/src/components/Navbar.tsx`

## 🚀 Deployment

### Production Deployment

1. **Prepare for Production**:
   ```bash
   # Build frontend for production
   cd frontend
   npm run build
   ```

2. **Deploy with Docker**:
   ```bash
   # Update docker-compose.yml for production
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Environment Variables**:
   - Set production database URL
   - Configure GitHub token
   - Set secure JWT secret
   - Configure CORS origins

### Cloud Deployment Options

- **Heroku**: Use Heroku Postgres and deploy both services
- **DigitalOcean**: Use App Platform with managed database
- **AWS**: Use ECS with RDS
- **Vercel**: Deploy frontend, use external database

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use a strong, random secret
3. **CORS**: Configure allowed origins for production
4. **Database**: Use strong passwords and SSL connections
5. **GitHub Token**: Use minimal required scopes

## 📊 Monitoring and Maintenance

### Health Checks

- Backend health: `GET /health`
- Database connectivity: Check logs
- GitHub API: Monitor rate limits

### Regular Tasks

1. **Update Dependencies**: Regularly update Go and Node.js dependencies
2. **Backup Database**: Set up regular database backups
3. **Monitor Performance**: Check response times and error rates
4. **Update Content**: Keep portfolio information current

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**:
   - Check if PostgreSQL is running
   - Verify connection string
   - Check firewall settings

2. **GitHub API Rate Limits**:
   - Check GitHub token validity
   - Monitor API usage
   - Implement caching

3. **Frontend Build Errors**:
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify environment variables

### Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

## 📚 API Documentation

### Public Endpoints

- `GET /api/v1/portfolio` - Get portfolio information
- `GET /api/v1/projects` - Get all projects
- `GET /api/v1/skills` - Get all skills
- `GET /api/v1/experience` - Get work experience
- `GET /api/v1/education` - Get education
- `GET /api/v1/publications` - Get publications
- `POST /api/v1/contact` - Send contact message

### Admin Endpoints

- `GET /api/v1/admin/dashboard` - Get dashboard statistics
- `PUT /api/v1/admin/portfolio` - Update portfolio
- `POST /api/v1/admin/skills` - Create skill
- `PUT /api/v1/admin/skills/:id` - Update skill
- `DELETE /api/v1/admin/skills/:id` - Delete skill
- `POST /api/v1/admin/sync-github` - Sync GitHub projects

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review the logs
3. Create an issue on GitHub
4. Contact the maintainer

---

**Happy coding! 🚀**
