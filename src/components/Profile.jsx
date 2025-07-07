import React, { useState } from 'react';
import { ArrowLeft, Edit3, Check, X } from 'lucide-react';

const Profile = ({ 
  user, 
  profile, 
  onUpdateProfile, 
  onUpdateDisplayName,
  onCancel 
}) => {
  const [aboutMe, setAboutMe] = useState(profile.aboutMe || '');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await onUpdateProfile({ aboutMe });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateDisplayName = async () => {
    if (!displayName.trim()) {
      alert('Display name cannot be empty');
      return;
    }
    
    setIsUpdating(true);
    try {
      await onUpdateDisplayName(displayName.trim());
      setIsEditingDisplayName(false);
    } catch (error) {
      console.error('Error updating display name:', error);
      alert('Failed to update display name. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelDisplayNameEdit = () => {
    setDisplayName(user?.displayName || '');
    setIsEditingDisplayName(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
            <button
              onClick={onCancel}
              className="p-2 text-gray-600 hover:text-gray-800"
              disabled={isUpdating}
            >
              <ArrowLeft size={20} />
            </button>
          </div>
          
          <div className="flex items-center mb-6">
            <img
              src={user?.photoURL}
              alt="Profile"
              className="w-16 h-16 rounded-full mr-4"
            />
            <div className="flex-1">
              <div className="flex items-center mb-2">
                {isEditingDisplayName ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="text-lg font-semibold text-gray-800 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter display name"
                      disabled={isUpdating}
                    />
                    <button
                      onClick={handleUpdateDisplayName}
                      disabled={isUpdating}
                      className="p-1 text-green-600 hover:text-green-800 disabled:text-gray-400"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={handleCancelDisplayNameEdit}
                      disabled={isUpdating}
                      className="p-1 text-red-600 hover:text-red-800 disabled:text-gray-400"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-semibold text-gray-800">{user?.displayName}</h2>
                    <button
                      onClick={() => setIsEditingDisplayName(true)}
                      disabled={isUpdating}
                      className="p-1 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                    >
                      <Edit3 size={14} />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmitProfile}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About Me
              </label>
              <textarea
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Tell others about yourself..."
                disabled={isUpdating}
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isUpdating}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={isUpdating}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;