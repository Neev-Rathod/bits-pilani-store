import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUpload,
  FiX,
  FiSend,
  FiImage,
  FiMessageSquare,
  FiCheck,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Feedback = () => {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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
    setIsSubmitted(false);

    try {
      const formData = {
        description,
        images, // assuming this is an array of file names or base64 strings
      };

      // Real-ish POST request to a dummy URL
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/posts ",
        formData
      );

      console.log("Submission response:", response.data);

      setIsSubmitting(false);
      setIsSubmitted(true);

      // Redirect after success animation
      setTimeout(() => {
        setDescription("");
        setImages([]);
        setIsSubmitted(false);
        navigate("/"); // Navigate to homepage or any route you prefer
      }, 2000);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Submission failed:", error);
      alert("Failed to submit form. Please try again.");
    }
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

  const [height, setHeight] = useState(getHeight());

  function getHeight() {
    return window.innerWidth >= 1024
      ? "calc(100dvh - 56px)"
      : "calc(100dvh - 120px)";
  }

  useEffect(() => {
    const handleResize = () => setHeight(getHeight());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-800 rounded-2xl p-8 text-center max-w-md w-full"
        >
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
          <p className="text-gray-400">
            Your feedback has been submitted successfully.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 py-12 px-6 overflow-auto" style={{ height }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Share Your Feedback
          </h1>
          <p className="text-gray-400">
            Help us improve by sharing your thoughts and experiences
          </p>
        </motion.div>
        <form onSubmit={handleSubmit}>
          <motion.div
            variants={itemVariants}
            className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700"
          >
            <div className="space-y-6">
              {/* Description Textarea */}
              <motion.div variants={itemVariants}>
                <label className="flex items-center text-lg font-semibold text-white mb-3">
                  <FiMessageSquare className="mr-2" />
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about your experience, suggestions, or any issues you've encountered..."
                  className="w-full h-32 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  required
                />
              </motion.div>

              {/* Image Upload Section */}
              <motion.div variants={itemVariants}>
                <label className="flex items-center text-lg font-semibold text-white mb-3">
                  <FiImage className="mr-2" />
                  Images ({images.length}/5)
                </label>

                {/* Upload Area */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                    isDragOver
                      ? "border-blue-400 bg-blue-500/10"
                      : images.length >= 5
                      ? "border-gray-600 bg-gray-700/50"
                      : "border-gray-600 hover:border-gray-500 bg-gray-700/30"
                  }`}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={images.length >= 5}
                  />

                  <motion.div
                    animate={{ scale: isDragOver ? 1.05 : 1 }}
                    className="flex flex-col items-center"
                  >
                    <FiUpload
                      className={`text-4xl mb-3 ${
                        images.length >= 5 ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <p
                      className={`text-lg font-medium mb-1 ${
                        images.length >= 5 ? "text-gray-500" : "text-gray-300"
                      }`}
                    >
                      {images.length >= 5
                        ? "Maximum images reached"
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
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
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
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center transition-all ${
                    !description.trim() || isSubmitting
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
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
