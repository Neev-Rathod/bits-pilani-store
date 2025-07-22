import { motion } from "framer-motion";
import {
  FaHeart,
  FaGithub,
  FaEnvelope,
  FaUsers,
  FaCode,
  FaLightbulb,
  FaRocket,
} from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";

const AboutPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.8,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div
      className="overflow-auto bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
      style={{ height: "calc(var(--app-height) - 56px)" }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-6 py-16"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <h1 className="md:text-5xl text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              BITS Pawnshop
            </h1>
          </div>
          <motion.div
            className="flex items-center justify-center text-sm md:text-xl text-gray-600 dark:text-gray-300 mb-4"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <span>Made with</span>
            <FaHeart className="text-red-500 mx-2 animate-pulse" />
            <span>by BITSians, for BITSians</span>
          </motion.div>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            A community-driven platform where BITS Pilani students can easily
            buy and sell items within campus, fostering connections and making
            student life more convenient.
          </p>
        </motion.div>

        {/* Our Story Section */}
        <motion.div variants={itemVariants} className="mb-20">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <FaRocket className="text-blue-400 text-2xl mr-3" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Our Story
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              We're Vishrut and Ayush, two students who wanted to create
              something useful for the BITS Pilani community. The idea for
              bits-pilani.store came up during a casual conversation about
              starting a project that could{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                genuinely help students.
              </span>{" "}
              That's when we thought of building a platform where students could
              easily buy and sell items within campus.
            </p>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-center mb-12">
            <FaUsers className="text-purple-600 dark:text-purple-400 text-2xl mr-3" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Meet The Team
            </h2>
          </div>

          <div className="grid lg:grid-cols-3  md:grid-cols-2 gap-8 mb-10 lg:mb-0">
            {/* Vishrut's Card */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 text-center"
            >
              <div className="mb-6">
                <img
                  src="/vishrut.png"
                  alt="Vishrut Ramraj"
                  className="w-32 h-32 rounded-full mx-auto border-4 border-blue-500 shadow-lg"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Vishrut Ramraj
              </h3>
              <div className="flex items-center justify-center mb-4">
                <FaCode className="text-blue-600 dark:text-blue-400 mr-2" />
                <p className="text-blue-600 dark:text-blue-400 font-medium">
                  Backend Developer
                </p>
              </div>
              <motion.a
                href="mailto:f20230352@goa.bits-pilani.ac.in"
                className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <FaEnvelope className="mr-2" />
                f20230352@goa.bits-pilani.ac.in
              </motion.a>
            </motion.div>

            {/* Ayush's Card */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 text-center mb-10 md:mb-0"
            >
              <div className="mb-6">
                <img
                  src="/ayush.png"
                  alt="Ayush Sanger"
                  className="w-32 h-32 rounded-full mx-auto border-4 border-blue-500 shadow-lg"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Ayush Sanger
              </h3>
              <div className="flex items-center justify-center mb-4">
                <FaLightbulb className="text-purple-600 dark:text-purple-400 mr-2" />
                <p className="text-purple-600 dark:text-purple-400 font-medium">
                  Idea and Marketing
                </p>
              </div>
              <motion.a
                href="mailto:f20230742@goa.bits-pilani.ac.in"
                className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <FaEnvelope className="mr-2" />
                f20230742@goa.bits-pilani.ac.in
              </motion.a>
            </motion.div>
            {/* Neev Card */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 text-center"
            >
              <div className="mb-6">
                <img
                  src="/neev.jpeg"
                  alt="Neev Rathod"
                  className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-blue-500 shadow-lg"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Neev Rathod
              </h3>
              <div className="flex items-center justify-center mb-4">
                <FaCode className="text-blue-600 dark:text-blue-400 mr-2" />
                <p className="text-blue-600 dark:text-blue-400 font-medium">
                  Frontend Developer
                </p>
              </div>
              <motion.a
                href="mailto:f20240487@goa.bits-pilani.ac.in"
                className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <FaEnvelope className="mr-2" />
                f20240487@goa.bits-pilani.ac.in
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
