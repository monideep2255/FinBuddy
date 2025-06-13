# Simple Render Deployment Steps

## Step-by-Step Process (5 minutes)

### 1. Create Database First
1. Go to [render.com](https://render.com) and sign up
2. Click **"New +"** → **"PostgreSQL"**
3. Settings:
   - Name: `finbuddy-db`
   - Plan: Free
   - Region: Oregon (US West)
4. Click **"Create Database"**
5. Copy the **Internal Database URL** (starts with `postgresql://`)

### 2. Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Settings:
   - Name: `finbuddy`
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: Free

### 3. Add Environment Variables
In your web service, go to Environment tab and add:

**Required:**
```
NODE_ENV = production
DATABASE_URL = [paste the database URL from step 1]
OPENAI_API_KEY = [your OpenAI API key]
```

**Optional:**
```
ALPHA_VANTAGE_API_KEY = [your Alpha Vantage API key]
```

### 4. Deploy
Click "Create Web Service" - it will build automatically (5-10 minutes)

### 5. Verify
Visit your app URL and check:
- Homepage loads
- Topics display
- Health check: `your-app-url.onrender.com/api/health`

## Getting API Keys

**OpenAI (Required):**
- Go to platform.openai.com
- Create account → API Keys → Create new key
- Copy immediately (won't show again)

**Alpha Vantage (Optional):**
- Go to alphavantage.co/support/#api-key
- Free signup gives immediate API key

Your app will be live at: `https://your-app-name.onrender.com`