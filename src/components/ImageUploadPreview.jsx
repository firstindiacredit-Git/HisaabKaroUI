import React, { useState } from "react";

const ImageUploadPreview = ({
  onImageChange,
  className = "",
  label = "Upload Image",
}) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("Image size should be less than 5MB");
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        if (onImageChange) {
          onImageChange(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        {/* Image Preview */}
        <div className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-500">
                  Click or drag and drop to upload an image
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            </div>
          )}

          {/* File Input */}
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            title="Upload image"
          />
        </div>

        {/* Label */}
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      </div>
    </div>
  );
};

export default ImageUploadPreview;
