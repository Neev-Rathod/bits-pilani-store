// src/components/Item.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FiArrowLeft,
  FiPhone,
  FiUser,
  FiMapPin,
  FiCalendar,
  FiImage,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

function Item() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for item data
  const [item, setItem] = useState(null);
  const [similarItems, setSimilarItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch item data
  useEffect(() => {
    const fetchItemData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/items/${id}`,
          {
            withCredentials: true, // Required to accept cookie from server
          }
        );

        const data = response.data;

        // Set item details from the new schema
        setItem(data.details);
        setSimilarItems(data.similar_items || []);
      } catch (err) {
        console.error("Error fetching item data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItemData();
  }, [id]);

  // Reset current image index when item changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [item]);

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

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div
      className="bg-gray-50 dark:bg-gray-900 overflow-auto"
      style={{ height: "calc(100dvh - 56px)" }}
    >
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Back Button Skeleton */}
        <motion.div
          className="mb-6 flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
        </motion.div>

        {/* Main Content Skeleton */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row">
            {/* Image Section Skeleton */}
            <div className="lg:w-2/5 flex-shrink-0">
              <div className="relative h-80 sm:h-96 lg:h-full min-h-[400px] bg-gray-200 dark:bg-gray-700 animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-gray-300 dark:bg-gray-600 rounded-full p-6">
                    <FiImage
                      size={48}
                      className="text-gray-400 dark:text-gray-500"
                    />
                  </div>
                </div>
                {/* Image indicators skeleton */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 bg-black/20 backdrop-blur-md rounded-full px-4 py-2">
                  {[1, 2, 3].map((_, index) => (
                    <div
                      key={index}
                      className="w-3 h-3 rounded-full bg-white/50"
                    />
                  ))}
                </div>
                {/* Image counter skeleton */}
                <div className="absolute top-6 right-6 bg-black/20 backdrop-blur-md text-white px-4 py-2 rounded-full">
                  <div className="h-4 w-12 bg-white/50 rounded"></div>
                </div>
              </div>
            </div>

            {/* Details Section Skeleton */}
            <div className="lg:w-3/5 p-6 sm:p-8 flex flex-col">
              {/* Header Info Skeleton */}
              <div className="mb-6">
                {/* Title Skeleton */}
                <div className="h-8 sm:h-10 bg-gray-300 dark:bg-gray-600 rounded mb-3 animate-pulse w-3/4"></div>

                {/* Category Badge Skeleton */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-6 w-24 bg-blue-200 dark:bg-blue-800 rounded-full animate-pulse"></div>
                </div>

                {/* Price Skeleton */}
                <div className="h-10 sm:h-12 bg-green-200 dark:bg-green-800 rounded mb-6 animate-pulse w-48"></div>
              </div>

              {/* Description Section Skeleton */}
              <div className="mb-6">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-3 animate-pulse w-32"></div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-5/6"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-4/6"></div>
                  </div>
                </div>
              </div>

              {/* Seller Information Skeleton */}
              <div className="mb-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-5">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4 animate-pulse w-40"></div>
                <div className="space-y-3">
                  {/* Seller Info Items */}
                  {[1, 2, 3, 4].map((_, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-5 h-5 bg-gray-400 dark:bg-gray-500 rounded mr-3 flex-shrink-0 animate-pulse"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-32"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Button Skeleton */}
              <div className="space-y-3 mt-auto">
                <div className="w-full h-12 bg-green-200 dark:bg-green-800 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Similar Items Section Skeleton */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Section Title Skeleton */}
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-6 animate-pulse w-48"></div>

          {/* Similar Items Grid Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                {/* Image Skeleton */}
                <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                  <FiImage
                    size={24}
                    className="text-gray-400 dark:text-gray-500"
                  />
                </div>
                {/* Content Skeleton */}
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-4 bg-green-200 dark:bg-green-800 rounded animate-pulse w-16"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  if (loading) {
    return <SkeletonLoader />;
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
      `Hi! I'm interested in your ${item.name} listed on BITS Pilani Store.`
    );
    const phoneNumber = item.phone?.replace(/\+/, "") || "";
    if (phoneNumber) {
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    }
  };

  const SimilarItemCard = ({ similarItem }) => (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer"
      variants={cardVariants}
      whileHover="hover"
      onClick={() => navigate(`/item/${similarItem.id}`)}
    >
      <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        {similarItem.firstimage ? (
          <img
            src={similarItem.firstimage}
            alt={similarItem.title}
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
          {similarItem.title}
        </h4>
        <p className="text-green-600 dark:text-green-400 font-bold text-sm">
          {formatPrice(similarItem.price)}
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
          {similarItem.hostel}
        </p>
      </div>
    </motion.div>
  );

  // Image Carousel Component
  const ImageCarousel = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    // Get images from the fetched item data
    const displayImages =
      item.images && item.images.length > 0 ? item.images : [];

    const hasMultipleImages = displayImages.length > 1;

    const goToImage = useCallback(
      (index) => {
        if (hasMultipleImages) {
          setCurrentImageIndex(index % displayImages.length);
        }
      },
      [displayImages.length, hasMultipleImages]
    );

    const nextImage = useCallback(() => {
      if (hasMultipleImages) {
        setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
      }
    }, [displayImages.length, hasMultipleImages]);

    const prevImage = useCallback(() => {
      if (hasMultipleImages) {
        setCurrentImageIndex(
          (prev) => (prev - 1 + displayImages.length) % displayImages.length
        );
      }
    }, [displayImages.length, hasMultipleImages]);

    // Handle keyboard navigation only if multiple images
    useEffect(() => {
      if (!hasMultipleImages) return;

      const handleKeyDown = (e) => {
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [nextImage, prevImage, hasMultipleImages]);

    // Auto play carousel only if multiple images
    useEffect(() => {
      if (!hasMultipleImages) return;

      const interval = setInterval(() => {
        if (!isDragging) {
          nextImage();
        }
      }, 5000);
      return () => clearInterval(interval);
    }, [isDragging, nextImage, hasMultipleImages]);

    const handleDragStart = () => {
      if (hasMultipleImages) {
        setIsDragging(true);
      }
    };

    const handleDragEnd = () => {
      if (hasMultipleImages) {
        setIsDragging(false);
      }
    };

    const handleImageError = () => {
      if (hasMultipleImages && currentImageIndex < displayImages.length - 1) {
        setCurrentImageIndex((prev) => prev + 1);
      }
    };

    if (displayImages.length === 0) {
      return (
        <div className="flex items-center justify-center h-full min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl">
          <div className="text-center">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-6 mb-6 mx-auto w-fit">
              <FiImage size={48} className="text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              No images available
            </p>
          </div>
        </div>
      );
    }

    const imageVariants = {
      enter: (direction) => ({
        x: direction * 300,
        opacity: 0,
      }),
      center: {
        x: 0,
        opacity: 1,
        transition: {
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.3 },
        },
      },
      exit: (direction) => ({
        x: direction * -300,
        opacity: 0,
        transition: {
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.3 },
        },
      }),
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

    return (
      <div
        className="relative h-full group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden shadow-xl"
        onDragStart={hasMultipleImages ? handleDragStart : undefined}
        onDragEnd={
          hasMultipleImages
            ? (e) => {
                handleDragEnd();
                const offset = e.velocityX;
                if (
                  swipePower(offset, e.velocity) < -swipeConfidenceThreshold
                ) {
                  nextImage();
                } else if (
                  swipePower(offset, e.velocity) > swipeConfidenceThreshold
                ) {
                  prevImage();
                }
              }
            : undefined
        }
        drag={hasMultipleImages ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
      >
        {/* Main Image Display */}
        <div className="relative h-full flex items-center justify-center p-8 select-none">
          <AnimatePresence mode="wait" custom={1}>
            <motion.img
              key={currentImageIndex}
              src={displayImages[currentImageIndex]}
              alt={`${item.name} - Image ${currentImageIndex + 1}`}
              className="max-h-[calc(100dvh-20rem)] sm:max-h-[calc(100dvh-16rem)] max-w-full object-contain rounded-xl shadow-2xl"
              variants={hasMultipleImages ? imageVariants : {}}
              initial={hasMultipleImages ? "enter" : {}}
              animate={hasMultipleImages ? "center" : {}}
              exit={hasMultipleImages ? "exit" : {}}
              custom={1}
              drag={hasMultipleImages ? "x" : false}
              onDragStart={hasMultipleImages ? handleDragStart : undefined}
              onDragEnd={
                hasMultipleImages
                  ? (e, info) => {
                      const offset = info.offset.x;
                      const velocity = info.velocity.x;
                      if (
                        swipePower(offset, velocity) < -swipeConfidenceThreshold
                      ) {
                        nextImage();
                      } else if (
                        swipePower(offset, velocity) > swipeConfidenceThreshold
                      ) {
                        prevImage();
                      }
                      handleDragEnd();
                    }
                  : undefined
              }
              onError={handleImageError}
            />
          </AnimatePresence>
        </div>

        {/* Navigation Arrows - Only show if multiple images */}
        {hasMultipleImages && (
          <>
            <motion.button
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute z-10 left-4 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 shadow-lg border border-white/20"
              whileTap={{ scale: 0.95 }}
            >
              <FiChevronLeft size={24} />
            </motion.button>

            <motion.button
              onClick={nextImage}
              aria-label="Next image"
              className="absolute z-10 right-4 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 shadow-lg border border-white/20"
              whileTap={{ scale: 0.95 }}
            >
              <FiChevronRight size={24} />
            </motion.button>
          </>
        )}

        {/* Image Indicators - Only show if multiple images */}
        {hasMultipleImages && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 bg-black/20 backdrop-blur-md rounded-full px-4 py-2">
            {displayImages.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToImage(index)}
                aria-label={`Go to image ${index + 1}`}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? "bg-white scale-125 shadow-lg"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                whileHover={{ scale: index === currentImageIndex ? 1.25 : 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        )}

        {/* Image Counter - Only show if multiple images */}
        {hasMultipleImages && (
          <div className="absolute top-6 right-6 bg-black/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-white/20">
            {currentImageIndex + 1} / {displayImages.length}
          </div>
        )}

        {/* Gradient overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/10 pointer-events-none rounded-2xl" />
      </div>
    );
  };

  return (
    <div
      className="bg-gray-50 dark:bg-gray-900 overflow-auto"
      style={{ height: "calc(100dvh - 56px)" }}
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
          <div className="flex flex-col lg:flex-row">
            {/* Image Carousel Section */}
            <motion.div
              className="lg:w-2/5 flex-shrink-0"
              variants={itemVariants}
            >
              <div className="relative h-80 sm:h-96 lg:h-full min-h-[400px] bg-gray-100 dark:bg-gray-700">
                <ImageCarousel />
              </div>
            </motion.div>

            {/* Details Section */}
            <motion.div
              className="lg:w-3/5 p-6 sm:p-8 flex flex-col"
              variants={itemVariants}
            >
              {/* Header Info */}
              <div className="mb-6">
                <motion.h1
                  className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3"
                  variants={itemVariants}
                >
                  {item.name}
                </motion.h1>

                {item.category && (
                  <motion.div
                    className="flex items-center gap-2 mb-4"
                    variants={itemVariants}
                  >
                    <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm px-3 py-1 rounded-full">
                      Category: {item.category}
                    </span>
                  </motion.div>
                )}

                <motion.div
                  className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mb-6"
                  variants={itemVariants}
                >
                  {formatPrice(item.price)}
                </motion.div>
              </div>

              {/* Description Section */}
              {item.description && (
                <motion.div className="mb-6" variants={itemVariants}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Description
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Seller Information */}
              <motion.div
                className="mb-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-5"
                variants={itemVariants}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Seller Information
                </h3>
                <div className="space-y-3">
                  {item.seller && (
                    <>
                      <motion.div
                        className="flex items-center"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FiUser className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {item.seller.name}
                        </span>
                      </motion.div>
                    </>
                  )}

                  {item.hostel && (
                    <motion.div
                      className="flex items-center"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiMapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.hostel}
                      </span>
                    </motion.div>
                  )}

                  {item.phone && (
                    <motion.div
                      className="flex items-center"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiPhone className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.phone}
                      </span>
                    </motion.div>
                  )}

                  {item.updated_at && (
                    <motion.div
                      className="flex items-center"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiCalendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Updated on {formatDate(item.updated_at)}
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Contact Buttons */}
              <motion.div className="space-y-3 mt-auto" variants={itemVariants}>
                {item.phone && (
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
                )}
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
              Similar Items
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
