# 📚 API Documentation

Complete API reference for the Secure MERN Social Media Application.

## Base URL
```
http://localhost:5000/api (development)
https://yourdomain.com/api (production)
```

## Authentication
Most endpoints require an Authorization header:
```
Authorization: Bearer <accessToken>
```

Refresh tokens are sent as HttpOnly cookies automatically.

---

## 🔐 Authentication Endpoints

### POST /auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "63abc123def456",
    "email": "user@example.com",
    "username": "johndoe",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors:**
- `400 Bad Request` - Invalid input (email format, username too short, weak password)
- `409 Conflict` - Email or username already in use

**Rate Limit:** 5 requests per hour per IP

---

### POST /auth/signin
Authenticate and receive JWT tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Signed in successfully",
  "data": {
    "id": "63abc123def456",
    "email": "user@example.com",
    "username": "johndoe",
    "name": "John Doe",
    "bio": "Hello world",
    "location": "San Francisco",
    "profilePicture": "https://example.com/avatar.jpg",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Cookies Set:**
- `refreshToken` - HttpOnly, Secure, SameSite=strict (7-day expiry)

**Errors:**
- `400 Bad Request` - Invalid email or password format
- `401 Unauthorized` - Invalid credentials

**Rate Limit:** 5 requests per 15 minutes per IP

---

### POST /auth/refresh
Refresh the access token using the refresh token cookie.

**Request Body:** Empty

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors:**
- `401 Unauthorized` - No refresh token or invalid/expired refresh token

---

### POST /auth/logout
Logout and invalidate the refresh token.

**Request Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Cookies Cleared:**
- `refreshToken` - Cleared

---

## 👤 User Endpoints

### GET /users/me
Get the current authenticated user's profile.

**Request Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "63abc123def456",
    "email": "user@example.com",
    "username": "johndoe",
    "name": "John Doe",
    "bio": "Full-stack developer",
    "location": "San Francisco, USA",
    "profilePicture": "https://example.com/avatar.jpg",
    "isPublic": true,
    "createdAt": "2024-01-10T08:30:00Z",
    "updatedAt": "2024-01-15T10:45:00Z"
  }
}
```

**Errors:**
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - User not found

---

### GET /users/:userId
Get a specific user's public profile.

**Request Headers:**
```
Authorization: Bearer <accessToken>
```

**URL Parameters:**
- `userId` (required) - User ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "63abc123def456",
    "username": "johndoe",
    "name": "John Doe",
    "bio": "Full-stack developer",
    "location": "San Francisco, USA",
    "profilePicture": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-10T08:30:00Z"
  }
}
```

**Errors:**
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - User not found

---

### PUT /users/profile
Update the current user's profile.

**Request Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "bio": "Passionate developer",
  "location": "New York, USA",
  "profilePicture": "https://example.com/new-avatar.jpg"
}
```

All fields are optional. Only include fields you want to update.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "63abc123def456",
    "email": "user@example.com",
    "username": "johndoe",
    "name": "John Doe",
    "bio": "Passionate developer",
    "location": "New York, USA",
    "profilePicture": "https://example.com/new-avatar.jpg",
    "createdAt": "2024-01-10T08:30:00Z",
    "updatedAt": "2024-01-15T15:20:00Z"
  }
}
```

**Validation:**
- `name` - Max 100 characters
- `bio` - Max 500 characters
- `location` - Max 100 characters
- `profilePicture` - Valid URL format

**Errors:**
- `400 Bad Request` - Validation failed
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - User not found

---

### GET /users/search
Search for users by username or name.

**Request Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `query` (required) - Search term (min 1 character)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "63abc123def456",
      "username": "johndoe",
      "name": "John Doe",
      "profilePicture": "https://example.com/avatar.jpg"
    },
    {
      "_id": "63abc789ghi012",
      "username": "john_smith",
      "name": "John Smith",
      "profilePicture": "https://example.com/avatar2.jpg"
    }
  ]
}
```

**Errors:**
- `400 Bad Request` - Missing query parameter
- `401 Unauthorized` - Invalid or missing token

**Limit:** Returns max 10 results

---

## 📝 Post Endpoints

### GET /posts/feed
Get paginated feed of all posts (newest first).

**Request Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Posts per page (default: 10, max: 50)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "63def123ghi456",
      "author": {
        "_id": "63abc123def456",
        "username": "johndoe",
        "name": "John Doe",
        "profilePicture": "https://example.com/avatar.jpg"
      },
      "content": "Just launched my new project!",
      "image": null,
      "likes": 5,
      "likedBy": ["63abc789ghi012", "63xyz789abc012"],
      "comments": [
        {
          "_id": "63cde456fgh789",
          "author": {
            "_id": "63abc789ghi012",
            "username": "jane_smith",
            "name": "Jane Smith",
            "profilePicture": "https://example.com/avatar2.jpg"
          },
          "content": "Looks awesome!",
          "createdAt": "2024-01-15T12:00:00Z"
        }
      ],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "pages": 15
  }
}
```

