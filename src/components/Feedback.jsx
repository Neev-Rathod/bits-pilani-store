import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUpload,
  FiX,
  FiSend,
  FiImage,
  FiMessageSquare,
  FiCheck,
  FiAlertCircle,
  FiArrowLeft,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCSRFTokenFromCookies } from "../App";

const Feedback = () => {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleImageUpload = (files) => {
    const fileArray = Array.from(files).slice(0, 5 - images.length);
    const newImages = fileArray.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: Date.now() + Math.random(),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    setIsSubmitting(true);
    setError("");

    const csrfTokens = getCSRFTokenFromCookies();
    if (!csrfTokens || csrfTokens.length === 0) {
      localStorage.clear();
      toast.error("Session expired. Please log in again.");
      window.location.reload();
      return;
    }

    let success = false;

    for (const csrfToken of csrfTokens) {
      try {
        const formData = new FormData();
        formData.append("description", description.trim());
        images.forEach((image) => {
          formData.append("images", image.file);
        });

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/feedback`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "X-CSRFToken": csrfToken,
            },
            withCredentials: true,
          }
        );

        if (response.data.status === "ok") {
          success = true;
          break;
        } else {
          continue;
        }
      } catch (error) {
        console.warn("Feedback failed with token:", csrfToken, error.message);

        continue;
      }
    }

    if (!success) {
      setError("Failed to submit feedback. CSRF tokens rejected.");
      toast.error("Submission failed. Please try again.");
    } else {
      setIsSubmitted(true);
    }

    setIsSubmitting(false);
  };

  const handleReset = () => {
    setDescription("");
    setImages([]);
    setIsSubmitted(false);
    setError("");
  };

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
    visible: { opacity: 1, y: 0 },
  };

  if (isSubmitted) {
    return (
      <div
        className="dark:bg-gray-900 bg-gray-50 shadow-lg flex items-center justify-center p-6 overflow-auto"
        style={{ height: "calc(var(--app-height) - 56px)" }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="dark:bg-gray-800 bg-white shadow-lg rounded-2xl p-8 text-center max-w-md w-full"
        >
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold dark:text-white mb-2">
            Thank You!
          </h2>
          <p className="text-gray-400 mb-6">
            Your feedback has been submitted successfully.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Submit Another
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-2 px-4 border border-gray-600 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
            >
              Go Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="dark:bg-gray-900 bg-gray-50 py-6 px-6 overflow-auto"
      style={{ height: "calc(var(--app-height) - 56px)" }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto mb-16"
      >
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
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-bold dark:text-white mb-2">
            Share Your Feedback
          </h1>
          <p className="text-gray-400">
            Help us improve by sharing your thoughts and experiences
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div
            variants={itemVariants}
            className="dark:bg-gray-800 bg-white rounded-2xl p-8 shadow-2xl"
          >
            <div className="space-y-6">
              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                  >
                    <FiAlertCircle className="text-red-500 mr-3 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                    <button
                      type="button"
                      onClick={() => setError("")}
                      className="ml-auto text-red-500 hover:text-red-400"
                    >
                      <FiX />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Description Textarea */}
              <motion.div variants={itemVariants}>
                <label className="flex items-center text-lg font-semibold dark:text-white mb-3">
                  <FiMessageSquare className="mr-2" />
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about your experience, suggestions, or any issues you've encountered..."
                  className="w-full outline-none h-32 px-4 py-3 dark:bg-gray-700 bg-gray-50 border border-gray-600 rounded-xl dark:text-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  required
                  disabled={isSubmitting}
                />
              </motion.div>

              {/* Image Upload Section */}
              <motion.div variants={itemVariants}>
                <label className="flex items-center text-lg font-semibold dark:text-white mb-3">
                  <FiImage className="mr-2" />
                  Images ({images.length}/5)
                </label>

                {/* Upload Area */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    isSubmitting
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  } ${
                    isDragOver
                      ? "border-blue-400 dark:bg-blue-500/10"
                      : images.length >= 5
                      ? "border-gray-600 dark:bg-gray-700/50"
                      : "border-gray-600 hover:border-gray-500 dark:bg-gray-700/30"
                  }`}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={images.length >= 5 || isSubmitting}
                  />

                  <motion.div
                    animate={{ scale: isDragOver ? 1.05 : 1 }}
                    className="flex flex-col items-center"
                  >
                    <FiUpload
                      className={`text-4xl mb-3 ${
                        images.length >= 5 || isSubmitting
                          ? "text-gray-500"
                          : "text-gray-400"
                      }`}
                    />
                    <p
                      className={`text-lg font-medium mb-1 ${
                        images.length >= 5 || isSubmitting
                          ? "text-gray-500"
                          : "text-gray-300"
                      }`}
                    >
                      {images.length >= 5
                        ? "Maximum images reached"
                        : isSubmitting
                        ? "Upload disabled during submission"
                        : "Drop images here or click to upload"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {images.length >= 5
                        ? "Remove images to upload more"
                        : "PNG, JPG up to 5 images"}
                    </p>
                  </motion.div>
                </div>

                {/* Image Preview Grid */}
                <AnimatePresence>
                  {images.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4"
                    >
                      {images.map((image) => (
                        <motion.div
                          key={image.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="relative group"
                        >
                          <img
                            src={image.url}
                            alt="Upload preview"
                            className="w-full h-24 object-cover rounded-lg bg-gray-700"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            disabled={isSubmitting}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
                          >
                            <FiX className="text-white text-sm" />
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={!description.trim() || isSubmitting}
                  whileHover={{
                    scale: !description.trim() || isSubmitting ? 1 : 1.02,
                  }}
                  whileTap={{
                    scale: !description.trim() || isSubmitting ? 1 : 0.98,
                  }}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center transition-all ${
                    !description.trim() || isSubmitting
                      ? "dark:bg-gray-600 bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="mr-2"
                    >
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    </motion.div>
                  ) : (
                    <FiSend className="mr-2" />
                  )}
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default Feedback;
