import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  FaTh,
  FaList,
  FaEdit,
  FaTrash,
  FaSearch,
  FaPlus,
  FaBook,
  FaPlayCircle,
} from "react-icons/fa";
import { Image, Button, Input, Badge } from "antd";
import SuccessModal from "../collaborativeBook/youAdded/SuccessModal";
import ErrorModal from "../../components/ErrorModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import AddBook from "./AddBook";
import { BookContext } from "../Layout/Layout";
import { useNavigate } from 'react-router-dom';

const isGifImage = (url) => {
  return url?.toLowerCase().endsWith(".gif");
};

const BookPage = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    message: "",
    icon: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    bookId: null,
    bookName: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const { bookAdded } = useContext(BookContext);
  const navigate = useNavigate();

  // Base64 encoded placeholder image (a simple gray square with "No Image" text)
  const placeholderImage =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line
  }, [bookAdded]);

  const getAuthToken = () => localStorage.getItem("token");

  const fetchBooks = async () => {
    if (!getAuthToken()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/api/v2/transactionBooks/getAll-books`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      if (response.data && Array.isArray(response.data.books)) {
        setBooks(response.data.books);
      } else {
        console.warn("Invalid books data format:", response.data);
        setBooks([]);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setErrorMessage("Failed to fetch books");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (book) => {
    setDeleteModal({
      isOpen: true,
      bookId: book._id,
      bookName: book.bookname,
    });
  };

  const handleDeleteBook = async (bookId) => {
    try {
      const bookToDelete = books.find((book) => book._id === bookId);
      const response = await axios.delete(
        `${process.env.REACT_APP_URL}/api/v2/transactionBooks/delete-book/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (bookToDelete) {
        setBooks(books.filter((book) => book._id !== bookId));
        setDeleteModal({ isOpen: false, bookId: null, bookName: "" });
        setSuccessModal({
          isOpen: true,
          message: `Book "${bookToDelete.bookname}" and all its associated transactions have been successfully deleted!`,
          icon: (
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <FaTrash className="w-8 h-8 text-red-500" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          ),
        });
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Error deleting book and its transactions"
      );
    }
  };

  const handleBookAdded = (newBook) => {
    setBooks((prevBooks) => [...prevBooks, newBook]);
    setShowModal(false);
    setSuccessModal({
      isOpen: true,
      message: `Book "${newBook.bookname}" has been successfully added!`,
    });
  };

  const handleBookUpdated = (updatedBook) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book._id === updatedBook._id ? updatedBook : book
      )
    );
    setEditingBook(null);
    setShowModal(false);
    setSuccessModal({
      isOpen: true,
      message: `Book "${updatedBook.bookname}" has been successfully updated!`,
    });
  };

  const handleBookClick = (bookId) => {
    navigate(`/books/${bookId}/users`);
  };

  const filteredBooks = books.filter((book) =>
    book.bookname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
      {filteredBooks.map((book) => (
        <div
          key={book._id}
          className="group relative shadow-sm bg-white dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-500 ease-out cursor-pointer"
          onClick={() => handleBookClick(book._id)}
        >
          {/* Glass effect top bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 transform origin-left transition-transform duration-500 ease-out group-hover:scale-x-100 scale-x-0" />

          {/* Book Cover Container */}
          <div className="relative aspect-[8/5] overflow-hidden">
            {book.profile ? (
              <>
                <Image
                  src={`${process.env.REACT_APP_URL}${book.profile}`}
                  alt={book.bookname}
                  placeholder={placeholderImage}
                  className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
                  preview={{
                    mask: (
                      <div className="flex items-center justify-center w-full h-full bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20">
                          Preview Cover
                        </span>
                      </div>
                    ),
                  }}
                />
                {/* GIF Indicator */}
                {isGifImage(book.profile) && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full flex items-center gap-2 text-white text-sm animate-pulse">
                    <FaPlayCircle className="w-4 h-4 text-white" />
                    <span className="font-medium">GIF</span>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                <FaBook className="w-16 h-16 text-gray-400 dark:text-gray-500" />
              </div>
            )}

            {/* Floating Badge */}
            <div className="absolute top-4 right-4">
              <div className="px-3 py-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-full shadow-lg flex items-center gap-2 text-sm">
                <FaBook className="text-indigo-500" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Book
                </span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate group-hover:text-clip group-hover:whitespace-normal transition-all duration-300">
              {book.bookname}
            </h3>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mt-1 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <Button
                type="text"
                icon={<FaEdit />}
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingBook(book);
                }}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                Edit
              </Button>
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
              <Button
                type="text"
                danger
                icon={<FaTrash />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(book);
                }}
                className="flex items-center gap-2"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[120px]"
              >
                Cover
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Book Name
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[200px]"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredBooks.map((book) => (
              <tr
                key={book._id}
                className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer"
                onClick={() => handleBookClick(book._id)}
              >
                <td className="whitespace-nowrap">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                    {book.profile ? (
                      <>
                        <Image
                          src={`${process.env.REACT_APP_URL}${book.profile}`}
                          alt={book.bookname}
                          className="w-full h-full object-cover"
                          preview={false}
                        />
                        {isGifImage(book.profile) && (
                          <div className="absolute bottom-1 right-1 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded-full flex items-center gap-1 text-white text-xs">
                            <FaPlayCircle className="w-3 h-3" />
                            <span className="font-medium">GIF</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <FaBook className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                      </div>
                    )}
                  </div>
                </td>
                <td className=" whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {book.bookname}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      type="text"
                      icon={<FaEdit />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingBook(book);
                      }}
                      className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    />
                    <Button
                      type="text"
                      danger
                      icon={<FaTrash />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(book);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Books Collection
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Manage and organize your books efficiently
            </p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<FaPlus />}
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 border-0 shadow-lg hover:shadow-xl rounded-lg px-6"
          >
            Add Book
          </Button>
        </div>

        {/* Search and View Toggle */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <Input
            prefix={<FaSearch className="text-gray-600 dark:text-gray-300" />}
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs dark:bg-gray-800 border-gray-200 dark:border-gray-800 bg-white dark:text-gray-300"
            size="large"
          />
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm">
            <Button
              type={viewMode === "grid" ? "primary" : "text"}
              icon={<FaTh />}
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-indigo-600" : ""}
            />
            <Button
              type={viewMode === "list" ? "primary" : "text"}
              icon={<FaList />}
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-indigo-600" : ""}
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <FaBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No books found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Get started by adding your first book
            </p>
            <Button
              type="primary"
              icon={<FaPlus />}
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 border-0"
            >
              Add Book
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          renderGridView()
        ) : (
          renderListView()
        )}
      </div>

      {showModal && !editingBook && (
        <AddBook
          onBookAdded={handleBookAdded}
          onClose={() => setShowModal(false)}
        />
      )}

      {editingBook && (
        <AddBook
          editingBook={editingBook}
          onBookUpdated={handleBookUpdated}
          onClose={() => {
            setEditingBook(null);
            setShowModal(false);
          }}
        />
      )}

      {deleteModal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md mx-4 relative z-10">
            <div className="text-center">
              {/* Warning Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-10 w-10 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Delete "{deleteModal.bookName}"?
              </h3>

              {/* Warning Message */}
              <div className="mb-6 space-y-3">
                <p className="text-gray-500 dark:text-gray-400">
                  This action cannot be undone. Are you sure you want to delete
                  this book?
                </p>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-400 font-medium">
                    ⚠️ Warning: This will permanently delete:
                  </p>
                  <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-400 list-disc list-inside">
                    <li>All transaction records associated with this book</li>
                    <li>All payment history and balances</li>
                    <li>Book profile and settings</li>
                  </ul>
                </div>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  * These changes are irreversible and cannot be recovered
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  block
                  size="large"
                  onClick={() =>
                    setDeleteModal({
                      isOpen: false,
                      bookId: null,
                      bookName: "",
                    })
                  }
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-0"
                >
                  Cancel
                </Button>
                <Button
                  block
                  size="large"
                  onClick={() => handleDeleteBook(deleteModal.bookId)}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 hover:from-red-600 hover:to-red-700"
                >
                  Yes, Delete Book
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {successModal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-sm mx-4 relative z-10 transform transition-all">
            {successModal.icon || (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
            )}
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Success!
            </h3>
            <p className="text-gray-500 text-center mb-6">
              {successModal.message}
            </p>
            <Button
              type="primary"
              block
              size="large"
              onClick={() =>
                setSuccessModal({ isOpen: false, message: "", icon: null })
              }
              className="bg-gradient-to-r from-green-500 to-green-600 border-0 hover:from-green-600 hover:to-green-700"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {errorMessage && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}
    </div>
  );
};

export default BookPage;
