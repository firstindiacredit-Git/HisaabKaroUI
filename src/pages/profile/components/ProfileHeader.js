import React from "react";
import { motion } from "framer-motion";

const ProfileHeader = ({ title, subtitle }) => {
  return (
    <div className="text-center dark:bg-transparent mb-10 space-y-2">
      <motion.div
        className="inline-block relative"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent relative">
          {title}
        </h2>
      </motion.div>
      <p className="text-gray-500 dark:text-white">{subtitle}</p>
    </div>
  );
};

export default ProfileHeader;
