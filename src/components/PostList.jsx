import React from 'react';
import { Calendar, User, Eye, Edit3, Trash2 } from 'lucide-react';

const PostList = ({ 
  posts, 
  currentPage, 
  user, 
  onViewPost, 
  onEditPost, 
  onDeletePost 
}) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <img
            src={post.headerImage}
            alt="Post header"
            className="w-full h-48 object-cover cursor-pointer"
            onClick={() => onViewPost(post)}
          />
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-sm text-gray-600">
                <User size={14} className="mr-1" />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Eye size={14} className="mr-1" />
                <span>{post.views || 0}</span>
              </div>
            </div>
            
            <h3 
              className="text-lg font-semibold text-gray-800 mb-2 cursor-pointer hover:text-blue-600"
              onClick={() => onViewPost(post)}
            >
              {post.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
              {post.content.substring(0, 100)}...
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-500">
                <Calendar size={12} className="mr-1" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              
              {user && user.uid === post.author.id && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditPost(post)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => onDeletePost(post.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;