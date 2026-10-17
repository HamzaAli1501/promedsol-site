# 🚀 Flask Backend Deployment Guide for Repository Owner

## Current Situation
- ✅ Live frontend: **promedsol.com.pk**
- ✅ Flask backend: Works locally at `localhost:5000`
- ❌ Portal button points to localhost (not accessible to visitors)

## Your Task: Deploy Backend to Render.com (Free)

### Step 1: Sign Up & Connect Repository
1. Go to **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up with your **GitHub account** (HamzaAli1501)
4. Authorize Render to access your repositories

### Step 2: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect repository: **HamzaAli1501/promedsol-site**
3. Give Render permission to access this repository

### Step 3: Configure Service Settings

**Use these EXACT settings:**

| Setting | Value |
|---------|-------|
| **Name** | `promed-portal` (or any name you prefer) |
| **Region** | Choose closest to Pakistan (e.g., Singapore) |
| **Branch** | `master` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn app:app` |
| **Instance Type** | **Free** |

### Step 4: Add Environment Variables (Optional but Recommended)
Click **"Advanced"** → **"Add Environment Variable"**

```
PYTHON_VERSION = 3.11.0
```

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment to complete
3. You'll get a URL like: `https://promed-portal.onrender.com`

### Step 6: Update Frontend (Critical!)
Once you have the Render URL, update **one file**:

**File:** `portal/login.html`

**Find line ~95:**
```html
<form id="loginForm" method="POST" action="https://YOUR-RENDER-APP-NAME.onrender.com/login">
```

**Replace with your actual Render URL:**
```html
<form id="loginForm" method="POST" action="https://promed-portal.onrender.com/login">
```

### Step 7: Test
1. Visit **promedsol.com.pk**
2. Click **"Access Portal →"**
3. Login with:
   - Username: `ProMed-Solution`
   - Password: `123456789`
4. Should work! 🎉

---

## Important Notes

### Database
- The SQLite database (`database.db`) will be created automatically on first run
- ⚠️ **Render Free tier databases are ephemeral** (data resets on sleep/redeploy)
- For production, consider upgrading to persistent storage or PostgreSQL

### Free Tier Limitations
- App sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- 750 hours/month free (enough for one service 24/7)

### Security Recommendations (Future)
- Change `app.secret_key` in `backend/app.py` to a secure random string
- Use environment variables for credentials instead of hardcoded values
- Consider adding HTTPS redirect (Render provides SSL automatically)

---

## Troubleshooting

**If deployment fails:**
1. Check Render logs (click on your service → "Logs" tab)
2. Ensure `backend/requirements.txt` exists
3. Ensure `backend/app.py` exists
4. Check that Root Directory is set to `backend`

**If login doesn't work after deployment:**
1. Verify the form action URL matches your Render URL exactly
2. Check browser console for CORS errors
3. Visit your Render URL directly (e.g., `https://promed-portal.onrender.com/login`) to verify it's running

---

## Files Already Configured ✅

All necessary files are ready in this repository:
- ✅ `backend/app.py` - Flask application (reads PORT from environment)
- ✅ `backend/requirements.txt` - Dependencies including gunicorn
- ✅ `backend/templates/` - Login, dashboard, admin templates
- ✅ `render.yaml` - Optional Blueprint (can be ignored if using manual setup above)

---

## Questions?
Contact: Ali (collaborator who prepared this deployment)
