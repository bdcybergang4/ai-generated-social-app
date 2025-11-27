# 🔧 Troubleshooting Guide

Common issues and solutions for the Secure MERN Social Media Application.

## Backend Issues

### Issue: "Cannot find module 'express'"

**Problem:** Dependencies not installed.

**Solution:**
```bash
cd backend
npm install
```

Verify `node_modules` folder was created.

---

### Issue: "PORT 5000 already in use"

**Problem:** Another application is using port 5000.

**Solution:**

Option 1: Kill the process using the port
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

Option 2: Change the port in `.env`
```
PORT=5001
```
Then restart the backend.

---

### Issue: "Cannot connect to MongoDB"

**Problem:** MongoDB connection string is invalid or database is unreachable.

**Solution:**

1. Verify MongoDB URI in `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/socialmedia
```

2. Check credentials:
   - Username and password must be URL-encoded if they contain special characters
   - Example: `p@ssw0rd` → `p%40ssw0rd`

3. For MongoDB Atlas:
   - Go to Security → Network Access
   - Ensure your IP is whitelisted (or use 0.0.0.0/0 for development)
   - Database name at end of URI must exist or be created

4. Test connection:
```bash
# Install mongodb-shell (or use mongosh)
mongosh "mongodb+srv://username:password@cluster.mongodb.net/"
```

---

### Issue: "Invalid token" or "JWT malformed"

**Problem:** JWT secrets in `.env` are invalid or mismatched.

**Solution:**

1. Generate new secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

2. Update `.env`:
```
ACCESS_TOKEN_SECRET=<new-random-string>
REFRESH_TOKEN_SECRET=<new-random-string>
```

3. Restart backend server

4. Client must clear tokens:
```javascript
localStorage.removeItem('accessToken');
localStorage.removeItem('user');
```

---

### Issue: "CORS error: Access-Control-Allow-Origin"

**Problem:** Frontend URL doesn't match CORS configuration.

**Solution:**

1. Check `FRONTEND_URL` in backend `.env`:
```
FRONTEND_URL=http://localhost:3000
```

2. Ensure it matches exactly:
   - Include protocol (http:// or https://)
   - Include port (usually 3000 for React)
   - No trailing slash

3. Restart backend server after changing `.env`

4. Check browser console - error should specify what origin was rejected

---

### Issue: "ValidationError: path `email` is required"

**Problem:** Required fields missing in request body.

**Solution:**

Verify request includes:
- For signup: `email`, `username`, `password`
- For signin: `email`, `password`
- For post: `content`
- For profile: at least one field (`name`, `bio`, `location`, `profilePicture`)

Example:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "SecurePass123"
  }'
```

---

### Issue: "RateLimitError: Too many requests"

**Problem:** Too many requests to the same endpoint from same IP.

**Solution:**

Wait for the rate limit window to reset:
- Auth endpoints: Wait 15 minutes
- General API: Wait 15 minutes

For development, temporarily modify `backend/middleware/rateLimiter.js`:
```javascript
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,  // Increase from 5 to 100
});
```

---

### Issue: Server crashes on startup

**Problem:** Missing environment variables or configuration error.

**Solution:**

1. Check all required `.env` variables are set:
```
MONGODB_URI
PORT
ACCESS_TOKEN_SECRET
REFRESH_TOKEN_SECRET
NODE_ENV
FRONTEND_URL
```

2. Check `.env` file syntax - should be `KEY=VALUE` (no quotes)

3. Check `server.js` logs for specific error message

4. Restart: `npm run dev`

---

## Frontend Issues

### Issue: "Module not found" or "Cannot find module 'react'"

**Problem:** Dependencies not installed or node_modules corrupted.

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json  # Mac/Linux
rmdir /s node_modules & del package-lock.json  # Windows
npm install
```

---

### Issue: "REACT_APP_API_URL is undefined"

**Problem:** Environment variables not loaded.

**Solution:**

1. Create `.env.local` in frontend directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

2. Restart dev server (it reads .env on startup):
```bash
npm start
```

3. Variables must start with `REACT_APP_` to be accessible in React

---

### Issue: "Cannot GET /" or blank white screen

**Problem:** App not starting or routing not working.

**Solution:**

1. Check frontend server is running:
   - Should see "On your network: http://localhost:3000" in terminal
   - Open http://localhost:3000 in browser

2. Check browser console (F12) for errors

3. Clear browser cache:
   - Developer Tools → Application → Clear site data
   - Or use incognito window

4. Restart frontend:
```bash
npm start
```

---

### Issue: "Blank page on /feed but can access /signin"

**Problem:** Authentication not working or token invalid.

**Solution:**

1. Check localStorage:
   - Open DevTools (F12) → Application → Local Storage
   - Should have `accessToken` and `user` keys
   - If not, sign in again

2. Check if accessing protected route:
   - Routes like `/feed` require authentication
   - Not authenticated users are redirected to `/signin`

3. Clear localStorage and sign in again:
```javascript
// In DevTools console
localStorage.clear();
window.location.href = '/signin';
```

---

### Issue: "Infinite redirect loop between signin and feed"

**Problem:** Token refresh failing or token expired.

**Solution:**

