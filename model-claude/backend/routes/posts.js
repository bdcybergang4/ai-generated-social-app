const express = require('express');
const router = express.Router();
const {
  createPost,
  getFeed,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getUserPosts
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const { validatePost } = require('../middleware/validation');

router.get('/feed', protect, getFeed);
router.post('/', protect, validatePost, createPost);
router.get('/user/:userId', protect, getUserPosts);
router.get('/:postId', protect, getPostById);
router.put('/:postId', protect, validatePost, updatePost);
router.delete('/:postId', protect, deletePost);
router.post('/:postId/like', protect, likePost);
router.post('/:postId/unlike', protect, unlikePost);

module.exports = router;
