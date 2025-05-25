import React, { useState, useEffect, useRef, useContext, memo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiPhone,
  FiTag,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import {
  FiMonitor,
  FiCoffee,
  FiBook,
  FiActivity,
  FiImage,
  FiUsers,
  FiSmartphone,
  FiMoreVertical,
  FiFilter,
} from "react-icons/fi";
import { FaGuitar, FaBed } from "react-icons/fa";
import { BiHome, BiSolidCategory } from "react-icons/bi";
import { FaSort } from "react-icons/fa";
import { HeightContext } from "../contexts/HeightContext";
import { ItemsContext } from "../contexts/ItemsContext";
import { useNavigate } from "react-router-dom";
const categoryIcons = {
  "All Categories": <BiSolidCategory />,
  "Electronics & Gadgets": <FiMonitor />,
  "Kitchen & Cooking": <FiCoffee />,
  "Books & Study Materials": <FiBook />,
  "Sports & Fitness Gear": <FiActivity />,
  "Musical Instruments": <FaGuitar />,
  "Dorm & Bedroom Essentials": <FaBed />,
  "Room Decor": <FiImage />,
  "Community & Shared Resources": <FiUsers />,
  "Digital Subscriptions & Accounts": <FiSmartphone />,
  Others: <FiMoreVertical />,
};

const categories = [
  "All Categories",
  "Electronics & Gadgets",
  "Kitchen & Cooking",
  "Books & Study Materials",
  "Sports & Fitness Gear",
  "Musical Instruments",
  "Dorm & Bedroom Essentials",
  "Room Decor",
  "Community & Shared Resources",
  "Digital Subscriptions & Accounts",
  "Others",
];

const ITEMS_PER_PAGE = 15;

const Home = ({ searchVal = "", selectedCategory, setSelectedCategory }) => {
  // const [items, setItems] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState("newest");
  const [categoryScrollRef, setCategoryScrollRef] = useState(null);
  // const [categoryCount, setCategoryCount] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pageInputValue, setPageInputValue] = useState("");
  const mainContainerRef = useRef(null);
  const { height } = useContext(HeightContext);
  const { items, loading, error, categoryCount } = useContext(ItemsContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    let result = [...items];

    // Filter by search term
    if (searchVal && searchVal.trim() !== "") {
      const searchTerm = searchVal.toLowerCase();
      result = result.filter(
        (item) =>
          item.itemName.toLowerCase().includes(searchTerm) ||
          item.category.toLowerCase().includes(searchTerm) ||
          item.sellerName.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by category
    if (selectedCategory !== "All Categories") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Sort items
    if (sortType === "newest") {
      result.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    } else if (sortType === "priceAsc") {
      result.sort((a, b) => a.itemPrice - b.itemPrice);
    } else if (sortType === "priceDesc") {
      result.sort((a, b) => b.itemPrice - a.itemPrice);
    }

    setFilteredItems(result);
    setCurrentPage(1); // Reset to first page after filtering
    setPageInputValue(""); // Reset the page input value
  }, [items, searchVal, selectedCategory, sortType, loading]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  // Get current items
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Scroll to top when page changes
  useEffect(() => {
    if (mainContainerRef.current) {
      mainContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    setPageInputValue(""); // Clear input after page change
  }, [currentPage]);

  // Change page
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle page input
  const handlePageInputChange = (e) => {
    setPageInputValue(e.target.value);
  };

  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(pageInputValue);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      paginate(pageNumber);
    }
  };

  // Format date for display - shorter format for compactness
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Container variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Faster stagger for more items
      },
    },
  };

  // Item variants for animation
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const getCategoryCount = (category) => {
    return categoryCount[category] || 0;
  };

  // Function to generate optimized image URL with lower quality for thumbnails
  const getOptimizedImageUrl = (imageUrl) => {
    // Check if the URL is from a service that supports optimization params
    if (imageUrl && imageUrl.includes("amazoff.shop")) {
      // Append quality and size parameters if the image service supports it
      return `${imageUrl}?quality=60&width=300`;
    }
    return imageUrl;
  };

  return (
    <div
      className="overflow-auto bg-gray-50 dark:bg-gray-900"
      style={{ height }}
      ref={mainContainerRef}
    >
      <div className="p-2 sm:p-4 ">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white"
          >
            Campus Marketplace
          </motion.h1>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
          >
            <FiFilter size={16} />
            <span>Filters</span>
          </motion.button>
        </div>

        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              className="fixed inset-0 z-50 bg-black bg-opacity-50"
              onClick={() => setIsFilterOpen(false)}
            >
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className="absolute top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 p-4 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-gray-800 dark:text-white">
                    Filters
                  </h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-gray-500 dark:text-gray-400"
                  >
                    ✕
                  </button>
                </div>

                <h3 className="font-medium text-gray-800 dark:text-white mb-2">
                  Categories
                </h3>
                <div className="space-y-1 mb-4">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsFilterOpen(false);
                      }}
                      className={`flex justify-between items-center w-full p-2 rounded-lg transition-colors text-left ${
                        selectedCategory === category
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-blue-500">
                          {categoryIcons[category]}
                        </span>
                        <span className="text-sm">{category}</span>
                      </div>
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
                        {getCategoryCount(category)}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories scroll */}
        <div className="mb-3 overflow-x-auto no-scrollbar">
          <div
            className="flex space-x-2 overflow-auto w-full pb-2 "
            ref={setCategoryScrollRef}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex gap-2 items-center justify-center p-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:dark:bg-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="text-lg ">{categoryIcons[category]}</div>
                <div className="flex items-center">
                  <span className="text-xs whitespace-nowrap mr-2">
                    {category}
                  </span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full transition-colors ${
                      selectedCategory === category
                        ? "bg-blue-700 dark:bg-blue-700"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    {getCategoryCount(category)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sort and results info */}
        <div className="flex justify-between items-center mb-3">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {filteredItems.length} items
          </div>

          <div className="relative">
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="pl-6 pr-4 py-1 text-xs bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="priceAsc">Price: Low-High</option>
              <option value="priceDesc">Price: High-Low</option>
            </select>
            <FaSort className="absolute left-2 top-2 text-gray-500 dark:text-gray-400 text-xs" />
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="text-5xl mb-2">⚠️</div>
            <p className="text-lg text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Items grid - more compact layout with lazy loading images */}
        {!loading && !error && currentItems.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3"
          >
            {currentItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 flex flex-col"
                onClick={() => navigate(`/item/${item.id}`)}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={getOptimizedImageUrl(item.itemImage)}
                    alt={item.itemName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/300x400?text=Image+Not+Available";
                    }}
                  />
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-xs font-medium shadow-md rounded-bl-lg">
                    ₹{item.itemPrice}
                  </div>
                </div>
                <div className="p-2 flex-grow">
                  <h3 className="text-sm font-medium mb-1 text-gray-800 dark:text-white line-clamp-1">
                    {item.itemName}
                  </h3>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <FiUser className="text-blue-500 shrink-0" size={12} />
                      <span className="truncate">{item.sellerName}</span>
                    </div>

                    <div className="flex justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                        <FiCalendar
                          className="text-blue-500 shrink-0"
                          size={12}
                        />
                        <span>{formatDate(item.dateAdded)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                        <BiHome className="text-blue-500 shrink-0" size={12} />
                        <span>{item.sellerHostel}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs">
                      <FiTag className="text-blue-500 shrink-0" size={12} />
                      <span className="text-gray-600 dark:text-gray-400 truncate">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <FiPhone size={12} /> Contact
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : !loading && !error && currentItems.length === 0 ? (
          <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="text-5xl mb-2">🔍</div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No items found
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Try changing your filters or search term
            </p>
          </div>
        ) : null}

        {/* Enhanced Pagination with page input */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center mt-4 mb-3">
            <nav className="flex items-center space-x-1">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-md bg-gray-200 dark:bg-gray-700 dark:text-white disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <FiChevronLeft size={24} />
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages).keys()].map((number) => {
                  // Show limited page numbers
                  if (
                    number + 1 === 1 ||
                    number + 1 === totalPages ||
                    (number + 1 >= currentPage - 1 &&
                      number + 1 <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={number + 1}
                        onClick={() => paginate(number + 1)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md text-lg ${
                          currentPage === number + 1
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                        } transition-colors`}
                      >
                        {number + 1}
                      </button>
                    );
                  } else if (
                    (number + 1 === currentPage - 2 && currentPage > 3) ||
                    (number + 1 === currentPage + 2 &&
                      currentPage < totalPages - 2)
                  ) {
                    return (
                      <span
                        key={`ellipsis-${number}`}
                        className="text-xs dark:text-gray-200"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Page input field */}
              <form
                onSubmit={handlePageInputSubmit}
                className="flex items-center ml-1"
              >
                <input
                  type="text"
                  value={pageInputValue}
                  onChange={handlePageInputChange}
                  placeholder={`1-${totalPages}`}
                  className="w-12 h-8 px-1 text-center text-sm bg-white dark:bg-gray-800 dark:text-gray-200  border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  aria-label="Go to page"
                />
                <button
                  type="submit"
                  className="ml-1 px-2 h-8 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition-colors"
                >
                  Go
                </button>
              </form>

              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-md bg-gray-200 dark:bg-gray-700 dark:text-white disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <FiChevronRight size={24} />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Home);
