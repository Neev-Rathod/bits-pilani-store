// src/components/Item.jsx
import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiPhone,
  FiUser,
  FiMapPin,
  FiCalendar,
  FiImage,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { ItemsContext } from "../contexts/ItemsContext";
import { HeightContext } from "../contexts/HeightContext";

function Item() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, loading, error } = useContext(ItemsContext);
  const [imageError, setImageError] = useState(false);
  const { height } = useContext(HeightContext);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.98 },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
    hover: {
      y: -5,
      transition: { duration: 0.2 },
    },
  };

  if (loading) {
    return (
      <motion.div
        className="flex justify-center items-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="rounded-full h-12 w-12 border-b-2 border-blue-600"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </motion.div>
    );
  }

  const item = items.find((item) => item.id === parseInt(id));

  if (!item) {
    return (
      <motion.div
        className="mx-auto px-4 py-8 flex items-center justify-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            className="text-2xl font-bold text-gray-800 dark:text-white mb-4"
            variants={itemVariants}
          >
            Item Not Found
          </motion.h2>
          <motion.p
            className="text-gray-600 dark:text-gray-300 mb-6"
            variants={itemVariants}
          >
            The item you're looking for doesn't exist or has been removed.
          </motion.p>
          <motion.button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Back to Home
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi! I'm interested in your ${item.itemName} listed on BITS Pilani Store.`
    );
    window.open(
      `https://wa.me/${item.contactNumber.replace(/\+/, "")}?text=${message}`,
      "_blank"
    );
  };

  // Get similar items (same category, different id)
  const similarItems = items
    .filter(
      (similarItem) =>
        similarItem.category === item.category && similarItem.id !== item.id
    )
    .slice(0, 6);

  const SimilarItemCard = ({ similarItem }) => (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer"
      variants={cardVariants}
      whileHover="hover"
      onClick={() => navigate(`/item/${similarItem.id}`)}
    >
      <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        {similarItem.itemImage ? (
          <img
            src={similarItem.itemImage}
            alt={similarItem.itemName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div className="hidden items-center justify-center text-gray-400">
          <FiImage size={32} />
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate mb-1">
          {similarItem.itemName}
        </h4>
        <p className="text-green-600 dark:text-green-400 font-bold text-sm">
          {formatPrice(similarItem.itemPrice)}
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
          {similarItem.sellerName}
        </p>
      </div>
    </motion.div>
  );

  return (
    <div
      className="bg-gray-50 dark:bg-gray-900  overflow-auto"
      style={{ height }}
    >
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Back Button */}
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

        {/* Main Content */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col sm:flex-row">
            {/* Image Section */}
            <motion.div
              className="sm:w-2/5 flex-shrink-0"
              variants={itemVariants}
            >
              <div className="relative h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                <AnimatePresence mode="wait">
                  {!imageError ? (
                    <motion.img
                      key="image"
                      src={item.itemImage}
                      alt={item.itemName}
                      className="max-h-[calc(100dvh-28rem)] sm:max-h-[calc(100dvh-12rem)] max-w-full object-contain"
                      onError={() => setImageError(true)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.4 }}
                    />
                  ) : (
                    <motion.div
                      key="placeholder"
                      className="flex items-center justify-center h-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <motion.div
                          initial={{ rotate: -10 }}
                          animate={{ rotate: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <FiImage size={64} className="mx-auto mb-4" />
                        </motion.div>
                        <p>Image not available</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Details Section */}
            <motion.div
              className="sm:w-3/5 p-6 sm:p-8 flex flex-col justify-between"
              variants={itemVariants}
            >
              {/* Header Info */}
              <div>
                <motion.h1
                  className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3"
                  variants={itemVariants}
                >
                  {item.itemName}
                </motion.h1>

                <motion.div
                  className="flex items-center gap-2 mb-4"
                  variants={itemVariants}
                >
                  <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                </motion.div>

                <motion.div
                  className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mb-6"
                  variants={itemVariants}
                >
                  {formatPrice(item.itemPrice)}
                </motion.div>
              </div>

              {/* Seller Information */}
              <motion.div
                className="mb-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-5"
                variants={itemVariants}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Seller Information
                </h3>
                <div className="space-y-3">
                  <motion.div
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiUser className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.sellerName}
                    </span>
                  </motion.div>

                  <motion.div
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiMapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.sellerHostel}
                    </span>
                  </motion.div>

                  <motion.div
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiPhone className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.contactNumber}
                    </span>
                  </motion.div>

                  <motion.div
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiCalendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Listed on {formatDate(item.dateAdded)}
                    </span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Contact Buttons */}
              <motion.div className="space-y-3" variants={itemVariants}>
                <motion.button
                  onClick={handleWhatsApp}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <FaWhatsapp className="w-5 h-5 mr-2" />
                  WhatsApp Seller
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Similar Items Section */}
        {similarItems.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.h2
              className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
              variants={itemVariants}
            >
              Similar Items in {item.category}
            </motion.h2>

            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {similarItems.map((similarItem, index) => (
                <motion.div
                  key={similarItem.id}
                  variants={cardVariants}
                  custom={index}
                >
                  <SimilarItemCard similarItem={similarItem} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Item;
