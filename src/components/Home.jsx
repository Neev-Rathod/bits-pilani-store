import { useState, useEffect, useRef, memo, useMemo, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiCalendar } from "react-icons/fi";
import {
  FiMonitor,
  FiCoffee,
  FiBook,
  FiActivity,
  FiImage,
  FiUsers,
  FiSmartphone,
  FiFilter,
} from "react-icons/fi";
import { FaGuitar, FaBed, FaWhatsapp } from "react-icons/fa";
import { FaQuestion } from "react-icons/fa6";
import { BiHome, BiSolidCategory } from "react-icons/bi";
import { FaSort } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
  Others: <FaQuestion />,
};

const ITEMS_PER_PAGE = 20;

// Skeleton loader component
const SkeletonLoader = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col animate-pulse">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-200 dark:bg-gray-700">
        <div className="w-full h-full bg-gray-300 dark:bg-gray-600"></div>
      </div>
      <div className="p-2 flex-grow">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
        <div className="space-y-1">
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
        </div>
      </div>
      <div className="p-2 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
        <div className="w-full h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
    </div>
  );
};

// Skeleton grid component
const SkeletonGrid = ({ count = 10 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <SkeletonLoader key={index} />
        ))}
    </div>
  );
};

const Home = ({
  searchVal = "",
  selectedCategory,
  setSelectedCategory,
  selectedCampus,
  categories,
  setCategories,
}) => {
  const [items, setItems] = useState([]);
  const [totalItemsCat, setTotalItemsCat] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState("newest");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [categoryScrollRef, setCategoryScrollRef] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [debouncedSearchVal, setDebouncedSearchVal] = useState(searchVal);
  const mainContainerRef = useRef(null);
  const navigate = useNavigate();

  // Debounce search value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchVal(searchVal);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchVal]);

  // Convert sort type to API format
  const getSortValue = (sortType) => {
    switch (sortType) {
      case "newest":
        return 0;
      case "priceAsc":
        return 1;
      case "priceDesc":
        return 2;
      default:
        return 0;
    }
  };

  // Fetch items from API
  const fetchItems = useCallback(
    async (page = 1, isLoadMore = false) => {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const params = new URLSearchParams();

        // Add parameters
        if (debouncedSearchVal && debouncedSearchVal.trim() !== "") {
          params.append("q", debouncedSearchVal.trim());
        }

        if (selectedCategory && selectedCategory !== "All Categories") {
          params.append("cat", selectedCategory);
        }

        if (selectedCampus && selectedCampus !== "All Campuses") {
          params.append("c", selectedCampus);
        }

        params.append("p", page.toString());
        params.append("s", getSortValue(sortType).toString());

        // Make both API calls with axios
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/items?${params.toString()}`,
          {
            withCredentials: true,
          }
        );

        // Only fetch categories on initial load
        if (!isLoadMore) {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/categories`,
            {
              withCredentials: true,
            }
          );
          setCategories(res.data.data);
        }

        // Check response status and set items data
        if (response.data.status === "ok") {
          const newItems = response.data.items;

          if (isLoadMore) {
            setItems((prev) => [...prev, ...newItems]);
          } else {
            setItems(newItems);
          }

          setTotalItemsCat(response.data.total_items_cat || {});

          // Check if there are more items to load
          const totalPages = Math.ceil(
            response.data.total_items / ITEMS_PER_PAGE
          );
          setHasMore(page < totalPages);
        } else {
          setError("Failed to fetch items from server");
          toast.error(response.data.error || "gotcha");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch item");
        toast.error("Failed to fetch items try logging in again");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [
      debouncedSearchVal,
      selectedCategory,
      selectedCampus,
      sortType,
      setCategories,
    ]
  );

  const allCategoriesOption = {
    id: "All Categories",
    name: "All Categories",
  };

  const categoriesWithAll = [allCategoriesOption, ...categories];

  // Initial fetch
  useEffect(() => {
    setCurrentPage(1);
    setItems([]);
    setHasMore(true);
    fetchItems(1, false);
  }, [debouncedSearchVal, selectedCategory, selectedCampus, sortType]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (!mainContainerRef.current || loading || loadingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = mainContainerRef.current;

    // Load more when user is near the bottom (200px threshold)
    if (scrollHeight - scrollTop - clientHeight < 200) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchItems(nextPage, true);
    }
  }, [currentPage, loading, loadingMore, hasMore, fetchItems]);

  // Attach scroll listener
  useEffect(() => {
    const container = mainContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Handle sold/unsold filtering (client-side for now)
  const displayItems = useMemo(() => {
    let result = [...items];

    return result;
  }, [items, sortType]);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

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

  // Get category counts
  const categoryCount = useMemo(() => {
    const counts = {};
    let sumOfAllCategories = 0;

    categoriesWithAll.forEach((category) => {
      if (category.id !== "All Categories") {
        const count = totalItemsCat[category.id] || 0;
        counts[category.id] = count;
        sumOfAllCategories += count;
      }
    });

    counts["All Categories"] = sumOfAllCategories;
    return counts;
  }, [totalItemsCat, categoriesWithAll]);

  return (
    <div
      className="overflow-auto bg-gray-50 dark:bg-gray-900"
      style={{ height: "calc(var(--app-height) - 56px)" }}
      ref={mainContainerRef}
    >
      <div className="p-2 sm:p-4 ">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold text-gray-800 dark:text-gray-100"
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
              className="fixed inset-0 z-60 bg-black/25 "
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
                    className="text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-1 transition"
                  >
                    ✕
                  </button>
                </div>

                {/* Sort Buttons */}
                <div className="mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 mb-3 block">
                    Sort by
                  </span>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setSortType("newest");
                        setIsFilterOpen(false);
                      }}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                sortType === "newest"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300"
              }`}
                    >
                      Newest
                    </button>

                    <button
                      onClick={() => {
                        setSortType("priceAsc");
                        setIsFilterOpen(false);
                      }}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                sortType === "priceAsc"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300"
              }`}
                    >
                      Price: Low-High
                    </button>
                    <button
                      onClick={() => {
                        setSortType("priceDesc");
                        setIsFilterOpen(false);
                      }}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                sortType === "priceDesc"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300"
              }`}
                    >
                      Price: High-Low
                    </button>
                  </div>
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
            {categoriesWithAll.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex gap-2 items-center justify-center p-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:dark:bg-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="text-lg ">{categoryIcons[category.name]}</div>
                <div className="flex items-center h-full">
                  <span className="text-xs whitespace-nowrap mr-2">
                    {category.name}
                  </span>
                  <span
                    className={`text-xs pb-[1px] px-1.5 rounded-full transition-colors ${
                      selectedCategory === category.id
                        ? "bg-blue-700 dark:bg-blue-700"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    {categoryCount[category.id] || 0}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sort and results info */}
        <div className="flex justify-between items-center mb-3">
          <div className="relative hidden md:block">
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="pl-6 pr-4 py-1 text-xs bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="priceAsc">Price: Low-High</option>
              <option value="priceDesc">Price: High-Low</option>
              {/* <option value="sold">Sold</option>
              <option value="unsold">Unsold</option> */}
            </select>
            <FaSort className="absolute left-2 top-2 text-gray-500 dark:text-gray-400 text-xs" />
          </div>
        </div>

        {/* Initial Loading state with skeleton */}
        {loading && items.length === 0 && <SkeletonGrid count={10} />}

        {/* Error state */}
        {error && (
          <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="text-5xl mb-2">⚠️</div>
            <p className="text-lg text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => fetchItems(1, false)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Items grid */}
        {!loading && !error && displayItems.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 "
          >
            {displayItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ scale: item.is_sold ? 1 : 1.02 }}
                transition={{ duration: 0.2 }}
                className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col relative ${
                  item.is_sold
                    ? "opacity-60 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={() => !item.is_sold && navigate(`/item/${item.id}`)}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={item.firstimage}
                    alt={item.title}
                    className={`w-full h-full object-cover ${
                      item.is_sold ? "grayscale" : ""
                    }`}
                    loading="lazy"
                  />
                  {item.is_sold && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold transform -rotate-12">
                        SOLD
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-2 flex-grow">
                  <h3 className="text-sm font-medium mb-1 text-gray-800 dark:text-white line-clamp-1">
                    {item.title}
                  </h3>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-lg text-gray-600 dark:text-gray-400 font-bold">
                      <span className="truncate">₹{item.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                        <FiCalendar
                          className="text-blue-500 shrink-0"
                          size={12}
                        />
                        <span>{formatDate(item.date)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                        <BiHome className="text-blue-500 shrink-0" size={12} />
                        <span>{item.hostel}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                  <motion.button
                    whileTap={{ scale: item.is_sold ? 1 : 0.95 }}
                    disabled={item.is_sold}
                    className={`w-full py-2 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                      item.is_sold
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    <FaWhatsapp size={16} />
                    {item.is_sold ? "Sold" : "Contact"}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : !loading && !error && displayItems.length === 0 ? (
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

        {/* Load More Skeleton */}
        {loadingMore && (
          <div className="mt-6">
            <SkeletonGrid count={6} />
          </div>
        )}

        {/* End of results message */}
        {!loading && !loadingMore && !hasMore && displayItems.length > 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>You've reached the end of the results</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Home);