**Errors:**
- `401 Unauthorized` - Invalid or missing token

---

### POST /posts
Create a new post.

**Request Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "This is my new post!",
  "image": null
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "_id": "63def123ghi456",
    "author": {
      "_id": "63abc123def456",
      "username": "johndoe",
      "name": "John Doe",
      "profilePicture": "https://example.com/avatar.jpg"
    },
    "content": "This is my new post!",
    "image": null,
    "likes": 0,
    "likedBy": [],
    "comments": [],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Validation:**
- `content` - Required, 1-5000 characters
- `image` - Optional, valid URL

**Errors:**
- `400 Bad Request` - Validation failed
- `401 Unauthorized` - Invalid or missing token

---

### GET /posts/:postId
Get a specific post by ID.

**Request Headers:**
```
Authorization: Bearer <accessToken>
```

**URL Parameters:**
- `postId` (required) - Post ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "63def123ghi456",
    "author": {...},
    "content": "This is my new post!",
    "image": null,
    "likes": 0,
    "likedBy": [],
    "comments": [],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Errors:**
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Post not found

---

### PUT /posts/:postId
Update a post (author only).

**Request Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**URL Parameters:**
- `postId` (required) - Post ID

**Request Body:**
```json
{
  "content": "Updated post content",
  "image": null
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {...}
}
```

**Errors:**
- `400 Bad Request` - Validation failed
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - Not the post author
- `404 Not Found` - Post not found

---

### DELETE /posts/:postId
Delete a post (author only).

**Request Headers:**
```
Authorization: Bearer <accessToken>
```

**URL Parameters:**
- `postId` (required) - Post ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

**Errors:**
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - Not the post author
- `404 Not Found` - Post not found

---

### POST /posts/:postId/like
Like a post.

**Request Headers:**
```
Authorization: Bearer <accessToken>
```

**URL Parameters:**
- `postId` (required) - Post ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Post liked",
  "data": {
    "_id": "63def123ghi456",
    "likes": 6,
    "likedBy": ["63abc123def456", "..."],
    ...
  }
}
```

**Errors:**
- `400 Bad Request` - Already liked this post
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Post not found

---

### POST /posts/:postId/unlike
Unlike a post.

**Request Headers:**
```
Authorization: Bearer <accessToken>
```

**URL Parameters:**
- `postId` (required) - Post ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Post unliked",
  "data": {
    "_id": "63def123ghi456",
    "likes": 4,
    "likedBy": ["..."],
    ...
  }
}
```

**Errors:**
- `400 Bad Request` - Haven't liked this post
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Post not found

---

### GET /posts/user/:userId
Get all posts by a specific user.

**Request Headers:**
```
Authorization: Bearer <accessToken>
```

**URL Parameters:**
- `userId` (required) - User ID

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Posts per page (default: 10)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

**Errors:**
- `401 Unauthorized` - Invalid or missing token

---

## 📊 Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "msg": "Field-specific error message",
      "param": "fieldName"
    }
  ]
}
```

### Common HTTP Status Codes

- `200 OK` - Successful GET request
- `201 Created` - Successful POST request (resource created)
- `400 Bad Request` - Validation error or invalid input
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Authenticated but not authorized for this action
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., duplicate username)
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

## 🔒 Security Notes

1. **Token Management**
   - Access tokens expire in 15 minutes
   - Refresh tokens expire in 7 days
   - Always use HTTPS in production
   - Never expose tokens in logs

2. **Input Validation**
   - All inputs are validated and sanitized
   - HTML/script tags are automatically escaped
   - Maximum lengths enforced for all strings

3. **Rate Limiting**
   - Auth endpoints: 5 requests per 15 minutes
   - General API: 100 requests per 15 minutes
   - Violations return `429 Too Many Requests`

4. **CORS**
   - Only requests from configured FRONTEND_URL are accepted
   - Credentials (cookies) are sent with requests

---

## 💡 Usage Examples

### Example 1: Complete Sign-up and Post Creation Flow

```bash
# 1. Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "username": "johndoe",
    "password": "SecurePass123"
  }' \
  -c cookies.txt

# Response contains accessToken - save it
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 2. Create a post
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "content": "Hello, world!"
  }'

# 3. Get feed
curl http://localhost:5000/api/posts/feed \
  -H "Authorization: Bearer $TOKEN" \
  -b cookies.txt
```

### Example 2: Update Profile

```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "bio": "Software engineer",
    "location": "San Francisco"
  }'
```

---

This documentation is complete and covers all endpoints with examples, validations, errors, and security considerations. 🚀
