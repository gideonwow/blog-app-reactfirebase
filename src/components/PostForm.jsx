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
  const [imagePreview, setImagePreview] = useState(initialData.headerImageUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setHeaderImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.onerror = () => {
        console.error('Error reading file');
        alert('Error reading file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
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
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        title: formData.title.trim(),
        content: formData.content.trim(),
        headerImage: headerImageFile,
        headerImageUrl: imagePreview || formData.headerImageUrl
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
                Header Image
              </label>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="header-image"
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="header-image"
                    className={`flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Image size={16} className="mr-2" />
                    Choose Image
                  </label>
                  {headerImageFile && (
                    <span className="text-sm text-gray-600">
                      {headerImageFile.name}
                    </span>
                  )}
                </div>
                
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Header preview"
                      className="w-full h-48 object-cover rounded-md border"
                    />
                  </div>
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
                disabled={!formData.title.trim() || !formData.content.trim() || isSubmitting}
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