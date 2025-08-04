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
} from "react-icons/fi";
import { FaGuitar, FaBed, FaWhatsapp } from "react-icons/fa";
import { FaQuestion } from "react-icons/fa6";
import { BiHome, BiSolidCategory } from "react-icons/bi";
import { FaSort } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { formatPrice } from "./Items";

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

// Simplified localStorage helpers
const STORAGE_KEYS = {
  ITEMS_DATA: "marketplace_items_data",
  CATEGORIES_DATA: "marketplace_categories_data",
};

const createStorageKey = (params) => {
  const { searchVal, category, campus, sortType } = params;
  return `${searchVal || ""}_${category || ""}_${campus || ""}_${
    sortType || ""
  }`;
};

const getStoredData = (storageKey) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ITEMS_DATA);
    if (!stored) return null;

    const parsedData = JSON.parse(stored);
    return parsedData[storageKey] || null;
  } catch (error) {
    console.error("Error reading stored data:", error);
    return null;
  }
};

const setStoredData = (storageKey, data) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ITEMS_DATA);
    const parsedData = stored ? JSON.parse(stored) : {};

    parsedData[storageKey] = {
      ...data,
      timestamp: Date.now(),
    };

    localStorage.setItem(STORAGE_KEYS.ITEMS_DATA, JSON.stringify(parsedData));
  } catch (error) {
    console.error("Error saving stored data:", error);
  }
};

const getStoredCategories = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES_DATA);
    if (!stored) return null;

    const data = JSON.parse(stored);
    return data.categories;
  } catch (error) {
    console.error("Error reading stored categories:", error);
    return null;
  }
};

