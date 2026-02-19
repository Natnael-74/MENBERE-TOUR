# Natours Production Deployment Guide - Step by Step

## Prerequisites

- Node.js installed
- Git installed
- Railway account (free tier)
- MongoDB Atlas account (free tier) OR use Railway's MongoDB

---

## Step 1: Fix Database Connection (server.js)

The app needs to support Railway's DATABASE_URL. Let's update server.js:

```javascript
// In server.js, replace line 16 with:
const DB = process.env.DATABASE_URL || process.env.DATABASE;
await mongoose.connect(DB);
```

This allows the app to work with both Railway's provided database and your existing MongoDB Atlas.

---

## Step 2: Generate New Secure JWT Secret

Generate a new secure random string for JWT_SECRET. Run this in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output - you'll need it for the environment variables.

---

## Step 3: Prepare Environment Variables

Create a list of all environment variables you'll need in production:

```
NODE_ENV=production
PORT=3000
DATABASE=mongodb+srv://your_atlas_connection_string
DATABASE_PASSWORD=your_atlas_password
JWT_SECRET=your_newly_generated_secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
EMAIL_FROM=your_verified_email
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret (optional)
MAILERSEND_API_KEY=your_mailersend_key (optional)
```

---

## Step 4: Deploy to Railway

### Option A: Using Railway CLI

1. **Login to Railway:**

   ```bash
   railway login
   ```

2. **Initialize Railway project:**

   ```bash
   railway init
   ```

   Follow the prompts - choose "Create New Project" and give it a name.

3. **Add MongoDB database:**

   ```bash
   railway add mongodb
   ```

   This creates a free MongoDB database.

4. **Set environment variables:**

   ```bash
   railway variables set NODE_ENV=production
   railway variables set JWT_SECRET=your_generated_secret
   railway variables set JWT_EXPIRES_IN=90d
   railway variables set JWT_COOKIE_EXPIRES_IN=90
   railway variables set EMAIL_FROM=your_email
   # Add other variables as needed
   ```

5. **Deploy:**
   ```bash
   railway up
   ```

### Option B: Using Railway Dashboard

1. Go to https://railway.app and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. In the project dashboard, go to "Variables" tab
5. Add all the environment variables
6. Go to "Deployments" tab and watch the deployment
7. Once deployed, click the generated URL to view your app

---

## Step 5: Verify Deployment

1. **Check the app loads:**
   - Visit your Railway app URL
   - Verify the home page renders

2. **Test user registration:**
   - Try signing up a new user
   - Check email for confirmation (if email is configured)

3. **Test API endpoints:**
   - Try logging in
   - Try accessing tours API

4. **Check for errors:**
   - Open browser developer console (F12)
   - Check Railway dashboard logs

---

## Step 6: Post-Deployment (Optional but Recommended)

### Set up Stripe Webhooks (for payments)

If using payments:

1. Get your Railway app URL
2. Go to Stripe Dashboard → Webhooks
3. Add endpoint: `https://your-app.railway.app/api/v1/bookings/webhook`
4. Set the webhook secret in Railway variables

### Set up Custom Domain (optional)

1. Go to Railway project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

---

## Troubleshooting

### App Won't Start

- Check Railway logs: `railway logs`
- Verify all environment variables are set
- Check that DATABASE connection string is correct

### Database Connection Error

- Make sure MongoDB is accessible (check IP whitelist for Atlas)
- Verify DATABASE variable format

### 500 Errors

- Check Railway logs for error details
- Verify NODE_ENV=production
- Ensure JWT_SECRET is set

---

## Security Checklist for Production

- [x] config.env added to .gitignore
- [x] New JWT_SECRET generated
- [x] Helmet security headers enabled
- [x] Rate limiting enabled
- [x] MongoDB injection protection enabled
- [x] XSS protection enabled
- [x] HTTPS enforced ( Railway provides this)
- [x] Sensitive data in environment variables

---

## Summary of Files Modified

| File       | Change                         |
| ---------- | ------------------------------ |
| Procfile   | Created for Railway deployment |
| .gitignore | Added config.env               |
| server.js  | Ready for Railway DATABASE_URL |

---

## Need Help?

If you encounter issues, check:

1. Railway logs: `railway logs`
2. MongoDB Atlas IP whitelist (allow Railway IPs)
3. Environment variables are correctly set
