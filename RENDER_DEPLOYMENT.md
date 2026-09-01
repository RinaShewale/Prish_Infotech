# Render Deployment Guide

## Setup Instructions

### 1. Frontend Build
The Frontend needs to be built BEFORE the Backend starts. On Render dashboard, set:

**Build Command:**
```bash
cd Frontend && npm install && npm run build && cd ../Backend && npm install
```

**Start Command:**
```bash
node server.js
```

### 2. Environment Variables
Make sure these are set in Render dashboard:
- `MONGODB_URI` - Your MongoDB connection string
- `SESSION_SECRET` - A random secret key
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary credentials
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `RAZORPAY_KEY_ID` - Your Razorpay credentials
- `RAZORPAY_KEY_SECRET`
- `GOOGLE_CLIENT_ID` - Google OAuth credentials
- `GOOGLE_CLIENT_SECRET`

### 3. Important Notes
- The Backend will serve the Frontend's dist folder at `/`
- All API routes work at `/api/*`
- If dist folder is missing, Backend runs in API-only mode
- The dist folder is built from the Frontend directory during the build process

### 4. Troubleshooting
If you see "Not Found" error:
1. Check that the build command includes Frontend build
2. Verify the Frontend build succeeded in the logs
3. Check that index.html exists in Frontend/dist folder

## Deployment Process
1. Push changes to GitHub (main branch)
2. Render will automatically trigger a new build
3. First, it builds the Frontend (create dist folder)
4. Then, it builds and runs the Backend
5. Backend serves both API and static Frontend files