const setStoredCategories = (categories) => {
  try {
    const data = {
      categories,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.CATEGORIES_DATA, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving stored categories:", error);
  }
};

const Home = ({
  searchVal = "",
  selectedCategory,
  setSelectedCategory,
  selectedCampus,
  categories,
  setCategories,
  scrollHeight = 0, // <-- from parent
  setScrollHeight,
  onItemClick, // <-- new prop for handling item clicks
}) => {
  const [items, setItems] = useState([]);
  const [totalItemsCat, setTotalItemsCat] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState("newest");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [debouncedSearchVal, setDebouncedSearchVal] = useState(searchVal);
  const [backgroundRefreshing, setBackgroundRefreshing] = useState(false);
  const [newItemsCount, setNewItemsCount] = useState(0);
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

  // Create storage key based on current parameters
  const getCurrentStorageKey = useCallback(() => {
    return createStorageKey({
      searchVal: debouncedSearchVal,
      category: selectedCategory,
      campus: selectedCampus,
      sortType,
    });
  }, [debouncedSearchVal, selectedCategory, selectedCampus, sortType]);

  // Create API parameters
  const createAPIParams = useCallback(() => {
    const params = new URLSearchParams();

    if (debouncedSearchVal && debouncedSearchVal.trim() !== "") {
      params.append("q", debouncedSearchVal.trim());
    }

    if (selectedCategory && selectedCategory !== "All Categories") {
      params.append("cat", selectedCategory);
    }

    if (selectedCampus === "All Campuses") {
      params.append("c", "All");
    } else if (selectedCampus && selectedCampus !== "All Campuses") {
      params.append("c", selectedCampus);
    }

    params.append("s", getSortValue(sortType).toString());

    return params;
  }, [debouncedSearchVal, selectedCategory, selectedCampus, sortType]);

  // Calculate new items count from category differences
  const calculateNewItemsCount = useCallback(
    (storedTotalCat, fetchedTotalCat) => {
      if (!storedTotalCat || !fetchedTotalCat) return 0;

      const storedTotal = Object.values(storedTotalCat).reduce(
        (sum, count) => sum + count,
        0
      );
      const fetchedTotal = Object.values(fetchedTotalCat).reduce(
        (sum, count) => sum + count,
        0
      );

      return Math.max(0, fetchedTotal - storedTotal);
    },
    []
  );

  // Main fetch function - simplified approach
  const fetchItems = useCallback(
    async (page = 1, isLoadMore = false) => {
      const storageKey = getCurrentStorageKey();

      // Step 1: For initial load, try to load from localStorage first
      if (!isLoadMore && page === 1) {
        const storedData = getStoredData(storageKey);
        if (storedData) {
          const firstPageItems = storedData.allPages?.[1] || [];
          setItems(firstPageItems);

          setTotalItemsCat(storedData.totalItemsCat || {});
          setCurrentPage(1);
          console.log("currentPage From FetchItems", storedData.currentPage);
          setHasMore(storedData.hasMore !== false);

          // Load categories from storage
          const storedCategories = getStoredCategories();
          if (storedCategories) {
            setCategories(storedCategories);
          }

          // Start background refresh after showing cached data
          setTimeout(() => backgroundFetch(storedData), 100);
          return;
        }
      }

      // Step 2: For load more, try to load from localStorage first
      if (isLoadMore) {
        const storedData = getStoredData(storageKey);
        if (storedData && storedData.allPages && storedData.allPages[page]) {
          // Add items from storage
          setItems((prev) => [...prev, ...storedData.allPages[page]]);
          setCurrentPage(page);
          console.log("currentPage From FetchItems2", page);

          // Start background fetch for this page
          setTimeout(() => backgroundFetchPage(page, storedData), 100);
          return;
        }
      }

      // Step 3: If no cached data, show loading and fetch
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        await fetchFromAPI(page, isLoadMore);
      } catch (err) {
        handleFetchError(err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [getCurrentStorageKey, createAPIParams, setCategories]
  );

  // Background fetch function for initial load
  const backgroundFetch = useCallback(
    async (storedData) => {
      try {
        setBackgroundRefreshing(true);

        const params = createAPIParams();
        params.append("p", "1");

        const hardcodedCategories = {
          status: "ok",
          data: [
            { id: 21, name: "Electronics & Gadgets" },
            { id: 22, name: "Kitchen & Cooking" },
            { id: 23, name: "Books & Study Materials" },
            { id: 24, name: "Sports & Fitness Gear" },
            { id: 25, name: "Musical Instruments" },
            { id: 26, name: "Dorm & Bedroom Essentials" },
            { id: 27, name: "Room Decor" },
            { id: 28, name: "Community & Shared Resources" },
            { id: 29, name: "Digital Subscriptions & Accounts" },
            { id: 30, name: "Others" },
          ],
        };

        const [itemsResponse, categoriesResponse] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_URL}/items?${params.toString()}`,
            {
              withCredentials: true,
            }
          ),
          Promise.resolve({ data: hardcodedCategories }), // Mimic axios response structure
        ]);

        if (itemsResponse.data.status === "ok") {
          const fetchedItems = itemsResponse.data.items || [];
          const fetchedTotalCat = itemsResponse.data.total_items_cat || {};
          const fetchedCategories = categoriesResponse.data.data;

          // Calculate new items count
          const newCount = calculateNewItemsCount(
            storedData.totalItemsCat,
            fetchedTotalCat
          );
          if (newCount > 0) {
            setNewItemsCount(newCount);
            setTimeout(() => setNewItemsCount(0), 5000);
          }

          // Update items and categories
          setItems(fetchedItems);
          setTotalItemsCat(fetchedTotalCat);
          setCategories(fetchedCategories);

          // Calculate total pages
          const totalPages = Math.ceil(
            itemsResponse.data.total_items / ITEMS_PER_PAGE
          );
          const hasMoreItems = 1 < totalPages;
          setHasMore(hasMoreItems);

          // Update storage
          const storageKey = getCurrentStorageKey();
          const dataToStore = {
            items: fetchedItems,
            totalItemsCat: fetchedTotalCat,
            currentPage: 1,
            hasMore: hasMoreItems,
            allPages: { 1: fetchedItems },
          };
          setStoredData(storageKey, dataToStore);
          setStoredCategories(fetchedCategories);
        }
      } catch (error) {
        console.error("Background fetch failed:", error);
        handleFetchError(error);
      } finally {
        setBackgroundRefreshing(false);
      }
    },
    [
      createAPIParams,
      calculateNewItemsCount,
      getCurrentStorageKey,
      setCategories,
    ]
  );

  // Background fetch for specific page
  const backgroundFetchPage = useCallback(
    async (page, storedData) => {
      try {
        const params = createAPIParams();
        params.append("p", page.toString());

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/items?${params.toString()}`,
          { withCredentials: true }
        );

        if (response.data.status === "ok") {
          const fetchedItems = response.data.items || [];

          // Update items in UI
          setItems((prev) => {
            const existingItems = prev.slice(0, (page - 1) * ITEMS_PER_PAGE);
            const newItems = [...existingItems, ...fetchedItems];
            return newItems;
          });

          // Update storage
          const storageKey = getCurrentStorageKey();
          const updatedStoredData = {
            ...storedData,
            allPages: {
              ...storedData.allPages,
              [page]: fetchedItems,
            },
          };
          setStoredData(storageKey, updatedStoredData);
        }
      } catch (error) {
        console.error(`Background fetch for page ${page} failed:`, error);
      }
    },
    [createAPIParams, getCurrentStorageKey]
  );

  // Direct API fetch function
  const fetchFromAPI = useCallback(
    async (page, isLoadMore) => {
      const params = createAPIParams();
      params.append("p", page.toString());

      const hardcodedCategories = {
        status: "ok",
        data: [
          { id: 21, name: "Electronics & Gadgets" },
          { id: 22, name: "Kitchen & Cooking" },
          { id: 23, name: "Books & Study Materials" },
          { id: 24, name: "Sports & Fitness Gear" },
          { id: 25, name: "Musical Instruments" },
          { id: 26, name: "Dorm & Bedroom Essentials" },
          { id: 27, name: "Room Decor" },
          { id: 28, name: "Community & Shared Resources" },
          { id: 29, name: "Digital Subscriptions & Accounts" },
          { id: 30, name: "Others" },
        ],
      };

      const [itemsResponse, categoriesResponse] = await Promise.all([
        axios.get(
          `${import.meta.env.VITE_API_URL}/items?${params.toString()}`,
          {
            withCredentials: true,
          }
        ),
        Promise.resolve({ data: hardcodedCategories }), // Mimic axios response structure
      ]);

      if (itemsResponse.data.status === "ok") {
        const fetchedItems = itemsResponse.data.items || [];
        const fetchedTotalCat = itemsResponse.data.total_items_cat || {};

        if (!isLoadMore && categoriesResponse) {
          const fetchedCategories = categoriesResponse.data.data;
          setCategories(fetchedCategories);
          setStoredCategories(fetchedCategories);
        }

        // Calculate total pages
        const totalPages = Math.ceil(
          itemsResponse.data.total_items / ITEMS_PER_PAGE
        );
        const hasMoreItems = page < totalPages;

        if (isLoadMore) {
          setItems((prev) => [...prev, ...fetchedItems]);
        } else {
          setItems(fetchedItems);
        }

        setTotalItemsCat(fetchedTotalCat);
        setHasMore(hasMoreItems);
        setCurrentPage(page);
        console.log("currentPage From FetchItems3", page);

        // Update storage
        const storageKey = getCurrentStorageKey();
        if (isLoadMore) {
          const storedData = getStoredData(storageKey);
          const updatedStoredData = {
            ...storedData,
            currentPage: page,
            hasMore: hasMoreItems,
            allPages: {
              ...storedData?.allPages,
              [page]: fetchedItems,
            },
          };
          setStoredData(storageKey, updatedStoredData);
        } else {
          const dataToStore = {
            items: fetchedItems,
            totalItemsCat: fetchedTotalCat,
            currentPage: page,
            hasMore: hasMoreItems,
            allPages: { [page]: fetchedItems },
          };
          setStoredData(storageKey, dataToStore);
        }
      } else {
        throw new Error(itemsResponse.data.error || "Failed to fetch items");
      }
    },
    [createAPIParams, setCategories, getCurrentStorageKey]
  );

  // Error handler
  const handleFetchError = useCallback((error) => {
    if (error.response?.status === 403) {
      localStorage.clear();
      toast.error("Login expired. Please login again.");
      window.location.reload();
      return;
    }

    const errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch items";
    setError(errorMessage);
    toast.error(errorMessage);
  }, []);

  const allCategoriesOption = {
    id: "All Categories",
    name: "All Categories",
  };

  const categoriesWithAll = [allCategoriesOption, ...categories];

  useEffect(() => {
    setCurrentPage(1);
    setItems([]);
    setHasMore(true);
    setNewItemsCount(0);
    fetchItems(1, false);

    // Reset scroll when filters change
    if (mainContainerRef.current) {
      mainContainerRef.current.scrollTop = 0;
    }
    if (setScrollHeight) setScrollHeight(0);
  }, [
    debouncedSearchVal,
    selectedCategory,
    selectedCampus,
    sortType,
    fetchItems,
    setScrollHeight,
  ]);

  const handleScroll = useCallback(() => {
    if (!mainContainerRef.current || loading || loadingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = mainContainerRef.current;

    // Update parent's scroll height
    setScrollHeight(scrollTop);

    // Infinite scroll logic: trigger load more when near bottom
    if (scrollHeight - scrollTop - clientHeight < 1000) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchItems(nextPage, true);
    }
  }, [
    currentPage,
    loading,
    loadingMore,
    hasMore,
    fetchItems,
    setScrollHeight, // Added dependency
  ]);
  // Attach scroll listener
  useEffect(() => {
    const container = mainContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);
  // Restore scroll position when items are loaded
  useEffect(() => {
    if (items.length > 0 && mainContainerRef.current && scrollHeight > 0) {
      // Delay slightly to ensure DOM is ready
      const timer = setTimeout(() => {
        mainContainerRef.current.scrollTop = scrollHeight;
      }, 50); // Small delay to ensure layout is painted

      return () => clearTimeout(timer);
    }
  }, [items.length, scrollHeight]);
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleWhatsApp = (e, item) => {
    e.stopPropagation();
    if (item.contact) {
      window.open(item.contact, "_blank");
    } else {
      toast.error("Phone number not available for this item");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
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
      <div className="p-2 sm:p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold text-gray-800 dark:text-gray-100"
          >
            Campus Marketplace
            {backgroundRefreshing && (
              <span className="text-xs text-blue-500 ml-2">Updating...</span>
            )}
            {newItemsCount > 0 && (
              <span className="text-xs text-green-500 ml-2 bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full">
                +{newItemsCount} new items
              </span>
            )}
          </motion.h1>
        </div>

        {/* Search Results Display */}
        {debouncedSearchVal && debouncedSearchVal.trim() !== "" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
          >
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Search results for "{debouncedSearchVal}"
            </p>
          </motion.div>
        )}

        {/* Categories scroll */}
        <div className="mb-3 overflow-x-auto no-scrollbar">
          <div className="flex space-x-2 overflow-auto w-full pb-2">
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
                <div className="text-lg">{categoryIcons[category.name]}</div>
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

        {/* Sort dropdown - now visible on all screen sizes */}
        <div className="flex justify-end items-center mb-3">
          <div className="relative">
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="pl-8 pr-4 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest</option>
              <option value="priceAsc">Price: Low-High</option>
              <option value="priceDesc">Price: High-Low</option>
            </select>
            <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm pointer-events-none" />
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
        {!loading && !error && items.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
          >
            {items.map((item) => (
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
                onClick={() =>
                  !item.is_sold && onItemClick && onItemClick(item.id)
                }
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
                        Inactive
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
                      <span className="truncate">
                        {formatPrice(item.price, item.campus)}
                      </span>
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
                    onClick={(e) => handleWhatsApp(e, item)}
                    className={`w-full py-2 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                      item.is_sold
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    <FaWhatsapp size={16} />
                    {item.is_sold ? "Inactive" : "Contact"}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : !loading && !error && items.length === 0 ? (
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
        {!loading && !loadingMore && !hasMore && items.length > 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>You've reached the end of the results</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Home);
