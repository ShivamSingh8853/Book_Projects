# Deployment Guide

This guide covers deploying the Book Review application to production using Netlify for the frontend and Render for the backend.

## Overview

- **Frontend (React)**: Deployed on Netlify
- **Backend (Node.js/Express)**: Deployed on Render
- **Database**: PostgreSQL on Render

## Backend Deployment (Render)

### Option 1: Using Render YAML (Recommended)

1. **Push to GitHub**: Make sure your code is pushed to a GitHub repository

2. **Connect to Render**:
   - Go to [render.com](https://render.com)
   - Sign up/login with your GitHub account
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

3. **Environment Variables**: The following will be automatically configured:
   - `NODE_ENV=production`
   - `PORT=10000`
   - Database connection variables (auto-configured)
   - `JWT_SECRET` (auto-generated)

### Option 2: Manual Setup

1. **Create PostgreSQL Database**:
   - Go to Render Dashboard
   - Click "New" → "PostgreSQL"
   - Choose a name: `book-review-db`
   - Select the Free plan
   - Note down the connection details

2. **Create Web Service**:
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `book-review-api`
     - **Environment**: `Node`
     - **Build Command**: `cd server && npm install && npm run build`
     - **Start Command**: `cd server && npm start`

3. **Set Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=<your-db-host>
   DB_PORT=5432
   DB_NAME=book_review_db
   DB_USER=<your-db-user>
   DB_PASSWORD=<your-db-password>
   JWT_SECRET=<generate-a-secure-secret>
   ```

4. **Initialize Database**:
   After deployment, run the database setup:
   ```bash
   # Connect to your Render shell or run locally with production DB
   npm run setup-db
   ```

## Frontend Deployment (Netlify)

### Step 1: Prepare Environment Variables

1. **Create production environment file**:
   ```bash
   cd client
   cp .env.example .env.production
   ```

2. **Update with your backend URL**:
   ```env
   VITE_API_URL=https://your-render-app-url.onrender.com
   ```

### Step 2: Deploy to Netlify

#### Option 1: Git-based Deployment (Recommended)

1. **Connect Repository**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build Settings**:
   - **Build command**: `cd client && npm install && npm run build`
   - **Publish directory**: `client/dist`
   - **Environment variables**: Add `VITE_API_URL` with your backend URL

3. **Deploy**: Netlify will automatically build and deploy your site

#### Option 2: Manual Deployment

1. **Build locally**:
   ```bash
   cd client
   npm install
   npm run build
   ```

2. **Deploy**:
   - Drag and drop the `client/dist` folder to Netlify dashboard
   - Or use Netlify CLI:
     ```bash
     npm install -g netlify-cli
     netlify deploy --prod --dir=client/dist
     ```

### Step 3: Configure Domain and SSL

1. **Custom Domain** (Optional):
   - Go to Site settings → Domain management
   - Add your custom domain

2. **SSL**: Automatically enabled by Netlify

## Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=10000
DB_HOST=your-render-db-host
DB_PORT=5432
DB_NAME=book_review_db
DB_USER=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-super-secure-jwt-secret-key
```

### Frontend
Set in Netlify dashboard under Site settings → Environment variables:
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

## Post-Deployment Steps

1. **Test the application**:
   - Visit your Netlify URL
   - Test user registration and login
   - Create a book and add reviews
   - Test search functionality

2. **Monitor logs**:
   - Backend logs: Available in Render dashboard
   - Frontend: Check browser console for any errors

3. **Database backup**: Set up automated backups in Render

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure your backend CORS configuration includes your Netlify domain
   - Update `server/src/index.ts` if needed

2. **API Connection Issues**:
   - Verify `VITE_API_URL` is correctly set
   - Check that backend is running and accessible

3. **Database Connection**:
   - Verify all database environment variables are correct
   - Ensure database is running and accessible

4. **Build Failures**:
   - Check build logs in respective platforms
   - Ensure all dependencies are properly listed in `package.json`

### Logs and Debugging

- **Render logs**: Dashboard → Your service → Logs
- **Netlify logs**: Dashboard → Your site → Deploys → [deployment] → Deploy log
- **Browser console**: F12 → Console tab

## Performance Optimization

1. **Frontend**:
   - Static assets are cached by Netlify CDN
   - Gzip compression enabled automatically

2. **Backend**:
   - Consider upgrading to Render's paid plan for better performance
   - Implement database connection pooling (already configured)

3. **Database**:
   - Monitor query performance
   - Add indexes as needed (already included in schema)

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use a strong, unique secret in production
3. **HTTPS**: Enforced by both Netlify and Render
4. **Database**: Uses SSL connections by default on Render

## Cost Estimation

- **Netlify**: Free tier (100GB bandwidth, 300 build minutes)
- **Render**: Free tier (750 hours/month for web service + PostgreSQL)
- **Total**: $0/month for moderate usage

For production applications with higher traffic, consider upgrading to paid plans for better performance and support.
