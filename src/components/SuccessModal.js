import React, { useEffect } from "react";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

const SuccessModal = ({ isOpen, message, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <LazyMotion features={domAnimation}>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-80 backdrop-blur-sm z-[60]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl text-center transform transition-all duration-300 ease-in-out animate-fadeIn max-w-sm w-full mx-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 dark:bg-green-900 rounded-full p-2">
              <FaCheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{message}</h3>
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors"
            >
              OK
            </button>
          </div>
        </motion.div>
      </motion.div>
    </LazyMotion>
  );
};

export default SuccessModal;