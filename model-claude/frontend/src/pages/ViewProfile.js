import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';
import apiClient from '../utils/apiClient';
import { formatDate, sanitizeHtml } from '../utils/helpers';

const ViewProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileResponse = await apiClient.get(`/users/${userId}`);
        setProfile(profileResponse.data.data);

        const postsResponse = await apiClient.get(`/posts/user/${userId}`);
        setPosts(postsResponse.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  if (!profile) {
    return <div className="flex justify-center items-center h-screen">Profile not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {profile.profilePicture && (
          <img
            src={profile.profilePicture}
            alt={profile.username}
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
        )}
        <h1 className="text-3xl font-bold text-center text-gray-800">{profile.name || profile.username}</h1>
        <p className="text-center text-gray-600 mb-2">@{profile.username}</p>
        {profile.bio && <p className="text-center text-gray-700 mb-2">{sanitizeHtml(profile.bio)}</p>}
        {profile.location && <p className="text-center text-gray-600">📍 {sanitizeHtml(profile.location)}</p>}
        <p className="text-center text-gray-500 text-sm mt-4">
          Joined {formatDate(profile.createdAt)}
        </p>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Posts</h2>
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts yet</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-700">{sanitizeHtml(post.content)}</p>
              <p className="text-gray-500 text-sm mt-2">{formatDate(post.createdAt)}</p>
              <p className="text-gray-600 text-sm mt-1">👍 {post.likes} likes</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewProfile;
