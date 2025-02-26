import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import Modal from "./Modal";
import { fetchClients, fetchBooks, createTransaction } from "./api";
import { trackTransaction, trackError } from "../../../utils/analytics";
import { ClientRefreshContext } from "../../Layout/Layout";

const AddTransactions = () => {
  const [clientUserId, setClientUserId] = useState("");
  const [bookId, setBookId] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null); // State to store the file
  const navigate = useNavigate();
  const { refreshClientTrigger } = useContext(ClientRefreshContext);

  const [clients, setClients] = useState([]);
  const [books, setBooks] = useState([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);

  const loadClients = async () => {
    try {
      setIsLoadingClients(true);
      const clientsData = await fetchClients();
      setClients(clientsData);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setIsLoadingClients(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, [refreshClientTrigger]);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const booksData = await fetchBooks();
        setBooks(booksData);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setIsLoadingBooks(false);
      }
    };

    const handleBookAdded = (event) => {
      setBooks((prevBooks) => [...prevBooks, event.detail]);
    };

    window.addEventListener("bookAdded", handleBookAdded);
    loadBooks();

    return () => {
      window.removeEventListener("bookAdded", handleBookAdded);
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      setShowFailureModal(true);
      trackError({ message: "Invalid amount entered" });
      return;
    }

    const transactionData = {
      clientUserId,
      bookId,
      transactionType,
      amount: parsedAmount,
      description,
    };

    try {
      await createTransaction(transactionData, file);
      trackTransaction(transactionData);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error creating transaction:", error);
      trackError(error);
      setShowFailureModal(true);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate("/dashboard");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; // Get the selected file
    if (selectedFile) {
      setFile(selectedFile); // Store it in the state
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setAmount(value);
    }
  };

  const Goback = () => {
    navigate(-1);
  };

  return (
    <LazyMotion features={domAnimation}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen dark:bg-gray-900 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 dark:text-white shadow-xl rounded-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold dark:text-white text-gray-900">
                Add Transaction
              </h1>
              <button
                type="button"
                onClick={Goback}
                className="inline-flex dark:text-white items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                ← Go Back
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="clientUserId"
                    className="block text-sm font-medium dark:text-white text-gray-700"
                  >
                    Client
                  </label>
                  <div className="relative">
                    <select
                      id="clientUserId"
                      value={clientUserId}
                      onChange={(e) => setClientUserId(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-gray-500 dark:text-white bg-white dark:bg-gray-700 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm appearance-none"
                      required
                    >
                      <option value="">Select Client</option>
                      {isLoadingClients ? (
                        <option>Loading clients...</option>
                      ) : clients.length === 0 ? (
                        <option>No clients available</option>
                      ) : (
                        clients.map((client) => (
                          <option key={client._id} value={client._id}>
                            {client.name}
                          </option>
                        ))
                      )}
                    </select>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="bookId"
                    className="block text-sm font-medium dark:text-white text-gray-700"
                  >
                    Book
                  </label>
                  <div className="relative">
                    <select
                      id="bookId"
                      value={bookId}
                      onChange={(e) => setBookId(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-gray-500 dark:text-white text-base bg-white dark:bg-gray-700 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm appearance-none"
                      required
                    >
                      <option value="">Select Book</option>
                      {isLoadingBooks ? (
                        <option>Loading books...</option>
                      ) : books.length === 0 ? (
                        <option>No books available</option>
                      ) : (
                        books.map((book) => (
                          <option key={book._id} value={book._id}>
                            {book.bookname}
                          </option>
                        ))
                      )}
                    </select>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="transactionType"
                    className="block text-sm font-medium dark:text-white text-gray-700"
                  >
                    Transaction Type
                  </label>
                  <select
                    id="transactionType"
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-gray-500 dark:text-white text-base bg-white dark:bg-gray-700 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                    required
                  >
                    <option value="">Select Transaction Type</option>
                    <option value="you will get" className="text-green-600">
                      You will get
                    </option>
                    <option value="you will give" className="text-red-600">
                      You will give
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium dark:text-white text-gray-700"
                  >
                    Amount
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={handleAmountChange}
                      onKeyDown={(e) => {
                        if (
                          e.key === "e" ||
                          e.key === "E" ||
                          e.key === "+" ||
                          e.key === "-"
                        ) {
                          e.preventDefault();
                        }
                      }}
                      className="focus:ring-indigo-500 bg-white dark:bg-gray-700 focus:border-indigo-500 block w-full pl-2 pr-1 py-1 text-lg border-gray-300 rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium dark:text-white text-gray-700"
                  >
                    Description{" "}
                    <span className="text-gray-400 text-xs">(optional)</span>
                  </label>
                </div>
                <div className="mt-1">
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="shadow-sm p-2 focus:ring-indigo-500 dark:border-none bg-white dark:bg-gray-700 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="Enter additional details about the transaction..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium dark:text-white text-gray-700">
                    Upload File{" "}
                    <span className="text-gray-400 text-xs">(optional)</span>
                  </label>
                </div>
                <div className="mt-1 flex justify-center px-6 pt-5  dark:bg-gray-700  pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-500 transition-colors duration-200 bg-gray-50">
                  <div className="space-y-2 text-center">
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
                    <div className="flex flex-col items-center text-sm text-gray-600">
                      <label
                        htmlFor="file"
                        className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Click to upload a file</span>
                        <input
                          id="file"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        PNG, JPG, PDF up to 5MB
                      </p>
                      {file && (
                        <p className="text-sm text-indigo-600 mt-2">
                          Selected: {file.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="inline-flex justify-center py-2 dark:text-white px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Create Transaction
                </motion.button>
              </div>
            </form>
          </div>
        </div>

        {showSuccessModal && (
          <Modal
            isOpen={showSuccessModal}
            onClose={handleSuccessModalClose}
            type="success"
            title="Success"
            message="Transaction added successfully!"
          />
        )}

        {showFailureModal && (
          <Modal
            type="failure"
            message="Failed to create transaction. Please try again."
            onClose={() => setShowFailureModal(false)}
          />
        )}
      </motion.div>
    </LazyMotion>
  );
};

export default AddTransactions;
