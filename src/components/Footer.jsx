import { IoAdd } from "react-icons/io5";
import { FaList } from "react-icons/fa";
import { BiHome } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  {
    label: "Home",
    icon: BiHome,
    path: "/",
  },
  {
    label: "Sell",
    icon: IoAdd,
    path: "/add",
    isCenter: true,
  },
  {
    label: "My Listing",
    icon: FaList,
    path: "/mylistings",
  },
];

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs sm:max-w-sm">
      <motion.div
        className="relative flex items-center justify-between bg-white/90 dark:bg-gray-900/90 rounded-full shadow-xl backdrop-blur-md border border-gray-200 dark:border-gray-800 px-2 py-1"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
      >
        {/* Three equal columns for perfect centering */}
        {navItems.map(({ label, icon: Icon, path, isCenter }, idx) => (
          <div
            key={label}
            className={`flex-1 flex flex-col items-center ${
              isCenter ? "relative z-10" : ""
            }`}
          >
            {isCenter ? (
              <motion.button
                onClick={() => navigate(path)}
                className="relative -top-3 bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-xl rounded-full p-2 border-4 border-white dark:border-gray-900 hover:scale-110 transition"
                whileTap={{ scale: 0.92 }}
                aria-label={label}
              >
                <Icon className="text-white w-9 h-9" />
                <AnimatePresence>
                  {isActive(path) && (
                    <motion.span
                      className="absolute inset-0 rounded-full border-2 border-indigo-300"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1.08 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.25 }}
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            ) : (
              <motion.button
                onClick={() => {
                  navigate(path);
                  if (path === "/") window.location.reload();
                }}
                className="flex flex-col items-center w-full"
                whileTap={{ scale: 0.92 }}
                aria-label={label}
              >
                <motion.div
                  animate={
                    isActive(path)
                      ? { scale: 1.18, color: "#6366f1" }
                      : { scale: 1, color: "#6b7280" }
                  }
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-7 h-7 flex items-center justify-center"
                >
                  <Icon />
                </motion.div>
                <motion.span
                  animate={
                    isActive(path)
                      ? { color: "#6366f1", fontWeight: 600 }
                      : { color: "#6b7280", fontWeight: 400 }
                  }
                  className="text-sm "
                  transition={{ duration: 0.2 }}
                >
                  {label}
                </motion.span>
              </motion.button>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Footer;
