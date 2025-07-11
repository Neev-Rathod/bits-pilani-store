import React, { lazy, Suspense, useEffect, useState, useCallback } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// Components
import Navbar from "./components/Navbar";
// import Home from "./components/Home";
import Footer from "./components/Footer";
// import Item from "./components/Items";
import AddItem from "./components/AddItem";
import Feedback from "./components/Feedback";
import AboutPage from "./components/AboutUs";
// import MyListings from "./components/MyListing";
import Login from "./components/Login";

const Home = lazy(() => import("./components/Home"));
const Item = lazy(() => import("./components/Items"));
const MyListings = lazy(() => import("./components/MyListing"));
export const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
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
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Initialize theme
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

  const getCSRFTokenFromCookies = () => {
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

  const handleLogin = async (userData) => {
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
          campus: response.data.campus || "default-campus", // Adjust default as needed
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

    // Optional final GET request
    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/authreceiver`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Final auth check failed:", error);
      toast.error("Authentication check failed after login.");
    }

    navigate("/");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login"); // Redirect to login after logout
  };

  // Memoized callbacks
  const setDarktheme = useCallback((theme) => {
    setDarkthemeState(theme);
  }, []);

  const setSelectedCategory = useCallback((cat) => {
    setSelectedCategoryState(cat);
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
    <div className="flex flex-col justify-between h-dvh">
      <Routes>
        {/* Public Route - Login */}
        <Route
          path="/login"
          element={
            user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute user={user}>
              <div className="flex flex-col justify-between h-dvh">
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
                      <Suspense
                        fallback={
                          <div className="text-center p-4">Loading Home...</div>
                        }
                      >
                        <Home
                          searchVal={searchVal}
                          selectedCategory={selectedCategory}
                          setSelectedCategory={setSelectedCategory}
                          selectedCampus={selectedCampus}
                          categories={categories}
                          setCategories={setCategories}
                        />
                      </Suspense>
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
                    element={
                      <Suspense
                        fallback={
                          <div className="text-center p-4">
                            Loading My Listings...
                          </div>
                        }
                      >
                        <MyListings user={user} categories={categories} />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/item/:id"
                    element={
                      <Suspense
                        fallback={
                          <div className="text-center p-4">Loading Item...</div>
                        }
                      >
                        <Item />
                      </Suspense>
                    }
                  />
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
