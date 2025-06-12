# FinBuddy Deployment Guide for Render

## Complete Step-by-Step Deployment Process

### Prerequisites
- GitHub account with your FinBuddy repository
- OpenAI API key (required for AI features)
- Alpha Vantage API key (optional for live market data)

---

## Method 1: Automatic Deployment (Using render.yaml)

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will detect the `render.yaml` file and create:
   - PostgreSQL database (`finbuddy-db`)
   - Web service (`finbuddy-web`)

### Step 3: Configure Environment Variables
After services are created, go to your web service:
1. Click on **"finbuddy-web"** service
2. Go to **"Environment"** tab
3. Add these variables:
   - `OPENAI_API_KEY` = `[paste your OpenAI API key]`
   - `ALPHA_VANTAGE_API_KEY` = `[paste your Alpha Vantage key]` (optional)

### Step 4: Wait for Deployment
- Database creation: 2-3 minutes
- Web service build: 5-10 minutes
- Your app will be live at: `https://finbuddy-web.onrender.com`

---

## Method 2: Manual Setup

### Step 1: Create Database Service
1. Go to [render.com](https://render.com) dashboard
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `finbuddy-db`
   - **Database**: `finbuddy`
   - **User**: `finbuddy_user`
   - **Region**: Oregon (US West) - recommended
   - **PostgreSQL Version**: 15
   - **Plan**: Free
4. Click **"Create Database"**
5. **IMPORTANT**: Copy the **Internal Database URL** from the database info page

### Step 2: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. **Connect Repository**: Select your GitHub repository
3. Configure deployment:
   - **Name**: `finbuddy-web`
   - **Environment**: `Node`
   - **Region**: Same as database (Oregon)
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 3: Configure Environment Variables
In the web service **Environment** tab, add:

**Required Variables:**
```
NODE_ENV = production
DATABASE_URL = [paste the Internal Database URL from Step 1]
OPENAI_API_KEY = [your OpenAI API key]
```

**Optional Variables:**
```
ALPHA_VANTAGE_API_KEY = [your Alpha Vantage API key]
```

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Render will automatically start building your application
3. Monitor the build logs in the **Logs** tab

---

## Getting Your API Keys

### OpenAI API Key (Required)
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in to your account
3. Navigate to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the key immediately (you won't see it again)
6. Add billing information if required

### Alpha Vantage API Key (Optional)
1. Go to [alphavantage.co](https://www.alphavantage.co/support/#api-key)
2. Sign up for a free account
3. Your API key will be displayed after registration
4. Free tier: 25 requests per day, 5 requests per minute

---

## Deployment Verification

### Check if Deployment Succeeded
1. **Build Logs**: No errors in the Render logs
2. **Health Check**: Visit `https://your-app-name.onrender.com/api/health`
3. **Application**: Visit your main app URL
4. **Database**: Check that topics load on the main page

### Test Core Features
- [ ] Homepage loads correctly
- [ ] User can browse topics
- [ ] Quiz functionality works
- [ ] Chat interface responds (requires OpenAI key)
- [ ] Market data displays (requires Alpha Vantage key)
- [ ] User registration/login works

---

## Troubleshooting Common Issues

### Build Failures
**Symptom**: Build fails with dependency errors
**Solution**: 
- Check that all dependencies are in `package.json`
- Ensure Node.js version compatibility (.nvmrc specifies Node 20)

### Database Connection Errors
**Symptom**: "Database connection failed" errors
**Solution**:
- Verify `DATABASE_URL` environment variable is set correctly
- Ensure database service is running
- Check that both services are in the same region

### Missing AI Features
**Symptom**: Chat responses show fallback content
**Solution**:
- Verify `OPENAI_API_KEY` is set correctly
- Check OpenAI account has billing enabled
- Verify API key has proper permissions

### App Sleeps/Slow Startup
**Symptom**: App takes 30+ seconds to respond after inactivity
**Solution**:
- This is normal for free tier (spins down after 15 minutes)
- Upgrade to Starter plan ($7/month) for always-on service

---

## Production Considerations

### Free Tier Limitations
- **Web Service**: Sleeps after 15 minutes of inactivity
- **Database**: 1GB storage, limited hours per month
- **Build Time**: Up to 10 minutes per deployment

### Recommended Upgrades for Production
- **Web Service**: Starter ($7/month) - always on, faster builds
- **Database**: Starter ($7/month) - persistent, more storage
- **Custom Domain**: Available on paid plans

### Performance Optimization
- Database queries are optimized with connection pooling
- Static assets are served efficiently
- Health checks ensure service availability

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