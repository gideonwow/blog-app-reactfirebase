import React from 'react';
import { Plus, Settings, LogOut } from 'lucide-react';

const Navbar = ({ 
  user, 
  currentPage, 
  onPageChange, 
  onCreatePost, 
  onShowProfile, 
  onSignOut, 
  onSignIn 
}) => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">BlogBro</h1>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onPageChange('allPosts')}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentPage === 'allPosts'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              All Posts
            </button>
            
            {user && (
              <button
                onClick={() => onPageChange('myPosts')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  currentPage === 'myPosts'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                My Posts
              </button>
            )}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={onCreatePost}
                  className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                  <Plus size={16} className="mr-2" />
                  Create Post
                </button>
                
                <div className="flex items-center space-x-2">
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-gray-700">{user.displayName}</span>
                </div>
                
                <button
                  onClick={onShowProfile}
                  className="p-2 text-gray-600 hover:text-gray-800"
                >
                  <Settings size={16} />
                </button>
                
                <button
                  onClick={onSignOut}
                  className="p-2 text-gray-600 hover:text-gray-800"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={onSignIn}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Sign In with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;