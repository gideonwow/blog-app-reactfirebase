import React, { useState } from 'react';
import { Image, ArrowLeft } from 'lucide-react';

const DEFAULT_HEADER_IMAGE = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';

const PostForm = ({ 
  initialData = { title: '', content: '', headerImageUrl: DEFAULT_HEADER_IMAGE },
  onCancel,
  onSubmit,
  isEditing = false
}) => {
  const [formData, setFormData] = useState(initialData);
  const [headerImageFile, setHeaderImageFile] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeaderImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, headerImageUrl: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      content: formData.content,
      headerImage: headerImageFile,
      headerImageUrl: formData.headerImageUrl
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {isEditing ? 'Edit Post' : 'Create New Post'}
            </h1>
            <button
              onClick={onCancel}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Header Image
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="header-image"
                />
                <label
                  htmlFor="header-image"
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer"
                >
                  <Image size={16} className="mr-2" />
                  Choose Image
                </label>
                {formData.headerImageUrl && (
                  <img
                    src={formData.headerImageUrl}
                    alt="Header preview"
                    className="w-20 h-12 object-cover rounded-md"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter post title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="10"
                placeholder="Write your post content..."
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={!formData.title.trim() || !formData.content.trim()}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isEditing ? 'Update Post' : 'Create Post'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
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

export default PostForm;