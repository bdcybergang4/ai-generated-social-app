const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  getMyProfile,
  updateProfile,
  searchUsers
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validateProfile } = require('../middleware/validation');

router.get('/me', protect, getMyProfile);
router.get('/search', protect, searchUsers);
router.get('/:userId', protect, getUserProfile);
router.put('/profile', protect, validateProfile, updateProfile);

module.exports = router;
