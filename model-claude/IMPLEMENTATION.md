# 🔒 Secure MERN Social Media Application

A fully functional secure social media application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) with comprehensive security features, authentication, and authorization.

## 📋 Features Implemented

### ✅ User Management (FR-1 to FR-5)
- **User Signup** (FR-1): Email, username, password validation with bcrypt hashing (10 salt rounds)
- **User Sign-in** (FR-2): Secure JWT authentication with access and refresh tokens
- **Edit Profile** (FR-3): Update name, bio, location, and profile picture
- **View Profiles** (FR-4): Public profile viewing for any user
- **Logout** (FR-5): Secure logout with token invalidation

### ✅ Social Features (FR-6 to FR-8)
- **Create Status Posts** (FR-6): Text-based posts with timestamps
- **View Feed** (FR-7): Paginated feed with newest posts first
- **Post Management** (FR-8): Update/delete posts with authorization checks
- **Like/Unlike Posts**: Like and unlike functionality with user tracking
- **Post Comments**: Basic comment support on posts

### ✅ Security Requirements (SR-1 to SR-12)
- **SR-1**: Passwords hashed with bcrypt (10+ salt rounds)
- **SR-2**: JWT tokens (15-min access, 7-day refresh) with HttpOnly cookies
- **SR-3**: Role-based access control for post operations
- **SR-4**: Input validation and sanitization with express-validator
- **SR-5**: Rate limiting on auth endpoints (5 attempts per 15 min)
- **SR-6**: CORS configured for frontend domain only
- **SR-8**: HttpOnly, Secure, SameSite=strict cookie flags
- **SR-9**: XSS protection via React's built-in sanitization and DOMPurify
- **SR-10**: HTTPS/TLS ready, no sensitive data logging
- **SR-12**: Audit logging for critical events

## 📁 Project Structure

```
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema with password hashing
│   │   └── Post.js          # Post schema with likes and comments
│   ├── controllers/
│   │   ├── authController.js   # Auth logic (signup, signin, refresh)
│   │   ├── userController.js   # User profile operations
│   │   └── postController.js   # Post CRUD and interactions
│   ├── routes/
│   │   ├── auth.js          # Authentication endpoints
│   │   ├── users.js         # User endpoints
│   │   └── posts.js         # Post endpoints
│   ├── middleware/
│   │   ├── auth.js          # JWT verification
│   │   ├── validation.js    # Input validation rules
│   │   ├── rateLimiter.js   # Rate limiting configuration
│   │   └── logger.js        # Audit logging
│   ├── utils/
│   │   └── tokenUtils.js    # JWT token generation
│   ├── server.js            # Express app setup
│   ├── package.json         # Backend dependencies
│   └── .env.example         # Environment variables template
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.js      # Navigation bar
│   │   │   └── ProtectedRoute.js  # Route protection wrapper
│   │   ├── pages/
│   │   │   ├── Signup.js          # Signup form
│   │   │   ├── Signin.js          # Signin form
│   │   │   ├── Feed.js            # Main feed page
│   │   │   ├── ViewProfile.js     # User profile viewing
│   │   │   └── EditProfile.js     # Profile editing
│   │   ├── utils/
│   │   │   ├── apiClient.js       # Axios instance with interceptors
│   │   │   ├── helpers.js         # Utility functions
│   │   │   └── AuthContext.js     # React context for auth state
│   │   ├── App.js           # Main app component
│   │   ├── index.js         # React entry point
│   │   └── index.css        # Global styles
│   ├── public/index.html    # HTML template
│   ├── package.json         # Frontend dependencies
│   ├── tailwind.config.js   # TailwindCSS configuration
│   └── .env.local           # Environment variables
│
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your configuration:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/socialmedia
   PORT=5000
   ACCESS_TOKEN_SECRET=your_random_secret_key_here
   REFRESH_TOKEN_SECRET=your_random_secret_key_here
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory** (in a new terminal)
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   The frontend will open at `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/me` - Get current user profile
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/search?query=...` - Search users

### Posts
- `GET /api/posts/feed` - Get feed with pagination
- `POST /api/posts` - Create new post
- `GET /api/posts/:postId` - Get single post
- `PUT /api/posts/:postId` - Update post
- `DELETE /api/posts/:postId` - Delete post
- `POST /api/posts/:postId/like` - Like a post
- `POST /api/posts/:postId/unlike` - Unlike a post
- `GET /api/posts/user/:userId` - Get user's posts

