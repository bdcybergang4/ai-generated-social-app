# Quick Start Guide - Secure MERN Social Media App

## 🚀 5-Minute Setup

### Step 1: Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file
echo 'MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/socialmedia
PORT=5000
ACCESS_TOKEN_SECRET=your_secret_key_12345
REFRESH_TOKEN_SECRET=your_refresh_secret_key_67890
NODE_ENV=development
FRONTEND_URL=http://localhost:3000' > .env

# 4. Start backend server (keep this running)
npm run dev
```

**Expected output:**
```
Server running on port 5000
MongoDB connected
```

### Step 2: Frontend Setup (New Terminal)

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. .env.local is already created with correct URL

# 4. Start frontend server
npm start
```

The app will automatically open at `http://localhost:3000`

## 📝 First Time Usage

1. **Sign Up**
   - Click "Sign Up" button
   - Enter email, username, password
   - Password must have: uppercase + lowercase + number (e.g., `Password123`)

2. **Create a Post**
   - After login, you'll see the Feed page
   - Write something in "What's on your mind?" box
   - Click "Post" button
   - Post appears at top of feed

3. **Edit Your Profile**
   - Click "Settings" in navigation
   - Update name, bio, location, profile picture URL
   - Click "Update Profile"

4. **View Other Profiles**
   - Click any username in the feed
   - See their profile and posts

5. **Interact with Posts**
   - Click heart ❤️ to like posts
   - Click "Delete" to remove your own posts

## 🔧 Important Configuration

### MongoDB Setup
1. Create account at mongodb.com/atlas
2. Create a free cluster
3. Get connection string: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/socialmedia`
4. Add to `.env` as `MONGODB_URI`

### JWT Secrets
Generate random strings and add to `.env`:
```
ACCESS_TOKEN_SECRET=random_string_min_32_chars_here
REFRESH_TOKEN_SECRET=another_random_string_min_32_chars_here
```

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Check MongoDB URI in .env
- Ensure IP whitelist includes your machine (0.0.0.0/0 for local testing)
- Verify username and password are URL-encoded if containing special chars

### "CORS error in browser console"
- Ensure `FRONTEND_URL` in backend .env matches your frontend URL
- Restart backend server after changing .env

### "Access Token Invalid"
- Clear browser localStorage: F12 → Application → Local Storage → Clear All
- Sign in again

### "Port 5000/3000 already in use"
- Change PORT in backend .env
- Update REACT_APP_API_URL in frontend .env.local

## 📚 API Testing with cURL

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"Password123"}'

# Signin
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123"}'

# Create Post (replace TOKEN with actual accessToken from signin response)
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"content":"Hello World!"}'

# Get Feed
curl http://localhost:5000/api/posts/feed \
  -H "Authorization: Bearer TOKEN"
```

## 📦 Project Structure Overview

```
backend/
├── server.js              ← Start here (Express app)
├── models/User.js         ← User schema
├── models/Post.js         ← Post schema
├── controllers/           ← Business logic
├── routes/                ← API endpoints
├── middleware/            ← Auth, validation, rate limiting
└── .env                   ← Configuration

frontend/
├── src/App.js             ← Main component
├── src/index.js           ← React entry
├── src/pages/             ← Page components
├── src/components/        ← Reusable components
├── src/utils/             ← Helper functions
└── .env.local             ← Frontend config
```

## 🔐 Security Features Implemented

✅ Password hashing with bcrypt
✅ JWT authentication (access + refresh tokens)
✅ HttpOnly secure cookies
✅ Input validation and sanitization
✅ Rate limiting on auth endpoints
✅ CORS restriction
✅ XSS protection
✅ Authorization checks on sensitive operations

## 📖 Next Steps

- Read `IMPLEMENTATION.md` for full feature documentation
- Check `README.md` for original requirements
- Explore API endpoints in `backend/routes/`
- Customize UI in `frontend/src/components/`

Enjoy! 🎉
