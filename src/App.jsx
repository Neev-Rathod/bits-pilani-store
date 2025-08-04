import { useEffect, useState, useCallback } from "react";
import {
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
// Components
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Item from "./components/Items";
import AddItem from "./components/AddItem";
import Feedback from "./components/Feedback";
import AboutPage from "./components/AboutUs";
import MyListings from "./components/MyListing";
import Login from "./components/Login";

// Modal component for Item view
const ItemModal = ({ itemId, onClose, onItemClick }) => {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full h-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <Item
          itemId={itemId}
          isModal={true}
          onClose={onClose}
          onItemClick={onItemClick}
        />
      </div>
    </div>
  );
};
export const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
export const getCSRFTokenFromCookies = () => {
  const name = "csrftoken=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(";");

  const tokens = [];

  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i].trim();
    if (c.indexOf(name) === 0) {
      tokens.push(c.substring(name.length, c.length));
    }
  }

  return tokens;
};
function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [darktheme, setDarkthemeState] = useState(
    localStorage.getItem("color-theme") || "light"
  );
  const [searchVal, setSearchValState] = useState();
  const [selectedCategory, setSelectedCategoryState] =
    useState("All Categories");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCampus, setSelectedCampus] = useState(
    JSON.parse(localStorage.getItem("user"))?.campus || "All Campuses"
  );
  const [loginLoading, setLoginLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [scrollHeight, setScrollHeight] = useState(0); // Always start from 0
  const [hasNavigatedToHome, setHasNavigatedToHome] = useState(false);

  // Modal state for item view
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  // Navigation stack for tracking item navigation history
  const [itemNavigationStack, setItemNavigationStack] = useState([]);

  console.log(scrollHeight);
  // Initialize theme
  const setAppHeight = () => {
    const height = window.innerHeight;
    document.documentElement.style.setProperty("--app-height", `${height}px`);
  };

  useEffect(() => {
    setAppHeight();
    window.addEventListener("resize", setAppHeight);
    return () => window.removeEventListener("resize", setAppHeight);
  }, []);

  useEffect(() => {
    const theme = localStorage.getItem("color-theme");
    if (theme) setDarkthemeState(theme);
    document.body.classList.add(theme || "light");
  }, []);

  // Update theme
  useEffect(() => {
    localStorage.setItem("color-theme", darktheme);
    document.body.classList.remove("light", "dark");
    document.body.classList.add(darktheme);
  }, [darktheme]);

  // Persist scroll height to localStorage
  useEffect(() => {
    localStorage.setItem("homeScrollHeight", scrollHeight.toString());
  }, [scrollHeight]);

  // Handle scroll restoration when navigating back to home
  useEffect(() => {
    if (location.pathname === "/" && hasNavigatedToHome && user) {
      // Only restore scroll if we've navigated to home from another page
      const savedScrollHeight = localStorage.getItem("homeScrollHeight");
      if (savedScrollHeight) {
        const parsedScrollHeight = parseInt(savedScrollHeight, 10);
        // Limit scroll height to maximum 1299
        setScrollHeight(parsedScrollHeight);
      }
    } else if (location.pathname !== "/") {
      // Mark that we're navigating away from home
      setHasNavigatedToHome(true);
    }
  }, [location.pathname, hasNavigatedToHome, user]);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // Handle item modal based on URL
  useEffect(() => {
    const pathMatch = location.pathname.match(/^\/item\/(.+)$/);
    if (pathMatch && user) {
      const itemId = pathMatch[1];
      setSelectedItemId(itemId);
      setShowItemModal(true);
      // Don't replace URL immediately - let it stay for proper back button handling
    } else if (!pathMatch && showItemModal) {
      // Only close modal if we're not on an item path and modal is open
      setShowItemModal(false);
      setSelectedItemId(null);
      // Clear navigation stack when going back to home
      setItemNavigationStack([]);
    }
  }, [location.pathname, user, showItemModal]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = (event) => {
      const pathMatch = location.pathname.match(/^\/item\/(.+)$/);
      if (!pathMatch && showItemModal) {
        // User navigated back from item page
        setShowItemModal(false);
        setSelectedItemId(null);
        // Clear navigation stack when going back to home
        setItemNavigationStack([]);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [location.pathname, showItemModal]);

  // Handle modal close
  const handleCloseItemModal = useCallback(() => {
    // Check if there's a previous item in the navigation stack
    if (itemNavigationStack.length > 0) {
      // Get the previous item from the stack
      const previousItemId =
        itemNavigationStack[itemNavigationStack.length - 1];
      // Remove the current item from the stack
      setItemNavigationStack((prev) => prev.slice(0, -1));
      // Navigate to the previous item
      navigate(`/item/${previousItemId}`);
    } else {
      // No previous item, go back to home
      setShowItemModal(false);
      setSelectedItemId(null);
      navigate("/");
    }
  }, [navigate, itemNavigationStack]);

  // Handle item click from Home component
  const handleItemClick = useCallback(
    (itemId) => {
      setSelectedItemId(itemId);
      setShowItemModal(true);
      // Navigate to the item URL properly for browser history
      navigate(`/item/${itemId}`);
    },
    [navigate]
  );

  // Handle item click from within item page (similar items)
  const handleItemClickFromItem = useCallback(
    (newItemId, currentItemId) => {
      // Add current item to navigation stack
      setItemNavigationStack((prev) => [...prev, currentItemId]);
      setSelectedItemId(newItemId);
      // Navigate to the new item
      navigate(`/item/${newItemId}`);
    },
    [navigate]
  );

  const handleLogin = async (userData) => {
    setLoginLoading(true);
    try {
      // Initial GET request to possibly set CSRF cookie
      await axios.get(`${import.meta.env.VITE_API_URL}/authreceiver`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error during initial auth check:", error);
    }

    const csrfTokens = getCSRFTokenFromCookies();

    if (!csrfTokens || csrfTokens.length === 0) {
      return toast.error("No CSRF Token found");
    }

    let success = false;

    // Try each CSRF token until one works
    for (const csrfToken of csrfTokens) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/authreceiver/`,
          {
            email: userData.email,
            name: userData.name,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
            },
            withCredentials: true,
          }
        );

        const userDataWithCampus = {
          ...userData,
          campus: response.data.campus || "All Campuses", // Adjust default as needed
        };

        setUser(userDataWithCampus);
        localStorage.setItem("user", JSON.stringify(userDataWithCampus));

        success = true;
        break; // Exit loop after successful login
      } catch (err) {
        console.warn("Failed with token:", csrfToken, err.message);
        continue; // Try next token
      }
    }

    if (!success) {
      toast.error("All CSRF tokens failed. Please try logging in again.");
      return;
    }

    setLoginLoading(false);
    toast.success(`Welcome ${userData.name}! 🎉`);
    setSelectedCampus(
      JSON.parse(localStorage.getItem("user"))?.campus || "All Campuses"
    );
    navigate("/");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("homeScrollHeight"); // Clear scroll position on logout
    setScrollHeight(0); // Reset scroll height state
    setHasNavigatedToHome(false); // Reset navigation flag
    navigate("/login"); // Redirect to login after logout
  };

  // Memoized callbacks
  const setDarktheme = useCallback((theme) => {
    setDarkthemeState(theme);
  }, []);

  const setSelectedCategory = useCallback((cat) => {
    setSelectedCategoryState(cat);
  }, []);

  // Function to reset scroll height (can be called when needed)
  const resetScrollHeight = useCallback(() => {
    setScrollHeight(0);
    setHasNavigatedToHome(false);
    localStorage.removeItem("homeScrollHeight");
  }, []);

  // Memoized scroll height setter to prevent unnecessary re-renders
  const updateScrollHeight = useCallback((height) => {
    setScrollHeight(height);
  }, []);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col justify-between "
      style={{ height: "var(--app-height)" }}
    >
      <Routes>
        {/* Public Route - Login */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={handleLogin} loading={loginLoading} />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute user={user}>
              <div
                className="flex flex-col justify-between "
                style={{ height: "var(--app-height)" }}
              >
                <Navbar
                  darktheme={darktheme}
                  setDarktheme={setDarktheme}
                  searchVal={searchVal}
                  setSearchVal={setSearchValState}
                  user={user}
                  onLogout={handleLogout}
                  selectedCampus={selectedCampus}
                  setSelectedCampus={setSelectedCampus}
                />

                <Routes>
                  <Route
                    path="/"
                    element={
                      <Home
                        searchVal={searchVal}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        selectedCampus={selectedCampus}
                        categories={categories}
                        setCategories={setCategories}
                        scrollHeight={scrollHeight} // Pass scrollHeight
                        setScrollHeight={updateScrollHeight} // Pass memoized setScrollHeight
                        onItemClick={handleItemClick} // Pass item click handler
                      />
                    }
                  />

                  {/* Item route that also shows Home with modal */}
                  <Route
                    path="/item/:id"
                    element={
                      <Home
                        searchVal={searchVal}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        selectedCampus={selectedCampus}
                        categories={categories}
                        setCategories={setCategories}
                        scrollHeight={scrollHeight} // Pass scrollHeight
                        setScrollHeight={updateScrollHeight} // Pass memoized setScrollHeight
                        onItemClick={handleItemClick} // Pass item click handler
                      />
                    }
                  />

                  <Route
                    path="/add"
                    element={
                      <AddItem
                        user={user}
                        categories={categories}
                        setCategories={setCategories}
                      />
                    }
                  />
                  <Route
                    path="/add/:id"
                    element={
                      <AddItem
                        user={user}
                        categories={categories}
                        setCategories={setCategories}
                      />
                    }
                  />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/aboutus" element={<AboutPage />} />
                  <Route
                    path="/mylistings"
                    element={<MyListings user={user} />}
                  />
                  {/* Catch all route for protected area */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                {/* Item Modal */}
                {showItemModal && selectedItemId && (
                  <ItemModal
                    itemId={selectedItemId}
                    onClose={handleCloseItemModal}
                    onItemClick={handleItemClickFromItem}
                  />
                )}

                <div className="lg:hidden block">
                  <Footer />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Catch all other routes - redirect to login if not authenticated */}
        <Route
          path="*"
          element={<Navigate to={user ? "/" : "/login"} replace />}
        />
      </Routes>

      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darktheme === "dark" ? "dark" : "light"}
        className="mt-16"
      />
    </div>
  );
}

export default App;
