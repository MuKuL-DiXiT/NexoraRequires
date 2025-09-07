# Production Deployment Guide

## Environment Setup

### Server (.env)
```bash
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Server Configuration  
PORT=3001
NODE_ENV=production

# JWT Secrets (Generate strong random strings)
JWT_SECRET=your-strong-secret-key-here
JWT_REFRESH_SECRET=your-strong-refresh-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret  
GOOGLE_CALLBACK_URL=https://your-api-domain.com/login/google/callback

# Client URL
CLIENT_URL=https://your-frontend-domain.com

# Cloudinary
CLOUDINARY_NAME=your-cloudinary-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_CLIENT_URL=https://your-frontend-domain.com
```

## Security Checklist

1. **Update JWT Secrets**: Generate strong, random secrets for production
2. **Database Security**: Use strong database passwords and whitelist IPs
3. **HTTPS**: Ensure both frontend and backend use HTTPS in production
4. **CORS**: Update CORS origins to match your production domains
5. **Environment Variables**: Never commit .env files to version control

## Deployment Steps

### Backend (Server)
1. Set environment variables on your hosting platform
2. Install dependencies: `npm install`
3. Start production server: `npm start`

### Frontend  
1. Set environment variables on your hosting platform
2. Build the application: `npm run build`
3. Start production server: `npm start`

## Recommended Hosting Platforms

### Backend
- **Railway**: Easy deployment with environment variable management
- **Heroku**: Classic platform with good documentation
- **DigitalOcean App Platform**: Affordable and reliable
- **AWS Elastic Beanstalk**: Scalable enterprise solution

### Frontend
- **Vercel**: Optimal for Next.js applications (recommended)
- **Netlify**: Great for static sites with server functions
- **Railway**: Full-stack deployment platform

## Production URLs Structure

Replace localhost URLs with your production domains:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-api.railway.app`

## Security Improvements for Production

1. **Rate Limiting**: Add express-rate-limit middleware
2. **Helmet**: Add helmet.js for security headers
3. **Input Validation**: Enhance input validation and sanitization
4. **Logging**: Implement proper logging with winston or similar
5. **Monitoring**: Set up error tracking with Sentry or similar
