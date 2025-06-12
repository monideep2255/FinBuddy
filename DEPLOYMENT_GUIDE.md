# FinBuddy Deployment Guide

## Render Deployment (Recommended)

Render is the easiest platform for deploying FinBuddy because it supports full-stack applications with PostgreSQL databases out of the box.

### Prerequisites

1. **GitHub Repository**: Push your code to GitHub
2. **API Keys**: 
   - OpenAI API key (for AI features)
   - Alpha Vantage API key (for live market data - optional)

### Step 1: Create Render Account
1. Sign up at [render.com](https://render.com)
2. Connect your GitHub account

### Step 2: Create PostgreSQL Database
1. Click "New +" → "PostgreSQL"
2. Configure:
   - **Name**: `finbuddy-db`
   - **Database**: `finbuddy`
   - **User**: `finbuddy`
   - **Region**: Choose closest to your users
   - **Plan**: Free tier is sufficient for testing
3. Click "Create Database"
4. Copy the **Internal Database URL** for later

### Step 3: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `finbuddy`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free tier is sufficient for testing

### Step 4: Set Environment Variables
In your web service settings, add these environment variables:

**Required:**
- `NODE_ENV` = `production`
- `DATABASE_URL` = [Your database internal URL from Step 2]
- `OPENAI_API_KEY` = [Your OpenAI API key]

**Optional (for live market data):**
- `ALPHA_VANTAGE_API_KEY` = [Your Alpha Vantage API key]

### Step 5: Deploy
1. Click "Deploy" - Render will automatically build and deploy your app
2. The build process takes 5-10 minutes
3. Your app will be available at `https://your-app-name.onrender.com`

### Step 6: Initialize Database
Once deployed, the application will automatically:
- Create database tables using Drizzle ORM
- Seed initial data including topics and scenarios

## Alternative: Manual Deployment Steps

If you prefer manual setup instead of using the render.yaml file:

### Database Setup
```bash
# The app will automatically run database migrations on startup
# No manual database setup required
```

### Environment Variables Checklist
- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL` (provided by Render)
- [ ] `OPENAI_API_KEY` (get from OpenAI dashboard)
- [ ] `ALPHA_VANTAGE_API_KEY` (optional, get from Alpha Vantage)

## Troubleshooting

### Build Failures
- Check that all dependencies are listed in `package.json`
- Ensure TypeScript compiles without errors
- Verify all environment variables are set

### Database Connection Issues
- Ensure `DATABASE_URL` environment variable is set correctly
- Check that the database service is running
- Verify database credentials

### Missing Features
- **No AI responses**: Check `OPENAI_API_KEY` is set
- **No market data**: Check `ALPHA_VANTAGE_API_KEY` is set
- **Login issues**: Database connection problem

### Performance Optimization
- Render free tier may sleep after 15 minutes of inactivity
- Consider upgrading to paid tier for production use
- Database connections are pooled automatically

## Cost Considerations

### Render Free Tier Limits
- **Web Service**: 750 hours/month, sleeps after 15 min inactivity
- **PostgreSQL**: 1GB storage, 97 hours/month
- **Bandwidth**: 100GB/month

### Recommended Upgrade Path
For production use, consider:
- **Web Service**: Starter plan ($7/month) for always-on service
- **PostgreSQL**: Starter plan ($7/month) for persistent database

## Security Notes

- All API keys are stored as environment variables
- Database connections use SSL by default
- Session data is stored in PostgreSQL with secure configuration
- No sensitive data is logged or exposed

## Monitoring

Render provides:
- Automatic health checks
- Application logs
- Performance metrics
- Uptime monitoring

Access these through your Render dashboard to monitor your application's performance.