import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiPhone,
  FiCalendar,
  FiPackage,
  FiCheckCircle,
  FiXCircle,
  FiEdit2,
  FiTrash2,
  FiRotateCcw,
  FiImage,
  FiArrowLeft,
} from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { getCSRFTokenFromCookies } from "../App";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const MyListings = ({ user }) => {
  const navigate = useNavigate();

  // State management
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationLoading, setOperationLoading] = useState({});
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [bulkLoading, setBulkLoading] = useState({
    delete: false,
    markSold: false,
    markUnsold: false,
    repost: false,
  });

  // Fetch all items from server
  const fetchMyListings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${VITE_API_URL}/mylistings`, {
        withCredentials: true,
      });
      setMyItems(response.data.items || []);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch listings";
      setError(errorMessage);
      console.error("Error fetching listings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchMyListings();
  }, [fetchMyListings]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const extractPhoneNumber = (url) => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");
      return pathParts[1];
    } catch (e) {
      return null;
    }
  };

  const formatPrice = (price) => {
    if (user.campus === "DUB") {
      return `AED${price.toLocaleString("en-AE")}`;
    }
    return `₹${price.toLocaleString("en-IN")}`;
  };

  // Main operation handler - simplified to just perform action and refresh
  const handleItemOperation = async (method, ids, confirmMessage = null) => {
    if (ids.length === 0) return;

    if (confirmMessage && !window.confirm(confirmMessage)) return;

    const idsArray = Array.isArray(ids) ? ids : [ids];
    const isBulkOperation = idsArray.length > 1;

    const loadingKey = method
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace("_", "");
    if (isBulkOperation) {
      setBulkLoading((prev) => ({ ...prev, [loadingKey]: true }));
    } else {
      setOperationLoading((prev) => ({ ...prev, [idsArray[0]]: method }));
    }

    const csrfTokens = getCSRFTokenFromCookies();
    if (!csrfTokens || csrfTokens.length === 0) {
      localStorage.clear();
      toast.error("Session expired. Please log in again.");
      window.location.reload();
      return;
    }

    let success = false;
    let errorOccurred = false;

    for (const csrfToken of csrfTokens) {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/mylistings/`,
          {
            method: method,
            ids: idsArray,
          },
          {
            headers: {
              "X-CSRFToken": csrfToken,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        success = true;
        break;
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error(
            "Unauthorized. Please log in with Bits Email to Edit Items that are listed."
          );
          errorOccurred = true;
          break; // Exit loop on unauthorized error
        }
        console.warn("Operation failed with token:", csrfToken, err.message);
        continue;
      }
    }
    if (errorOccurred) {
      return;
    }

    if (!success) {
      toast.error(
        "Operation failed: CSRF tokens invalid. Please try logging in again."
      );
    } else {
      toast.success(
        `${idsArray.length} item(s) ${
          {
            DELETE: "deleted",
            "MARK SOLD": "marked as Inactive",
            "MARK UNSOLD": "marked as Active",
            REPOST: "reposted",
          }[method] || "updated"
        } successfully`
      );

      await fetchMyListings();
      setSelectedItems(new Set());
      setIsSelecting(false);
    }

    // Clear loading state
    if (isBulkOperation) {
      setBulkLoading((prev) => ({ ...prev, [loadingKey]: false }));
    } else {
      setOperationLoading((prev) => ({ ...prev, [idsArray[0]]: false }));
    }
  };

  // Selection handlers
  const handleSelectItem = (itemId) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(itemId)) {
      newSelectedItems.delete(itemId);
    } else {
      newSelectedItems.add(itemId);
    }
    setSelectedItems(newSelectedItems);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === myItems?.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(myItems?.map((item) => item.id)));
    }
  };

  const handleCancelSelection = () => {
    setIsSelecting(false);
    setSelectedItems(new Set());
  };

  // Individual operation handlers
  const handleMarkSold = (itemId, newStatus) => {
    const method = newStatus ? "MARK SOLD" : "MARK UNSOLD";
    handleItemOperation(method, itemId);
  };

  const handleDelete = (itemId) => {
    handleItemOperation(
      "DELETE",
      itemId,
      "Are you sure you want to delete this item?"
    );
  };

  const handleRepost = (itemId) => {
    handleItemOperation("REPOST", itemId);
  };

  // Bulk operation handlers
  const handleBulkDelete = () => {
    const ids = Array.from(selectedItems);
    handleItemOperation(
      "DELETE",
      ids,
      `Are you sure you want to delete ${ids.length} selected items?`
    );
  };

  const handleBulkMarkSold = () => {
    const ids = Array.from(selectedItems);
    handleItemOperation("MARK SOLD", ids);
  };

  const handleBulkMarkUnsold = () => {
    const ids = Array.from(selectedItems);
    handleItemOperation("MARK UNSOLD", ids);
  };

  const handleBulkRepost = () => {
    const ids = Array.from(selectedItems);
    handleItemOperation("REPOST", ids);
  };

  // Navigation handlers
  const handleItemClick = (itemId, e) => {
    if (e.target.closest("button")) {
      return;
    }

    if (isSelecting) {
      handleSelectItem(itemId);
      return;
    }

    navigate(`/item/${itemId}`);
  };

  // Helper function to check if an operation is loading
  const isOperationLoading = (itemId, operation) => {
    return operationLoading[itemId] === operation;
  };

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div
      className="overflow-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
      style={{ height: "calc(var(--app-height) - 56px)" }}
    >
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* Title and Description Skeleton */}
          <div className="mb-2">
            <div className="h-9 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-48 mb-2"></div>
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-80"></div>
          </div>

          {/* Stats and Controls Skeleton */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            {/* Stats Box Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-400 dark:bg-gray-500 rounded animate-pulse"></div>
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-28"></div>
              </div>
            </div>

            {/* Select Button Skeleton */}
            <div className="h-10 bg-blue-200 dark:bg-blue-800 rounded-lg animate-pulse w-28"></div>
          </div>
        </motion.div>

        {/* Items Grid Skeleton */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-18 lg:mb-0"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              {/* Image Skeleton */}
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                <FiImage
                  size={48}
                  className="text-gray-400 dark:text-gray-500"
                />
              </div>

              {/* Content Skeleton */}
              <div className="p-5">
                {/* Title and Price Skeleton */}
                <div className="mb-4">
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-2"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-3/4 mb-2"></div>
                  <div className="h-8 bg-blue-200 dark:bg-blue-800 rounded animate-pulse w-24"></div>
                </div>

                {/* Date and Phone Skeleton */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-400 dark:bg-gray-500 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-32"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-400 dark:bg-gray-500 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-28"></div>
                  </div>
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex-1 h-9 bg-blue-200 dark:bg-blue-800 rounded-lg animate-pulse"></div>
                  <div className="flex-1 h-9 bg-red-200 dark:bg-red-800 rounded-lg animate-pulse"></div>
                  <div className="flex-1 h-9 bg-green-200 dark:bg-green-800 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return <SkeletonLoader />;
  }

  // Error state
  if (error) {
    return (
      <div
        className=" bg-gray-50 dark:bg-gray-900 p-6"
        style={{ height: "calc(var(--app-height))" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-500 dark:text-red-400 text-lg font-medium">
              Error loading your listings
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{error}</p>
            <button
              onClick={fetchMyListings}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div
      className="overflow-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
      style={{ height: "calc(var(--app-height) - 56px)" }}
    >
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ x: -5 }}
        >
          <FiArrowLeft className="w-5 h-5 mr-2" />
          Back
        </motion.button>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Listings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and view all your listed items
          </p>

          {/* Stats and Select Controls */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <FiPackage className="text-blue-600 dark:text-blue-400" />
                <span className="text-gray-900 dark:text-white font-medium">
                  Total Items: {myItems?.length || 0}
                </span>
              </div>
            </div>

            {/* Select Controls */}
            {myItems?.length > 0 && (
              <div className="flex gap-2">
                {!isSelecting ? (
                  <button
                    onClick={() => setIsSelecting(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm"
                  >
                    <span className="hidden sm:inline">Select Items</span>
                    <span className="sm:hidden">Select</span>
                  </button>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={handleSelectAll}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors duration-200 font-medium text-sm"
                    >
                      {selectedItems.size === myItems?.length
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                    <button
                      onClick={handleCancelSelection}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors duration-200 font-medium text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bulk Actions Bar */}
          {isSelecting && selectedItems.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-gray-900 dark:text-white font-medium mr-2">
                  {selectedItems.size} selected:
                </span>

                <button
                  onClick={handleBulkDelete}
                  disabled={bulkLoading.delete}
                  className={`flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm font-medium ${
                    bulkLoading.delete ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  <FiTrash2 className="text-xs" />
                  {bulkLoading.delete ? "Deleting..." : "Delete"}
                </button>

                <button
                  onClick={handleBulkMarkSold}
                  disabled={bulkLoading.markSold}
                  className={`flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm font-medium ${
                    bulkLoading.markSold ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  <FiCheckCircle className="text-xs" />
                  {bulkLoading.markSold ? "Marking..." : "Mark Inactive"}
                </button>

                <button
                  onClick={handleBulkMarkUnsold}
                  disabled={bulkLoading.markUnsold}
                  className={`flex items-center gap-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm font-medium ${
                    bulkLoading.markUnsold
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <FiXCircle className="text-xs" />
                  {bulkLoading.markUnsold ? "Marking..." : "Mark Active"}
                </button>

                <button
                  onClick={handleBulkRepost}
                  disabled={bulkLoading.repost}
                  className={`flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm font-medium ${
                    bulkLoading.repost ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  <FiRotateCcw className="text-xs" />
                  {bulkLoading.repost ? "Reposting..." : "Repost All"}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Items Grid */}
        {myItems?.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-18 lg:mb-0"
          >
            {myItems?.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:scale-105 cursor-pointer relative ${
                  item.issold ? "opacity-80" : ""
                } ${selectedItems.has(item.id) ? "ring-2 ring-blue-500" : ""}`}
                onClick={(e) => handleItemClick(item.id, e)}
              >
                {/* Selection Checkbox */}
                {isSelecting && (
                  <div className="absolute top-2 right-2 z-10">
                    <div className="bg-white bg-opacity-90 rounded-full p-1">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="w-5 h-5 text-blue-600 bg-white border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </div>
                  </div>
                )}

                {/* Image OR SOLD placeholder */}
                <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  {item.issold ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold transform -rotate-12 shadow-md">
                        Inactive
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.firstimage}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>

                {/* Item Details */}
                <div className="p-5">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatPrice(item.price)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <FiCalendar className="text-gray-500 dark:text-gray-400 text-sm" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Listed on {formatDate(item.date)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <FiPhone className="text-gray-500 dark:text-gray-400 text-sm" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-mono">
                      {extractPhoneNumber(item.contact)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 text-sm font-semibold shadow-md"
                      onClick={() => navigate(`/add/${item.id}`)}
                      type="button"
                    >
                      <FiEdit2 /> Edit
                    </button>

                    <button
                      className={`flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 text-sm font-semibold shadow-md ${
                        isOperationLoading(item.id, "DELETE")
                          ? "opacity-60 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={isOperationLoading(item.id, "DELETE")}
                      onClick={() => handleDelete(item.id)}
                      type="button"
                    >
                      <FiTrash2 />
                      {isOperationLoading(item.id, "DELETE")
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                    {item.issold ? (
                      <button
                        className={`flex-1 whitespace-nowrap flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded-lg transition-colors duration-200 text-sm font-semibold shadow-md ${
                          isOperationLoading(item.id, "MARK UNSOLD")
                            ? "opacity-60 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={isOperationLoading(item.id, "MARK UNSOLD")}
                        onClick={() => handleMarkSold(item.id, false)}
                        type="button"
                      >
                        <FiXCircle />
                        {isOperationLoading(item.id, "MARK UNSOLD")
                          ? "Marking..."
                          : "Mark as Active"}
                      </button>
                    ) : (
                      <button
                        className={`flex-1 whitespace-nowrap flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 text-sm font-semibold shadow-md ${
                          isOperationLoading(item.id, "MARK SOLD")
                            ? "opacity-60 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={isOperationLoading(item.id, "MARK SOLD")}
                        onClick={() => handleMarkSold(item.id, true)}
                        type="button"
                      >
                        <FiCheckCircle />
                        {isOperationLoading(item.id, "MARK SOLD")
                          ? "Marking..."
                          : "Mark as Inactive"}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md mx-auto border border-gray-200 dark:border-gray-700">
              <FiPackage className="text-6xl text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Items Listed
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You haven't listed any items for sale yet. Start by adding your
                first item!
              </p>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors duration-200 font-medium"
                onClick={() => navigate("/add")}
              >
                Add Your First Item
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyListings;
