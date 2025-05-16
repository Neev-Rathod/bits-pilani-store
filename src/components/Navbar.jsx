import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaUserCircle, FaList, FaComments, FaInfoCircle, FaSignOutAlt, FaMoon, FaSun, FaHome, FaCheck } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

export default function Navbar({darktheme, setDarktheme,searchVal,setSearchVal}) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showCampuses, setShowCampuses] = useState(false);
    const [selectedCampus, setSelectedCampus] = useState("Pilani");
    const navigate = useNavigate();
    const searchInputRef = useRef(null);
    const dropdownRef = useRef(null);
    const campusDropdownRef = useRef(null);
    
    const campuses = ["Pilani", "Goa", "Dubai", "Hyderabad", "All Campuses"];
    
    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (campusDropdownRef.current && !campusDropdownRef.current.contains(event.target)) {
                setShowCampuses(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Focus input when search expands
    useEffect(() => {
        if (showSearch && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [showSearch]);
    
    const handleToggleDarkTheme = () => {
        if(darktheme === 'light'){
            setDarktheme('dark');
        } else {
            setDarktheme('light');
        }
    }
    
    const handleProfileClick = () => {
        setShowDropdown(!showDropdown);
    }

    const toggleSearch = () => {
        setShowSearch(!showSearch);
    }
    
    const toggleCampusDropdown = () => {
        setShowCampuses(!showCampuses);
    }
    
    const selectCampus = (campus) => {
        setSelectedCampus(campus);
        setShowCampuses(false);
    }
    
    return (
        <div className='w-full h-14 items-center px-2 flex shadow-lg dark:bg-gray-800 justify-between relative'>
            {/* Logo - hidden when search is expanded on mobile */}
            {!showSearch && (
                <h1 className='text-[#2D4059] text-xl sm:text-2xl lg:text-3xl font-bold dark:text-white transition-colors duration-300' onClick={()=>navigate('/')}>Bits Pawnshop</h1>
            )}
            
            {/* Search Bar - Expanded View */}
            {showSearch && (
                <div className='absolute left-0 right-0 top-0 bottom-0 bg-white dark:bg-gray-800 z-10 px-2 flex items-center transition-all duration-300 ease-in-out'>
                    <div className='flex items-center w-full dark:bg-gray-600 rounded border-2 border-gray-200 dark:border-0'>
                        <div className='pl-2'>
                            <FaSearch className='text-gray-500 dark:text-white'/>
                        </div>
                        <input 
                            ref={searchInputRef}
                            value={searchVal}
                            onChange={(e)=>{console.log(searchVal);setSearchVal(e.target.value);}}   
                            type="text" 
                            className='flex-1 outline-0 border-0 dark:bg-gray-600 dark:text-white px-2 py-1' 
                            placeholder='Search...'
                        />
                        <button onClick={toggleSearch} className="px-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-1 transition-colors duration-200">
                            <IoMdClose className="text-gray-500 dark:text-white" />
                        </button>
                    </div>
                </div>
            )}
            
            {/* Right side controls - hidden when search is expanded on mobile */}
            {!showSearch && (
                <div className="flex items-center space-x-2 md:space-x-4">
                    {/* Desktop Search in middle position */}
                    <div className='hidden md:flex items-center dark:bg-gray-600 rounded border-2 border-gray-200 dark:border-0 transition-colors duration-300'>
                        <div className='pl-2'>
                            <FaSearch className='text-gray-500 dark:text-white'/>
                        </div>
                        <input 
                                                    onChange={(e)=>{console.log(searchVal);setSearchVal(e.target.value);}}   

                            type="text" 
                            className='outline-0 border-0 dark:bg-gray-600 dark:text-white px-2 py-1 transition-colors duration-300 md:w-52 lg:w-84' 
                            placeholder='Search...'
                        />
                    </div>
                    
                    {/* Custom Campus Selector */}
                    <div className="relative" ref={campusDropdownRef}>
                        {/* Desktop View - Button with text */}
                        <button 
                            onClick={toggleCampusDropdown}
                            className="hidden md:flex items-center px-3 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors duration-200"
                        >
                            <FaHome className="mr-2 text-gray-700 dark:text-white" />
                            <span className="text-gray-700 dark:text-white font-medium">Campus: {selectedCampus}</span>
                            <IoIosArrowDown clas    sName={`ml-2 text-gray-500 dark:text-gray-300 transition-transform duration-300 ${showCampuses ? 'transform rotate-180' : ''}`} />
                        </button>
                        
                        {/* Mobile View - Just Icon */}
                        <button 
                            onClick={toggleCampusDropdown}
                            className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                            <FaHome className="text-gray-700 dark:text-white" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {showCampuses && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 border border-gray-200 dark:border-gray-700 overflow-hidden transform origin-top-right transition-all duration-200 ease-out">
                                <ul>
                                    {campuses.map((campus) => (
                                        <li 
                                            key={campus}
                                            onClick={() => selectCampus(campus)}
                                            className={`px-4 py-2 flex items-center justify-between cursor-pointer transition-colors duration-200 ${
                                                selectedCampus === campus 
                                                    ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300' 
                                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white'
                                            }`}
                                        >
                                            <span>{campus}</span>
                                            {selectedCampus === campus && (
                                                <FaCheck className="text-blue-500" />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    
                    {/* Mobile Search Icon */}
                    <button 
                        className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" 
                        onClick={toggleSearch}
                    >
                        <FaSearch className='text-gray-700 dark:text-white'/>
                    </button>
                    
                    {/* Theme Toggle Button */}
                    <button 
                        onClick={handleToggleDarkTheme}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                        {darktheme === 'dark' ? (
                            <FaSun className="text-yellow-400" />
                        ) : (
                            <FaMoon className="text-gray-200" />
                        )}
                    </button>
                    
                    {/* Profile Icon with Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={handleProfileClick}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                            <FaUserCircle className="text-gray-700 dark:text-white text-2xl" />
                        </button>
                        
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 border border-gray-200 dark:border-gray-700 overflow-hidden transform origin-top-right transition-all duration-200 ease-out">
                                <ul>
                                    <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center cursor-pointer transition-colors duration-200">
                                        <FaList className="mr-2 text-gray-700 dark:text-gray-300" />
                                        <span className="dark:text-white">My Listings</span>
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center cursor-pointer transition-colors duration-200">
                                        <FaComments className="mr-2 text-gray-700 dark:text-gray-300" />
                                        <span className="dark:text-white">Feedback</span>
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center cursor-pointer transition-colors duration-200">
                                        <FaInfoCircle className="mr-2 text-gray-700 dark:text-gray-300" />
                                        <span className="dark:text-white">About Us</span>
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-red-500 cursor-pointer transition-colors duration-200">
                                        <FaSignOutAlt className="mr-2" />
                                        <span>Logout</span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}