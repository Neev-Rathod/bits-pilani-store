import { useEffect, useState, useCallback } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Categories from "./components/Categories";
import Item from "./components/Items";
import { Route, Routes } from "react-router-dom";
import AddItem from "./components/AddItem";
import Feedback from "./components/Feedback";
import AboutPage from "./components/AboutUs";
import MyListings from "./components/MyListing";

function App() {
  const [darktheme, setDarkthemeState] = useState(
    localStorage.getItem("color-theme")
  );
  const [searchVal, setSearchValState] = useState();
  const [selectedCategory, setSelectedCategoryState] =
    useState("All Categories");

  useEffect(() => {
    const theme = localStorage.getItem("color-theme");
    if (theme) setDarkthemeState(theme);
    document.body.classList.add(theme || "light");
  }, []);

  useEffect(() => {
    localStorage.setItem("color-theme", darktheme);
    document.body.classList.remove("light", "dark");
    document.body.classList.add(darktheme);
  }, [darktheme]);

  // Memoized callbacks
  const setDarktheme = useCallback((theme) => {
    setDarkthemeState(theme);
  }, []);

  const setSearchVal = useCallback((val) => {
    setSearchValState(val);
  }, []);

  const setSelectedCategory = useCallback((cat) => {
    setSelectedCategoryState(cat);
  }, []);

  return (
    <div className="flex flex-col justify-between h-dvh">
      <Navbar
        darktheme={darktheme}
        setDarktheme={setDarktheme}
        searchVal={searchVal}
        setSearchVal={setSearchVal}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              searchVal={searchVal}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          }
        />
        <Route
          path="/categories"
          element={
            <Categories
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          }
        />
        <Route path="/add" element={<AddItem />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/aboutus" element={<AboutPage />} />
        <Route path="/mylistings" element={<MyListings />} />
        <Route path="/item/:id" element={<Item />} />
      </Routes>

      <div className="lg:hidden block">
        <Footer />
      </div>
    </div>
  );
}

export default App;
