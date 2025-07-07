import React, { useState, useEffect } from 'react';
import { onAuthChange, signInWithGoogle, handleSignOut, updateUserDisplayName } from './auth';
import { 
  getAllPosts, 
  getUserPosts, 
  createPost, 
  updatePost, 
  deletePost, 
  getPost, 
  incrementPostViews,
  getUserProfile,
  updateUserProfile,
  updateUserPostsDisplayName
} from './firestore';
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import PostDetail from './components/PostDetail';
import Profile from './components/Profile';
import Navbar from './components/Navbar';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState('allPosts');
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState({ aboutMe: '' });

  // Authentication effect
  useEffect(() => {
    console.log('Setting up auth listener...');
    const unsubscribe = onAuthChange(async (user) => {
      console.log('Auth state changed:', user);
      setUser(user);
      setLoading(false);
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Load posts effect
  useEffect(() => {
    const loadPosts = async () => {
      try {
        console.log('Loading all posts...');
        const allPosts = await getAllPosts();
        console.log('Loaded posts:', allPosts);
        setPosts(allPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
        setError('Failed to load posts');
      }
    };

    loadPosts();
  }, []);

  // Load user posts when user changes
  useEffect(() => {
    const loadUserPosts = async () => {
      if (user) {
        try {
          console.log('Loading user posts...');
          const posts = await getUserPosts(user.uid);
          console.log('Loaded user posts:', posts);
          setUserPosts(posts);
        } catch (error) {
          console.error('Error loading user posts:', error);
        }
      }
    };

    loadUserPosts();
  }, [user]);

  // Handle sign in
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Failed to sign in');
    }
  };

  // Handle sign out
  const handleSignOutClick = async () => {
    try {
      await handleSignOut();
      setUser(null);
      setCurrentPage('allPosts');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Handle view post
  const handleViewPost = async (post) => {
    try {
      await incrementPostViews(post.id);
      const updatedPost = await getPost(post.id);
      setSelectedPost(updatedPost);
    } catch (error) {
      console.error('Error viewing post:', error);
      setSelectedPost(post);
    }
  };

  // Handle create post
  const handleCreatePost = async (postData) => {
    try {
      const newPostData = {
        title: postData.title,
        content: postData.content,
        headerImageUrl: postData.headerImageUrl
      };

      await createPost(newPostData, user.uid, user.displayName);
      const allPosts = await getAllPosts();
      setPosts(allPosts);
      
      if (currentPage === 'myPosts') {
        const userPosts = await getUserPosts(user.uid);
        setUserPosts(userPosts);
      }
      
      setShowCreatePost(false);
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post');
    }
  };

  // Handle update post
  const handleUpdatePost = async (postData) => {
    try {
      const updatedPostData = {
        title: postData.title,
        content: postData.content,
        headerImageUrl: postData.headerImageUrl
      };

      await updatePost(editingPost.id, updatedPostData);
      const allPosts = await getAllPosts();
      setPosts(allPosts);
      
      if (currentPage === 'myPosts') {
        const userPosts = await getUserPosts(user.uid);
        setUserPosts(userPosts);
      }
      
      setEditingPost(null);
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Failed to update post');
    }
  };

  // Handle delete post
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await deletePost(postId);
      const allPosts = await getAllPosts();
      setPosts(allPosts);
      
      if (currentPage === 'myPosts') {
        const userPosts = await getUserPosts(user.uid);
        setUserPosts(userPosts);
      }
      
      // If we're viewing the deleted post, go back to list
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(null);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post');
    }
  };

  // Handle update profile
  const handleUpdateProfile = async (profileData) => {
    try {
      await updateUserProfile(
        user.uid, 
        profileData, 
        user.displayName, 
        user.photoURL
      );
      const updatedProfile = await getUserProfile(user.uid);
      setUserProfile(updatedProfile);
      setShowProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  // Handle update display name
  const handleUpdateDisplayName = async (newDisplayName) => {
    try {
      // Update the display name in Firebase Auth
      const updatedUser = await updateUserDisplayName(newDisplayName);
      
      // Update the user profile in Firestore
      await updateUserProfile(
        user.uid, 
        { aboutMe: userProfile.aboutMe }, 
        newDisplayName, 
        user.photoURL
      );
      
      // Update all posts by this user with the new display name
      await updateUserPostsDisplayName(user.uid, newDisplayName);
      
      // Update local state
      setUser(updatedUser);
      
      // Refresh posts to show updated display name
      const allPosts = await getAllPosts();
      setPosts(allPosts);
      
      if (currentPage === 'myPosts') {
        const userPosts = await getUserPosts(user.uid);
        setUserPosts(userPosts);
      }
      
      // Update selected post if it's by this user
      if (selectedPost && selectedPost.author.id === user.uid) {
        const updatedPost = await getPost(selectedPost.id);
        setSelectedPost(updatedPost);
      }
      
    } catch (error) {
      console.error('Error updating display name:', error);
      throw error;
    }
  };

  // Error display
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button 
            onClick={() => setError(null)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Profile page
  if (showProfile) {
    return (
      <Profile
        user={user}
        profile={userProfile}
        onUpdateProfile={handleUpdateProfile}
        onUpdateDisplayName={handleUpdateDisplayName}
        onCancel={() => setShowProfile(false)}
      />
    );
  }

  // Create post page
  if (showCreatePost) {
    return (
      <PostForm
        onCancel={() => setShowCreatePost(false)}
        onSubmit={handleCreatePost}
      />
    );
  }

  // Edit post page
  if (editingPost) {
    return (
      <PostForm
        initialData={{
          title: editingPost.title,
          content: editingPost.content,
          headerImageUrl: editingPost.headerImage
        }}
        onCancel={() => setEditingPost(null)}
        onSubmit={handleUpdatePost}
        isEditing={true}
      />
    );
  }

  // Post detail page
  if (selectedPost) {
    return (
      <PostDetail
        post={selectedPost}
        user={user}
        onBack={() => setSelectedPost(null)}
        onEdit={(post) => setEditingPost(post)}
        onDelete={handleDeletePost}
      />
    );
  }

  // Main app layout
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        user={user}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onCreatePost={() => setShowCreatePost(true)}
        onShowProfile={() => setShowProfile(true)}
        onSignOut={handleSignOutClick}
        onSignIn={handleSignIn}
      />

      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {currentPage === 'allPosts' ? 'All Posts' : 'My Posts'}
          </h2>
          <p className="text-gray-600">
            {currentPage === 'allPosts' 
              ? 'Discover amazing posts from our community' 
              : 'Manage your published posts'}
          </p>
        </div>

        <PostList
          posts={currentPage === 'allPosts' ? posts : userPosts}
          currentPage={currentPage}
          user={user}
          onViewPost={handleViewPost}
          onEditPost={(post) => setEditingPost(post)}
          onDeletePost={handleDeletePost}
        />

        {(currentPage === 'allPosts' ? posts : userPosts).length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <span className="text-4xl">✏️</span>
            </div>
            <p className="text-gray-600 text-lg">
              {currentPage === 'allPosts' 
                ? 'No posts available yet' 
                : 'You haven\'t created any posts yet'}
            </p>
            {user && currentPage === 'myPosts' && (
              <button
                onClick={() => setShowCreatePost(true)}
                className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Create Your First Post
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;