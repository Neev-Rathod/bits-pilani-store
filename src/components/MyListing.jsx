import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ItemsContext } from "../contexts/ItemsContext";
import { motion } from "framer-motion";
import {
  FiPhone,
  FiCalendar,
  FiTag,
  FiPackage,
  FiCheckCircle,
  FiXCircle,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { HeightContext } from "../contexts/HeightContext";
import axios from "axios";
import { toast } from "react-toastify";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const MyListings = ({ user }) => {
  const { items, loading, error, setItems } = useContext(ItemsContext);
  const { height } = useContext(HeightContext);
  const navigate = useNavigate();

  const [markLoading, setMarkLoading] = useState({});
  const [deleteLoading, setDeleteLoading] = useState({});

  const myItems =
    items?.filter((item) => item.sellerEmail === user.email) || [];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  // Mark as Sold/Unsold Handler (Axios)
  const handleMarkSold = async (itemId, newStatus) => {
    setMarkLoading((prev) => ({ ...prev, [itemId]: true }));
    try {
      await axios.put(`${VITE_API_URL}/updatestats/${itemId}`, {
        id: itemId,
        issold: newStatus,
      });
      if (setItems) {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId ? { ...item, issold: newStatus } : item
          )
        );
      }
    } catch (err) {
      toast.error(
        "Error updating item status: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setMarkLoading((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  // Delete Handler (Axios)
  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setDeleteLoading((prev) => ({ ...prev, [itemId]: true }));
    try {
      await axios.delete(`${VITE_API_URL}/updatestats/${itemId}`, {
        status: "deleted",
        id: itemId,
      });
      if (setItems) {
        setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      }
    } catch (err) {
      alert(
        "Error deleting item: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-500 dark:text-red-400 text-lg font-medium">
              Error loading your listings
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="overflow-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
      style={{ height }}
    >
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
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
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <FiPackage className="text-blue-600 dark:text-blue-400" />
              <span className="text-gray-900 dark:text-white font-medium">
                Total Items: {myItems.length}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Items Grid */}
        {myItems.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-18 lg:mb-0"
          >
            {myItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:scale-105 ${
                  item.issold ? "opacity-80 grayscale" : ""
                }`}
              >
                {/* Item Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.itemImage}
                    alt={item.itemName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x200?text=No+Image";
                    }}
                  />
                  {/* Sold Badge */}
                  {item.issold && (
                    <span className="absolute top-2 left-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <FiCheckCircle /> Sold
                    </span>
                  )}
                </div>

                {/* Item Details */}
                <div className="p-5">
                  {/* Item Name and Price */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {item.itemName}
                    </h3>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatPrice(item.itemPrice)}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex items-center gap-2 mb-3">
                    <FiTag className="text-gray-500 dark:text-gray-400 text-sm" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>

                  {/* Date Added */}
                  <div className="flex items-center gap-2 mb-3">
                    <FiCalendar className="text-gray-500 dark:text-gray-400 text-sm" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Listed on {formatDate(item.dateAdded)}
                    </span>
                  </div>

                  {/* Contact Number */}
                  <div className="flex items-center gap-2 mb-4">
                    <FiPhone className="text-gray-500 dark:text-gray-400 text-sm" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-mono">
                      {item.contactNumber}
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
                        deleteLoading[item.id]
                          ? "opacity-60 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={deleteLoading[item.id]}
                      onClick={() => handleDelete(item.id)}
                      type="button"
                    >
                      <FiTrash2 />
                      {deleteLoading[item.id] ? "Deleting..." : "Delete"}
                    </button>
                    {item.issold ? (
                      <button
                        className={`flex-1 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded-lg transition-colors duration-200 text-sm font-semibold shadow-md ${
                          markLoading[item.id]
                            ? "opacity-60 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={markLoading[item.id]}
                        onClick={() => handleMarkSold(item.id, false)}
                        type="button"
                      >
                        <FiXCircle />
                        {markLoading[item.id] ? "Marking..." : "Mark as Unsold"}
                      </button>
                    ) : (
                      <button
                        className={`flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 text-sm font-semibold shadow-md ${
                          markLoading[item.id]
                            ? "opacity-60 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={markLoading[item.id]}
                        onClick={() => handleMarkSold(item.id, true)}
                        type="button"
                      >
                        <FiCheckCircle />
                        {markLoading[item.id] ? "Marking..." : "Mark as Sold"}
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
