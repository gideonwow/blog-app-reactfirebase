import React, { useState } from 'react';
import { Link, ArrowLeft } from 'lucide-react';

const DEFAULT_HEADER_IMAGE = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';

const PostForm = ({ 
  initialData = { title: '', content: '', headerImageUrl: DEFAULT_HEADER_IMAGE },
  onCancel,
  onSubmit,
  isEditing = false
}) => {
  const [formData, setFormData] = useState(initialData);
  const [imageUrl, setImageUrl] = useState(initialData.headerImageUrl || DEFAULT_HEADER_IMAGE);
  const [imageError, setImageError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUrlChange = (url) => {
    setImageUrl(url);
    setImageError(false);
    setFormData(prev => ({ ...prev, headerImageUrl: url }));
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Validate form data
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    if (!formData.content.trim()) {
      alert('Please enter content');
      return;
    }

    // Validate image URL
    if (!imageUrl.trim()) {
      alert('Please enter a header image URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(imageUrl);
    } catch (error) {
      alert('Please enter a valid image URL');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        title: formData.title.trim(),
        content: formData.content.trim(),
        headerImageUrl: imageUrl
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to save post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUseDefaultImage = () => {
    handleImageUrlChange(DEFAULT_HEADER_IMAGE);
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
              disabled={isSubmitting}
            >
              <ArrowLeft size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Header Image URL *
              </label>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleUseDefaultImage}
                    className={`flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isSubmitting}
                  >
                    <Link size={16} className="mr-2" />
                    Use Default
                  </button>
                </div>
                
                <div className="mt-4">
                  {imageError ? (
                    <div className="w-full h-48 bg-red-50 border border-red-200 rounded-md flex items-center justify-center">
                      <div className="text-center text-red-600">
                        <p className="text-sm">Failed to load image</p>
                        <p className="text-xs mt-1">Please check the URL and try again</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={imageUrl}
                      alt="Header preview"
                      className="w-full h-48 object-cover rounded-md border"
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                    />
                  )}
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>💡 <strong>Tips for finding good images:</strong></p>
                  <ul className="mt-1 ml-4 space-y-1">
                    <li>• Use <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Unsplash</a> for free high-quality photos</li>
                    <li>• Use <a href="https://pixabay.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Pixabay</a> for free images</li>
                    <li>• Make sure the image URL ends with .jpg, .png, .gif, or .webp</li>
                    <li>• Test the URL by pasting it in a new browser tab</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter post title..."
                required
                disabled={isSubmitting}
                maxLength={200}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="10"
                placeholder="Write your post content..."
                required
                disabled={isSubmitting}
                maxLength={10000}
              />
              <div className="text-sm text-gray-500 mt-1">
                {formData.content.length}/10000 characters
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={!formData.title.trim() || !formData.content.trim() || !imageUrl.trim() || imageError || isSubmitting}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting 
                  ? (isEditing ? 'Updating...' : 'Creating...') 
                  : (isEditing ? 'Update Post' : 'Create Post')
                }
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
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