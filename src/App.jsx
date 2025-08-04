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
                  <Route path="/item/:id" element={<Item />} />
                  {/* Catch all route for protected area */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

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
