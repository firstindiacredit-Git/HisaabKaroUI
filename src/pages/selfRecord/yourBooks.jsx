import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const YourBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookName, setBookName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/api/v2/transactionBooks/getAll-books`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (Array.isArray(response.data.books)) {
          setBooks(response.data.books);
        }
      } catch (err) {
        setError("Failed to fetch books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const openAddModal = () => {
    setBookName("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setBookName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${process.env.REACT_APP_URL}/api/v2/transactionBooks/create-books`,
        { bookname: bookName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh the books list
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/api/v2/transactionBooks/getAll-books`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (Array.isArray(response.data.books)) {
        setBooks(response.data.books);
      }

      closeModal();
    } catch (err) {
      setError("Failed to create book. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-900 dark:text-white p-6">
      <div className=" mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Your Books
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Track your financial records
            </p>
          </div>
          <div
            onClick={openAddModal}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex items-center gap-2 hover:-translate-y-0.5"
          >
            <FaPlus size={16} />
            <span className="font-medium">New Book</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book, index) => {
            const gradients = [
              "bg-gradient-to-r from-blue-500/10 to-blue-600/10",
              "bg-gradient-to-r from-purple-500/10 to-purple-600/10",
              "bg-gradient-to-r from-green-500/10 to-green-600/10",
              "bg-gradient-to-r from-red-500/10 to-red-600/10",
              "bg-gradient-to-r from-yellow-500/10 to-yellow-600/10",
              "bg-gradient-to-r from-pink-500/10 to-pink-600/10",
              "bg-gradient-to-r from-indigo-500/10 to-indigo-600/10",
              "bg-gradient-to-r from-orange-500/10 to-orange-600/10",
              "bg-gradient-to-r from-teal-500/10 to-teal-600/10",
              "bg-gradient-to-r from-cyan-500/10 to-cyan-600/10",
            ][index % 10];

            const iconColors = [
              "text-blue-600 bg-blue-100",
              "text-purple-600 bg-purple-100",
              "text-green-600 bg-green-100",
              "text-red-600 bg-red-100",
              "text-yellow-600 bg-yellow-100",
              "text-pink-600 bg-pink-100",
              "text-indigo-600 bg-indigo-100",
              "text-orange-600 bg-orange-100",
              "text-teal-600 bg-teal-100",
              "text-cyan-600 bg-cyan-100",
            ][index % 10];

            const textColors = [
              "text-blue-700",
              "text-purple-700",
              "text-green-700",
              "text-red-700",
              "text-yellow-700",
              "text-pink-700",
              "text-indigo-700",
              "text-orange-700",
              "text-teal-700",
              "text-cyan-700",
            ][index % 10];

            return (
              <div
                key={book._id}
                onClick={() => navigate(`/your-books/${book._id}`)}
                className={`${gradients} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group relative backdrop-blur-sm`}
              >
                <div className="absolute inset-0 bg-white/40 dark:bg-gray-800/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                <div className="relative space-y-4">
                  <div
                    className={`w-12 h-12 ${iconColors} rounded-xl flex items-center justify-center font-bold text-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}
                  >
                    {book.bookname.charAt(0).toUpperCase()}
                  </div>

                  <div className="space-y-2">
                    <h2
                      className={`text-xl font-semibold ${textColors} group-hover:translate-x-1 transition-transform duration-300`}
                    >
                      {book.bookname}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Click to view transactions
                    </p>
                  </div>

                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg
                      className={`w-5 h-5 ${textColors}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div
              className="bg-white dark:bg-gray-700 dark:border-none rounded-xl p-8 w-full max-w-md mx-4 shadow-xl border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl dark:text-white font-bold text-gray-900 mb-2">
                Create New Book
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Enter a name for your new book
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="bookName"
                    className="block text-sm dark:text-gray-500 font-medium text-gray-700 mb-2"
                  >
                    Book Name
                  </label>
                  <input
                    id="bookName"
                    type="text"
                    value={bookName}
                    onChange={(e) => setBookName(e.target.value)}
                    placeholder="Enter book name"
                    className="w-full p-3 dark:bg-gray-400 dark:text-white dark:border-none bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 border dark:text-white border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:dark:bg-gray-800 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-md transition-all duration-200 font-medium hover:-translate-y-0.5"
                  >
                    Create Book
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YourBooks;