1. Clear all auth data:
```javascript
localStorage.removeItem('accessToken');
localStorage.removeItem('user');
sessionStorage.clear();
```

2. Reload page and sign in again

3. Check backend is running and `/api/auth/refresh` works

4. Verify JWT secrets haven't changed since login

---

### Issue: "Cannot read property 'map' of undefined"

**Problem:** Data not loaded or API response format unexpected.

**Solution:**

1. Check browser Network tab (F12) for API responses
   - Look for failed requests (red)
   - Check response format matches expected structure

2. Verify API is running and accessible:
```bash
curl http://localhost:5000/api/health
```

3. Check for console errors (F12 → Console tab)

4. Ensure component is handling loading state properly

---

### Issue: "CORS error in browser console"

**Problem:** Frontend and backend CORS configuration mismatch.

**Solution:**

1. Verify backend `.env`:
```
FRONTEND_URL=http://localhost:3000
```

2. Verify frontend `.env.local`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

3. Check browser console error - it shows what origin was rejected

4. Restart both servers after changing config

5. In Chrome, see exact error: F12 → Network → failed request → Response

---

### Issue: "Post/profile doesn't update after form submission"

**Problem:** API call successful but UI not updating.

**Solution:**

1. Check browser console for errors (F12 → Console)

2. Check Network tab for failed requests (F12 → Network)

3. Verify form data is being sent:
```javascript
// In form onSubmit, log the data
console.log('Sending:', data);
```

4. Check if response is being handled:
   - Successful response should update state/context
   - Error response should show error message

5. Try manual API call to verify endpoint works:
```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "New Name"}'
```

---

### Issue: "TypeError: Cannot read property 'user' of undefined"

**Problem:** AuthContext not initialized or not wrapped properly.

**Solution:**

1. Verify `App.js` has `<AuthProvider>`:
```javascript
<AuthProvider>
  <Routes>
    ...
  </Routes>
</AuthProvider>
```

2. Verify components use `useContext(AuthContext)` correctly:
```javascript
import { AuthContext } from '../utils/AuthContext';
const { user } = useContext(AuthContext);
```

3. Ensure context is exported correctly in `AuthContext.js`

---

## General Debugging Tips

### Enable Detailed Logging

**Backend:**
```bash
# Set debug environment
DEBUG=* npm run dev
```

**Frontend:**
```javascript
// In components, add console.logs
console.log('Auth state:', authContext);
console.log('API response:', response.data);
```

---

### Test API with Postman or cURL

Instead of testing through UI, directly call API:

```bash
# 1. Sign in and get token
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "TestPass123"}' \
  -c cookies.txt

# 2. Save the accessToken from response
TOKEN="..."

# 3. Test protected endpoint
curl http://localhost:5000/api/users/me \
  -H "Authorization: Bearer $TOKEN" \
  -b cookies.txt
```

---

### Browser DevTools

**Console (F12 → Console):**
- Shows JavaScript errors
- Warnings about deprecated code
- Network-related issues

**Network (F12 → Network):**
- Shows all API requests/responses
- HTTP status codes
- Request/response headers and body
- Can filter by XHR (API calls)

**Application (F12 → Application):**
- Local Storage - check tokens
- Cookies - check refresh token
- Cache - clear if having issues

**Sources (F12 → Sources):**
- Set breakpoints in code
- Step through execution
- Inspect variables

---

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Cannot GET /api/..." | Backend not running | `npm run dev` in backend |
| "SyntaxError: Unexpected token" | JSON parsing error | Check request/response format |
| "401 Unauthorized" | Invalid token | Clear localStorage & sign in again |
| "403 Forbidden" | Not authorized for action | Only post author can delete/update |
| "404 Not Found" | Resource doesn't exist | Check ID is correct |
| "429 Too Many Requests" | Rate limited | Wait 15 minutes or use incognito |
| "500 Internal Server Error" | Backend error | Check server logs and `.env` |

---

### Checklist for Getting Started

- [ ] Node.js installed (`node --version`)
- [ ] MongoDB URI configured in `backend/.env`
- [ ] `backend/.env` has ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET
- [ ] `npm install` run in both directories
- [ ] Backend running on port 5000 (`npm run dev`)
- [ ] Frontend running on port 3000 (`npm start`)
- [ ] Can sign up and create account
- [ ] Can sign in and see feed
- [ ] Can create a post
- [ ] Can view profile
- [ ] Can like/unlike posts
- [ ] Can logout

If any step fails, refer to the issue section above.

---

### Getting Help

1. **Check logs:**
   - Backend: Terminal where `npm run dev` is running
   - Frontend: Browser DevTools Console (F12)

2. **Search in code:**
   - Error message might be in a specific file
   - Use VS Code find (Ctrl+F) to search

3. **Read comments:**
   - Code files have comments explaining key parts
   - Check specific file for context

4. **Test with curl:**
   - Isolate frontend vs backend issues
   - API should work independent of UI

5. **Reset everything:**
   - Clear localStorage: `localStorage.clear()`
   - Delete `.env` and recreate from `.env.example`
   - Delete `node_modules` and reinstall: `npm install`
   - Restart both servers

Good luck! 🚀
