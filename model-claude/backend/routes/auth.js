const express = require('express');
const router = express.Router();
const {
  signup,
  signin,
  refreshAccessToken,
  logout
} = require('../controllers/authController');
const { validateSignup, validateSignin } = require('../middleware/validation');
const { loginLimiter, signupLimiter } = require('../middleware/rateLimiter');
const { protect } = require('../middleware/auth');

router.post('/signup', signupLimiter, validateSignup, signup);
router.post('/signin', loginLimiter, validateSignin, signin);
router.post('/refresh', refreshAccessToken);
router.post('/logout', protect, logout);

module.exports = router;
