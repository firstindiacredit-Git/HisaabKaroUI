import React from "react";
import { motion, LazyMotion, domAnimation } from "framer-motion";

const ErrorModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <LazyMotion features={domAnimation}>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-gray-900/80 backdrop-blur-sm z-[60]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 dark:text-gray-200 p-6 rounded-md shadow-lg text-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-red-400 to-pink-500 dark:from-red-500 dark:to-pink-600 flex items-center justify-center"
            >
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </motion.svg>
            </motion.div>
          </div>
          <p className="mb-4 text-lg font-semibold">{message}</p>
          <button
            onClick={onClose}
            className="bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </LazyMotion>
  );
};

export default ErrorModal;
