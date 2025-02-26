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
      >
        <motion.div
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl text-center transform transition-all duration-300 ease-in-out animate-fadeIn"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center mb-4 animate-bounce">
            <FaCheckCircle className="w-20 h-20 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Success!
          </h3>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            {message}
          </p>
        </motion.div>
      </motion.div>
    </LazyMotion>
  );
};

export default SuccessModal;
