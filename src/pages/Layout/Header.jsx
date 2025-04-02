import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";
import {
  FaCog,
  FaBell,
  FaUserCog,
  FaSignOutAlt,
  FaSun,
  FaMoon,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import SearchTools from "../../Tools/SearchTools";
import Notification from "./notification";
import { Link } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { profileData } = useProfile();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize from localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const profileMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const { t } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef(null);

  // Apply theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Handle clicks outside of menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setShowProfileMenu(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const firstLetter = profileData?.name?.charAt(0).toUpperCase() || "U";

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setIsSearchFocused(false);
  };

  const handleSettingsClick = () => {
    navigate("/Setting");
  };

  return (
    <header className="fixed top-0 right-0 w-full md:w-[calc(100%-224.2px)] bg-white/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 z-[10]">
      <div className="px-2 md:px-6 py-[0.45rem] bg-[#f3f7fa] dark:bg-gray-800 shadow-sm">
        <div className="flex items-center justify-end">
          {/* Logo or Brand - Left side */}

          {/* Search Section - Hidden by default on mobile */}
          <div
            className={`
            fixed md:relative 
            inset-0 
            bg-[#f3f7fa]  md:bg-transparent
            z-50 md:z-auto
            ${
              isSearchOpen ? "translate-x-0" : "translate-x-full"
            } md:translate-x-0
            transition-transform duration-300 ease-in-out
            md:transition-none
            md:w-full md:max-w-xl lg:max-w-2xl
            md:mx-4
          `}
          >
            <div
              className="
              flex items-center 
              w-full 
              h-full md:h-auto
              px-4 md:px-0
            "
            >
              {/* Back button - Only on mobile */}
              <button
                onClick={handleSearchClose}
                className="mr-3 p-2 text-gray-500 hover:text-gray-700 md:hidden"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Search Input */}
              <div className="relative flex-1">
                <SearchTools
                  ref={searchInputRef}
                  placeholder="Search..."
                  className={`
                    w-full 
                    pl-4 pr-8
                    text-base
                    h-11
                    bg-white
                    dark:text-white
                    rounded-xl
                    border border-transparent
                    focus:border-blue-400
                    focus:ring-1 focus:ring-blue-400
                    shadow-sm
                    dark:placeholder-gray-400
                  `}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />

                {/* Mobile search suggestions */}
                {isSearchFocused && (
                  <div
                    className="
                    absolute top-full left-0 right-0 
                    mt-2
                    bg-white 
                    border-gray-100 dark:border-gray-700
                    rounded-xl 
                    max-h-[calc(100vh-180px)] 
                    overflow-y-auto 
                    md:hidden
                    z-50
                  "
                  >
                    <div className="p-2">
                      <div className="text-xs font-medium text-gray-500 px-3 py-2">
                        Recent Searches
                      </div>
                      <button className="w-full text-left px-3 py-2.5 hover:bg-gray-50 text-sm">
                        Recent search 1
                      </button>
                      <button className="w-full text-left px-3 py-2.5 hover:bg-gray-50 text-sm">
                        Recent search 2
                      </button>

                      <div className="text-xs font-medium text-gray-500 px-3 py-2 mt-2">
                        Suggestions
                      </div>
                      <button className="w-full text-left px-3 py-2.5 hover:bg-gray-50 text-sm">
                        Suggested search 1
                      </button>
                      <button className="w-full text-left px-3 py-2.5 hover:bg-gray-50 text-sm">
                        Suggested search 2
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Mobile Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 rounded-xl"
            >
              <FaSearch className="text-xl" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="hidden md:block p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition-colors duration-200"
              title={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              {isDarkMode ? (
                <FaSun className="text-xl" />
              ) : (
                <FaMoon className="text-xl" />
              )}
            </button>

            {/* Settings - Hidden on mobile */}
            <button
              onClick={handleSettingsClick}
              className="hidden md:block p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300  dark:hover:bg-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              title={t("common.setting")}
            >
              <FaCog className="text-xl" />
            </button>

            {/* Notifications - Both mobile and desktop */}
            <div className="flex ">
              {/* Mobile Notification */}
              <div className="md:hidden">
                <Notification isMobile={true} />
              </div>
              {/* Desktop Notification */}
              <div className="hidden md:block ">
                <Notification isMobile={false} />
              </div>
            </div>

            {/* Profile Section */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex dark:hover:text-gray-300  dark:hover:bg-gray-600 items-center gap-1 md:gap-3 pl-1 md:pl-4 hover:bg-gray-50 rounded-xl transition-all duration-200 p-1 md:p-2"
              >
                {profileData?.profilePicture ? (
                  <img
                    src={profileData.profilePicture}
                    alt={profileData.name}
                    className="w-8 h-8 md:w-11 md:h-11 rounded-xl object-cover ring-2 ring-white shadow-md hover:ring-blue-400 transition-all duration-200"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/150?text=No+Image";
                    }}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 md:w-11 md:h-11 rounded-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm md:text-base font-bold ring-2 ring-white shadow-md hover:ring-blue-400 transition-all duration-200">
                    {firstLetter}
                  </div>
                )}
              </button>

              {/* Profile Dropdown - Improved mobile layout */}
              {showProfileMenu && (
                <div className="fixed md:absolute left-0 md:left-auto right-0 md:right-0 top-[3.7rem] md:top-full mt-0 md:mt-1 w-full md:w-72 bg-white dark:bg-gray-800 rounded-none md:rounded-xl shadow-lg border-t md:border border-gray-100 dark:border-gray-700">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {profileData?.name || t("common.user")}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {profileData?.email || ""}
                    </p>
                  </div>

                  <div className="py-2">
                    {/* Dark Mode Toggle - Visible only on mobile */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleDarkMode();
                        setShowProfileMenu(false);
                      }}
                      className="md:hidden w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3"
                    >
                      {isDarkMode ? (
                        <FaSun className="text-gray-400" />
                      ) : (
                        <FaMoon className="text-gray-400" />
                      )}
                      <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                    </button>

                    {/* Settings - Visible only on mobile */}
                    <button className="md:hidden w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3">
                      <FaCog className="text-gray-400 dark:text-gray-500" />
                      <span>{t("common.settings")}</span>
                    </button>

                    <button
                      onClick={handleProfileClick}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3"
                    >
                      <FaUserCog className="text-gray-400 dark:text-gray-500" />
                      <span>{t("common.profile")}</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3"
                    >
                      <FaSignOutAlt className="text-red-500" />
                      <span>{t("common.logout")}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile search */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={handleSearchClose}
        />
      )}
    </header>
  );
}
