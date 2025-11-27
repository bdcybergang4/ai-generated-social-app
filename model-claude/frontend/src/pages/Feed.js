import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../utils/AuthContext';
import apiClient from '../utils/apiClient';
import { sanitizeHtml, formatDate } from '../utils/helpers';

const Feed = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/posts/feed?page=${page}&limit=10`);
      if (page === 1) {
        setPosts(response.data.data);
      } else {
        setPosts((prev) => [...prev, ...response.data.data]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading feed');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setSubmitting(true);
    try {
      const response = await apiClient.post('/posts', {
        content: newPostContent.trim()
      });
      setPosts((prev) => [response.data.data, ...prev]);
      setNewPostContent('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId, isLiked) => {
    try {
      const endpoint = isLiked ? 'unlike' : 'like';
      const response = await apiClient.post(`/posts/${postId}/${endpoint}`);
      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? response.data.data : post))
      );
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await apiClient.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting post');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Create Post */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">What's on your mind?</h2>
        <form onSubmit={handleCreatePost}>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            maxLength="5000"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Share something with your friends..."
          />
          <div className="flex justify-between items-center mt-4">
            <p className="text-gray-500 text-sm">
              {newPostContent.length}/5000 characters
            </p>
            <button
              type="submit"
              disabled={submitting || !newPostContent.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              {submitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Posts */}
      {loading && page === 1 ? (
        <div className="text-center text-gray-500">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-500">No posts yet</div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const isLiked = post.likedBy?.includes(user?.id);
            return (
              <div key={post._id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {post.author?.profilePicture && (
                      <img
                        src={post.author.profilePicture}
                        alt={post.author.username}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-gray-800">
                        <a
                          href={`/profile/${post.author._id}`}
                          className="hover:text-blue-500"
                        >
                          {post.author?.name || post.author?.username}
                        </a>
                      </p>
                      <p className="text-gray-500 text-sm">@{post.author?.username}</p>
                    </div>
                  </div>
                  {post.author?._id === user?.id && (
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  )}
                </div>

                <p className="text-gray-700 mb-3">{sanitizeHtml(post.content)}</p>

                {post.image && (
                  <img
                    src={post.image}
                    alt="post"
                    className="w-full rounded-lg mb-3 max-h-96 object-cover"
                  />
                )}

                <p className="text-gray-500 text-sm mb-3">{formatDate(post.createdAt)}</p>

                <div className="flex gap-4 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => handleLike(post._id, isLiked)}
                    className={`flex items-center gap-2 font-medium transition-colors ${
                      isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    {isLiked ? '❤️' : '🤍'} {post.likes} likes
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Load more */}
      {!loading && posts.length > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Load More Posts
          </button>
        </div>
      )}
    </div>
  );
};

export default Feed;
