import React, { useState } from "react";
import axios from "axios";
import { FaPlayCircle } from "react-icons/fa";
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";

const AddBook = ({
  onBookAdded,
  onBookUpdated,
  editingBook = null,
  onClose,
}) => {
  const [bookName, setBookName] = useState(editingBook?.bookname || "");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    editingBook?.profile || null
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const getAuthToken = () => localStorage.getItem("token");

  const isGifImage = (file) => {
    return (
      file?.type === "image/gif" ||
      (typeof file === "string" && file.toLowerCase().endsWith(".gif"))
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please select a valid image file");
        return;
      }

      // Validate file size (e.g., 5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setErrorMessage("Image size should be less than 5MB");
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBook = async () => {
    if (!bookName.trim()) {
      setErrorMessage("Please enter a book name");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("bookname", bookName.trim());
      if (profileImage) {
        formData.append("profile", profileImage);
      }

      if (editingBook) {
        const response = await axios.put(
          `${process.env.REACT_APP_URL}/api/v2/transactionBooks/update-book/${editingBook._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        onBookUpdated(response.data.book);
        const event = new CustomEvent("bookAdded", {
          detail: response.data.book,
        });
        window.dispatchEvent(event);
        setShowSuccess(true);
        // Modal will be closed by the success modal's onClose handler
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_URL}/api/v2/transactionBooks/create-book`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        onBookAdded(response.data.book);
        const event = new CustomEvent("bookAdded", {
          detail: response.data.book,
        });
        window.dispatchEvent(event);
        setShowSuccess(true);
        // Modal will be closed by the success modal's onClose handler
      }
    } catch (error) {
      console.error("Error saving book:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred while saving the book"
      );
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    // Close the form after success modal is closed
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
          <h2 className="text-2xl font-bold mb-4">
            {editingBook ? "Edit Book" : "Add New Book"}
          </h2>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2">
              Book Name
            </label>
            <input
              type="text"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
              className="shadow appearance-none border rounded bg-white dark:bg-gray-700 dark:text-white w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter book name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2">
              Book Profile Image
            </label>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF (MAX. 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/gif"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {imagePreview && (
                <div className="mt-4">
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg shadow-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/128?text=No+Image";
                      }}
                    />
                    {isGifImage(profileImage || editingBook?.profile) && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full flex items-center gap-1.5 text-white text-xs">
                        <FaPlayCircle className="w-3 h-3" />
                        <span className="font-medium">GIF</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {errorMessage && (
            <ErrorModal
              message={errorMessage}
              onClose={() => setErrorMessage("")}
            />
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveBook}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
            >
              {editingBook ? "Update" : "Add"} Book
            </button>
          </div>
        </div>
      </div>

      {showSuccess && (
        <SuccessModal
          message={
            editingBook
              ? "Book updated successfully!"
              : "Book added successfully!"
          }
          onClose={handleSuccessClose}
        />
      )}
    </>
  );
};

export default AddBook;
