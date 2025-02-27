import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBook,
  FaUsers,
  FaArrowRight,
  FaArrowLeft,
  FaUserPlus,
  FaChartBar,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import AddBook from "../books/AddBook";
import { BookContext, UserContext } from "./Layout";

const Footer = () => {
  const navigate = useNavigate();
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const { handleBookAdded: handleBookAddedContext } = useContext(BookContext);
  const { handleAddUser } = useContext(UserContext);
  const { t } = useTranslation();

  const handleClick = () => {
    navigate("/book");
  };

  const handleUser = () => {
    navigate("/users");
  };
  const handleHome = () => {
    navigate("/home");
  };

  const handleBookAdded = (book) => {
    handleBookAddedContext(book);
    setShowAddBookModal(false);
  };

  const ButtonIcon = ({ icon: Icon, size }) => (
    <div className="p-1 bg-white/15 rounded-md group-hover:bg-white/25 transition-colors duration-200">
      <Icon className={size} />
    </div>
  );

  return (
    <>
      <footer
        className="fixed bottom-0 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-gray-800 dark:to-gray-900
          border-t border-slate-200/80 dark:border-gray-700/80
          backdrop-blur-sm bg-opacity-80
          p-2 min-[768px]:p-2.5 min-[1024px]:p-3 min-[1200px]:p-4 z-[10] 
          hidden min-[640px]:block 
          w-full min-[640px]:w-[calc(100%-224.2px)] md:w-[calc(100%-224.2px)] 
          left-auto overflow-x-auto border-l border-slate-200 dark:border-gray-700
          shadow-lg shadow-slate-200/20 dark:shadow-none"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4">
          {/* Left Section - Statistics */}
          <div className="flex items-center gap-6">
            <button
              className="group flex items-center gap-2
                bg-gradient-to-br from-violet-500 to-indigo-600 
                text-white font-medium py-2 px-4
                rounded-lg shadow-md shadow-indigo-500/20
                hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 
                active:translate-y-0 focus:outline-none focus:ring-2 
                focus:ring-indigo-500/50 focus:ring-offset-1 
                transition-all duration-200"
              onClick={handleHome}
            >
              <ButtonIcon
                icon={FaChartBar}
                size="w-4 h-4 min-[1024px]:w-4 min-[1024px]:h-4"
              />
              <span className="text-sm font-semibold">
                {t("dashboard.statistics")}
              </span>
            </button>

            {/* Transaction Direction Legend */}
            <div className="hidden lg:flex gap-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-md">
                  <FaArrowRight className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                </div>
                <span className="font-medium">
                  {t("transactions.youInitiated")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                  <FaArrowLeft className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium">
                  {t("transactions.initiatedByOthers")}
                </span>
              </div>
            </div>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddBookModal(true)}
              className="group flex items-center gap-2
                bg-gradient-to-r from-blue-500 to-cyan-500 
                text-white font-medium py-2 px-4
                rounded-lg shadow-md shadow-blue-500/20
                hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 
                active:translate-y-0 focus:outline-none focus:ring-2 
                focus:ring-blue-500/50 focus:ring-offset-1 
                transition-all duration-200"
            >
              <ButtonIcon
                icon={FaBook}
                size="w-4 h-4 min-[1024px]:w-4 min-[1024px]:h-4"
              />
              <span className="text-sm font-semibold">
                {t("books.addBook")}
              </span>
            </button>

            <button
              className="group flex items-center gap-2
                bg-gradient-to-r from-blue-500 to-cyan-500 
                text-white font-medium py-2 px-4
                rounded-lg shadow-md shadow-blue-500/20
                hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 
                active:translate-y-0 focus:outline-none focus:ring-2 
                focus:ring-blue-500/50 focus:ring-offset-1 
                transition-all duration-200"
              onClick={handleClick}
            >
              <ButtonIcon
                icon={FaBook}
                size="w-4 h-4 min-[1024px]:w-4 min-[1024px]:h-4"
              />
              <span className="text-sm font-semibold">
                {t("navigation.books")}
              </span>
            </button>

            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

            <button
              className="group flex items-center gap-2
                bg-gradient-to-r from-blue-500 to-cyan-500 
                text-white font-medium py-2 px-4
                rounded-lg shadow-md shadow-blue-500/20
                hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 
                active:translate-y-0 focus:outline-none focus:ring-2 
                focus:ring-blue-500/50 focus:ring-offset-1 
                transition-all duration-200"
              onClick={handleUser}
            >
              <ButtonIcon
                icon={FaUsers}
                size="w-4 h-4 min-[1024px]:w-4 min-[1024px]:h-4"
              />
              <span className="text-sm font-semibold">
                {t("navigation.users")}
              </span>
            </button>

            <button
              className="group flex items-center gap-2
                bg-gradient-to-r from-blue-500 to-cyan-500 
                text-white font-medium py-2 px-4
                rounded-lg shadow-md shadow-blue-500/20
                hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 
                active:translate-y-0 focus:outline-none focus:ring-2 
                focus:ring-blue-500/50 focus:ring-offset-1 
                transition-all duration-200"
              onClick={handleAddUser}
            >
              <ButtonIcon
                icon={FaUserPlus}
                size="w-4 h-4 min-[1024px]:w-4 min-[1024px]:h-4"
              />
              <span className="text-sm font-semibold">
                {t("common.add")} {t("navigation.users")}
              </span>
            </button>
          </div>
        </div>
      </footer>

      {showAddBookModal && (
        <AddBook
          onBookAdded={handleBookAdded}
          onClose={() => setShowAddBookModal(false)}
        />
      )}
    </>
  );
};

export default Footer;
