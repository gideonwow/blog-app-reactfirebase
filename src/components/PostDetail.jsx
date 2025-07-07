import React from 'react';
import { User, Calendar, Eye, Edit3, Trash2, ArrowLeft } from 'lucide-react';

const PostDetail = ({ 
  post, 
  user, 
  onBack, 
  onEdit, 
  onDelete 
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Posts
            </button>
            
            <img
              src={post.headerImage}
              alt="Post header"
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-600">
                  <User size={16} className="mr-1" />
                  <span>{post.author.name}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar size={16} className="mr-1" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Eye size={16} className="mr-1" />
                  <span>{post.views || 0} views</span>
                </div>
              </div>
              
              {user && user.uid === post.author.id && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(post)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(post.id)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
            
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;