## 🔐 Security Features

### Authentication & Authorization
- ✅ JWT-based authentication with access and refresh tokens
- ✅ HttpOnly, Secure, SameSite cookies for refresh tokens
- ✅ In-memory access token storage on frontend
- ✅ Automatic token refresh on 401 responses
- ✅ Authorization checks for user-specific operations

### Input Validation & Sanitization
- ✅ Email format validation
- ✅ Username validation (alphanumeric with symbols)
- ✅ Password strength requirements (min 6 chars, uppercase, lowercase, number)
- ✅ Content length limits (max 5000 for posts, 500 for bio)
- ✅ XSS protection via React + DOMPurify
- ✅ NoSQL injection prevention with Mongoose validation

### Rate Limiting
- ✅ Login attempts: 5 per 15 minutes
- ✅ Signup attempts: 5 per hour
- ✅ General API: 100 requests per 15 minutes

### API Security
- ✅ CORS configured for frontend domain
- ✅ Helmet.js for HTTP headers security
- ✅ No sensitive data in logs
- ✅ Standardized error responses

### Data Protection
- ✅ Passwords hashed with bcrypt (10+ rounds)
- ✅ Ready for HTTPS/TLS deployment
- ✅ Secure session management

## 🧪 Testing the Application

1. **Create an account**
   - Go to `/signup` and register with email, username, and password
   - Password must contain: uppercase, lowercase, and number

2. **Sign in**
   - Navigate to `/signin` and login with your credentials

3. **Create posts**
   - On the feed page, write content and click "Post"
   - Posts appear in reverse chronological order

4. **View profiles**
   - Click on any username in the feed to view their profile
   - See all their posts on their profile page

5. **Edit your profile**
   - Go to Settings to update name, bio, location, and profile picture

6. **Interact with posts**
   - Like/unlike posts using the heart button
   - Delete your own posts using the delete button

## 📦 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
PORT=5000
ACCESS_TOKEN_SECRET=generate-a-random-secret-key
REFRESH_TOKEN_SECRET=generate-another-random-secret-key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚢 Deployment

### Backend (Node.js)
- Deploy to Heroku, Railway, or similar platform
- Set environment variables in platform settings
- Ensure MongoDB Atlas is accessible
- Update FRONTEND_URL for production

### Frontend (React)
- Build with `npm run build`
- Deploy to Vercel, Netlify, or similar
- Update `REACT_APP_API_URL` to production backend URL
- Configure environment variables before build

## 📝 Requirements Coverage

| ID | Requirement | Status | Implementation |
| :--- | :--- | :--- | :--- |
| FR-1 | User Signup | ✅ | Backend route + form validation |
| FR-2 | User Sign-in | ✅ | JWT auth with refresh tokens |
| FR-3 | Edit Profile | ✅ | Profile update endpoint |
| FR-4 | View Profiles | ✅ | Profile viewing for all users |
| FR-5 | Logout | ✅ | Token invalidation + cleanup |
| FR-6 | Create Posts | ✅ | Post creation with validation |
| FR-7 | View Feed | ✅ | Paginated feed display |
| FR-8 | Update/Delete Post | ✅ | Authorization-enforced operations |
| FR-9 | Database | ✅ | MongoDB with Mongoose |
| FR-10 | Error Handling | ✅ | Standardized error responses |
| SR-1 | Password Storage | ✅ | bcrypt 10+ rounds |
| SR-2 | JWT Security | ✅ | Access + refresh tokens |
| SR-3 | RBAC | ✅ | User-based authorization |
| SR-4 | Input Validation | ✅ | express-validator + DOMPurify |
| SR-5 | Rate Limiting | ✅ | express-rate-limit |
| SR-6 | CORS | ✅ | Frontend domain restriction |
| SR-8 | CSRF/Cookies | ✅ | HttpOnly, Secure, SameSite |
| SR-9 | XSS Prevention | ✅ | React sanitization + DOMPurify |
| SR-10 | Data Encryption | ✅ | Ready for HTTPS/TLS |
| SR-12 | Audit Logging | ✅ | Morgan + custom logger |

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License - feel free to use this project as a template.
