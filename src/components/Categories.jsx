import React from 'react';
import { FiMonitor, FiCoffee, FiBook, FiActivity, FiImage, FiUsers, FiSmartphone, FiMoreVertical } from 'react-icons/fi';
import { FaGuitar, FaBed } from "react-icons/fa";
import { useNavigate } from "react-router-dom"



const categoryIcons = {
    "Electronics & Gadgets": FiMonitor,
    "Kitchen & Cooking": FiCoffee,
    "Books & Study Materials": FiBook,
    "Sports & Fitness Gear": FiActivity,
    "Musical Instruments": FaGuitar,
    "Dorm & Bedroom Essentials": FaBed,
    "Room Decor": FiImage,
    "Community & Shared Resources": FiUsers,
    "Digital Subscriptions & Accounts": FiSmartphone,
    "Others": FiMoreVertical,
};

const Categories = ({selectedCategory, setSelectedCategory}) => {
    const navigate = useNavigate();

    const categories = [
        "Electronics & Gadgets",
        "Kitchen & Cooking",
        "Books & Study Materials",
        "Sports & Fitness Gear",
        "Musical Instruments",
        "Dorm & Bedroom Essentials",
        "Room Decor",
        "Community & Shared Resources",
        "Digital Subscriptions & Accounts",
        "Others"
    ];

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 transition-colors duration-300 overflow-auto" style={{height:'calc(100vh - 120px)'}}>
            <h1 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">Browse Categories</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((category, index) => {
                    const IconComponent = categoryIcons[category] || FiSmartphone;
                    return (
                        <div
                            key={index}
                            onClick={() => {setSelectedCategory(category);navigate('/')}}
                            className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center transform transition-transform hover:scale-105 cursor-pointer"
                        >
                            <IconComponent className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{category}</h2>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Categories;