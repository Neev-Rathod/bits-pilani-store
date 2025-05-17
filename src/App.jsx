import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Footer from './components/Footer'
import Categories from './components/Categories'
import { Route, Routes } from 'react-router-dom'
import AddItem from './components/AddItem'

function App() {
  const [darktheme, setDarktheme] = useState(localStorage.getItem("color-theme"));
  const [searchVal, setSearchVal] = useState();

  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  useEffect(() => {
    const theme = localStorage.getItem("color-theme");
    if (theme) setDarktheme(theme);
    document.body.classList.add(theme || 'light');
  }, []);

  useEffect(() => {
    localStorage.setItem("color-theme", darktheme)
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(darktheme);
  }, [darktheme]);

  return (
    <div className='flex flex-col justify-between h-dvh'>
      <Navbar darktheme={darktheme} setDarktheme={setDarktheme} searchVal={searchVal} setSearchVal={setSearchVal} />

      <Routes>
        <Route path="/" element={<Home searchVal={searchVal} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />} />
        <Route path="/categories" element={<Categories selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />} />
        <Route path="/add" element={<AddItem />} />

      </Routes>
      <div className='lg:hidden block'>

        <Footer />
      </div>
    </div>
  )
}

export default App
