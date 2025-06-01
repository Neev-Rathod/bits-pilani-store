import React, { useState, useRef, useEffect } from "react";
import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaUserCircle,
  FaList,
  FaComments,
  FaInfoCircle,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaHome,
  FaCheck,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { IoAdd } from "react-icons/io5";
import { BiSolidCategory } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

function Navbar({
  darktheme,
  setDarktheme,
  searchVal,
  setSearchVal,
  user,
  onLogout,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showCampuses, setShowCampuses] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState("Pilani");
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const campusDropdownRef = useRef(null);

  const campuses = ["Pilani", "Goa", "Dubai", "Hyderabad", "All Campuses"];
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (
        campusDropdownRef.current &&
        !campusDropdownRef.current.contains(event.target)
      ) {
        setShowCampuses(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus input when search expands
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handleToggleDarkTheme = () => {
    if (darktheme === "light") {
      setDarktheme("dark");
    } else {
      setDarktheme("light");
    }
  };

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const toggleCampusDropdown = () => {
    setShowCampuses(!showCampuses);
  };

  const selectCampus = (campus) => {
    setSelectedCampus(campus);
    setShowCampuses(false);
  };

  return (
    <motion.div
      className={`w-full sticky shadow-lg top-0 z-50 ${
        isScrolled
          ? "h-12 backdrop-blur-md bg-white/90 dark:bg-gray-800/90"
          : "h-16 bg-white dark:bg-gray-800"
      } flex items-center px-4 justify-between transition-all duration-300 ease-in-out`}
    >
      {/* Logo with animation - hidden when search is expanded on mobile */}
      {!showSearch && (
        <motion.h1
          className="text-xl sm:text-2xl lg:text-3xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
            Bits Pawnshop
          </span>
        </motion.h1>
      )}

      {/* Search Bar - Expanded View with animation */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            className="absolute left-0 right-0 top-0 bottom-0 bg-white dark:bg-gray-800 z-10 px-4 flex items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center w-full rounded-full overflow-hidden shadow-md dark:shadow-gray-700">
              <motion.div
                className="pl-4 py-2 bg-gray-50 dark:bg-gray-700 flex-1 flex items-center"
                initial={{ width: "90%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              >
                <FaSearch className="text-gray-500 dark:text-gray-300" />
                <input
                  ref={searchInputRef}
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  type="text"
                  className="flex-1 outline-0 border-0 bg-gray-50 dark:bg-gray-700 dark:text-white px-3 py-1"
                  placeholder="Search for items, categories, etc..."
                />
                <motion.button
                  onClick={toggleSearch}
                  className="px-3 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IoMdClose className="text-gray-500 dark:text-white text-xl" />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right side controls - hidden when search is expanded on mobile */}
      {!showSearch && (
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Desktop Search in middle position */}
          <div className="hidden md:flex items-center rounded-full bg-gray-50 dark:bg-gray-700 shadow-sm overflow-hidden transition-all duration-300 border border-gray-100 dark:border-gray-600">
            <div className="pl-3">
              <FaSearch className="text-gray-500 dark:text-white" />
            </div>
            <input
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              type="text"
              className="outline-0 border-0 bg-gray-50 dark:bg-gray-700 dark:text-white px-3 py-2 transition-colors duration-300 md:w-64 lg:w-44 xl:w-70 2xl:w-84"
              placeholder="Search for items..."
            />
          </div>

          {/* Mobile Search Button */}
          <motion.button
            className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleSearch}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaSearch className="text-gray-800 dark:text-white" />
          </motion.button>

          {/* Campus Selector with animations */}
          <div className="relative" ref={campusDropdownRef}>
            {/* Desktop View - Button with text */}
            <motion.button
              onClick={toggleCampusDropdown}
              className="hidden md:flex items-center px-3 py-2 rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-300 border border-gray-200 dark:border-gray-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaHome className="mr-2 text-blue-500 dark:text-blue-400" />
              <span className="text-gray-800 dark:text-white font-medium">
                {selectedCampus}
              </span>
              <motion.div
                animate={{ rotate: showCampuses ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="ml-2"
              >
                <IoIosArrowDown className="text-gray-500 dark:text-gray-300" />
              </motion.div>
            </motion.button>

            {/* Mobile View - Just Icon */}
            <motion.button
              onClick={toggleCampusDropdown}
              className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaHome className="text-blue-500 dark:text-blue-400" />
            </motion.button>

            {/* Dropdown Menu with animation */}
            <AnimatePresence>
              {showCampuses && (
                <motion.div
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-20 border border-gray-100 dark:border-gray-700 overflow-hidden"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <ul className="py-1">
                    {campuses.map((campus, index) => (
                      <motion.li
                        key={campus}
                        onClick={() => selectCampus(campus)}
                        className={`px-4 py-2 flex items-center justify-between cursor-pointer ${
                          selectedCampus === campus
                            ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 5 }}
                      >
                        <span>{campus}</span>
                        {selectedCampus === campus && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            <FaCheck className="text-blue-500" />
                          </motion.div>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sell Item Button */}
          <motion.div
            className="hidden lg:flex items-center cursor-pointer text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-4 py-2 rounded-full shadow-md"
            onClick={() => navigate("/add")}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <IoAdd className="mr-2" />
            <p>Sell Item</p>
          </motion.div>

          {/* Categories Button */}
          <motion.div
            className="hidden lg:flex items-center cursor-pointer dark:text-white bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-600"
            onClick={() => navigate("/categories")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BiSolidCategory className="mr-2 text-purple-500 dark:text-purple-400" />
            <p className="text-gray-800 dark:text-white">Categories</p>
          </motion.div>

          {/* Theme Toggle Button with animation */}
          <motion.button
            onClick={handleToggleDarkTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {darktheme === "dark" ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <FaSun className="text-yellow-400 text-xl" size={22} />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <FaMoon className="text-gray-700 text-xl" size={22} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Profile Icon with Dropdown and animations */}
          <div className="relative cursor-pointer" ref={dropdownRef}>
            <motion.button
              onClick={handleProfileClick}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaUserCircle
                className="text-gray-800 dark:text-white text-2xl"
                size={30}
              />
            </motion.button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-20 border border-gray-100 dark:border-gray-700 overflow-hidden"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <ul className="py-1">
                    {/* <motion.li 
                                            className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center cursor-pointer border-b dark:border-gray-700"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.05 }}
                                            whileHover={{ x: 5, backgroundColor: darktheme === 'dark' ? '#374151' : '#f9fafb' }}
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-medium dark:text-white">John Doe</span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">john.doe@gmail.com</span>
                                            </div>
                                        </motion.li> */}
                    <motion.li
                      className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      onClick={() => navigate("/mylistings")}
                    >
                      <FaList className="mr-3 text-blue-500 dark:text-blue-400" />
                      <span className="dark:text-white">My Listings</span>
                    </motion.li>
                    <motion.li
                      className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                      onClick={() => navigate("/feedback")}
                    >
                      <FaComments className="mr-3 text-green-500 dark:text-green-400" />
                      <span className="dark:text-white">Feedback</span>
                    </motion.li>
                    <motion.li
                      className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      onClick={() => navigate("/aboutus")}
                    >
                      <FaInfoCircle className="mr-3 text-purple-500 dark:text-purple-400" />
                      <span className="dark:text-white">About Us</span>
                    </motion.li>
                    <motion.li
                      className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center text-red-500 cursor-pointer border-t dark:border-gray-700 mt-1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                      onClick={onLogout}
                    >
                      <FaSignOutAlt className="mr-3" />
                      <span>Logout</span>
                    </motion.li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default memo(Navbar);
