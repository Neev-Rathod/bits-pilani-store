import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiChevronLeft, FiChevronRight, FiCalendar, FiHome, FiPhone, FiTag, FiDollarSign, FiUser } from 'react-icons/fi';
import { FaSort, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

// Sample data for hosteller items
const itemsData = [
  {
    id: 1,
    itemName: "Table Fan",
    itemImage: "https://bits-pilani.store/media/images/1000432916.jpg", 
    itemPrice: 800,
    sellerName: "Rohit Sharma",
    sellerHostel: "AH-4",
    dateAdded: "2025-05-12T15:30:00",
    contactNumber: "9876543210",
    category: "Electronics & Gadgets"
  },
  {
    id: 2,
    itemName: "Single Mattress",
    itemImage: "https://bits-pilani.store/media/images/1000380153.jpg",
    itemPrice: 1200,
    sellerName: "Priya Patel",
    sellerHostel: "Ch-7",
    dateAdded: "2025-05-14T10:15:00",
    contactNumber: "9876512340",
    category: "Dorm & Bedroom Essentials"
  },
  {
    id: 3,
    itemName: "Electric Kettle",
    itemImage: "https://bits-pilani.store/media/images/IMG_9977.jpg",
    itemPrice: 600,
    sellerName: "Arjun Singh",
    sellerHostel: "Ah-3",
    dateAdded: "2025-05-15T17:45:00",
    contactNumber: "9876598760",
    category: "Kitchen & Cooking"
  },
  {
    id: 4,
    itemName: "DME Textbook",
    itemImage: "https://bits-pilani.store/media/images/WhatsApp_Image_2025-05-08_at_10_5H4bVtE.jpg",
    itemPrice: 350,
    sellerName: "Neha Gupta",
    sellerHostel: "Ch-4",
    dateAdded: "2025-05-10T12:00:00",
    contactNumber: "9871234560",
    category: "Books & Study Materials"
  },
  {
    id: 5,
    itemName: "Bedside Lamp",
    itemImage: "https://bits-pilani.store/media/images/1000380136.jpg",
    itemPrice: 450,
    sellerName: "Rajesh Kumar",
    sellerHostel: "Ah-9",
    dateAdded: "2025-05-11T09:30:00",
    contactNumber: "9876543111",
    category: "Room Decor"
  },
  {
    id: 6,
    itemName: "Yoga Mat",
    itemImage: "https://bits-pilani.store/media/images/IMG_7006.jpg",
    itemPrice: 300,
    sellerName: "Ananya Desai",
    sellerHostel: "Ch-4",
    dateAdded: "2025-05-15T14:20:00",
    contactNumber: "9876123450",
    category: "Sports & Fitness Gear"
  },
  {
    id: 7,
    itemName: "Guitar",
    itemImage: "https://bits-pilani.store/media/images/Screenshot_20250512_070713_Amazon.jpg",
    itemPrice: 2500,
    sellerName: "Vikram Nair",
    sellerHostel: "dh-5",
    dateAdded: "2025-05-08T16:45:00",
    contactNumber: "9870123456",
    category: "Musical Instruments"
  },
  {
    id: 8,
    itemName: "Netflix Account Sharing",
    itemImage: "https://images.ctfassets.net/4cd45et68cgf/Rx83JoRDMkYNlMC9MKzcB/2b14d5a59fc3937afd3f03191e19502d/Netflix-Symbol.png?w=700&h=456",
    itemPrice: 150,
    sellerName: "Sneha Reddy",
    sellerHostel: "Ch-4",
    dateAdded: "2025-05-16T08:15:00",
    contactNumber: "9876987650",
    category: "Digital Subscriptions & Accounts"
  },
  {
    id: 9,
    itemName: "Mini Fridge",
    itemImage: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQuFWZc6RdgO_c0-L9Q19eIZH3qPmj2ExM794zl3r3wx4XuCaLecK5zDh0FnRyeRXRzzdHibPDdpoxfJUvhPABFCdfKK6xcKsnNHNfKIsqGJiLVSWzlc3ES-NFzv1-y6esQJHiCfMcucA&usqp=CAc",
    itemPrice: 3500,
    sellerName: "Aditya Rao",
    sellerHostel: "Ah-2",
    dateAdded: "2025-05-13T11:30:00",
    contactNumber: "9876554321",
    category: "Electronics & Gadgets"
  },
  {
    id: 10,
    itemName: "Room Curtains",
    itemImage: "https://bits-pilani.store/media/images/IMG_1101.jpg",
    itemPrice: 700,
    sellerName: "Divya Shah",
    sellerHostel: "Ch-7",
    dateAdded: "2025-05-09T13:00:00",
    contactNumber: "9876543222",
    category: "Room Decor"
  },
  {
    id: 11,
    itemName: "Study Table Lamp",
    itemImage: "https://bits-pilani.store/media/images/Screenshot_2025-05-03-17-46-33-80_6012fa4d4ddec268fc5c7112cbb265e7.jpg",
    itemPrice: 550,
    sellerName: "Rahul Verma",
    sellerHostel: "Dh-5",
    dateAdded: "2025-05-14T19:20:00",
    contactNumber: "9876123456",
    category: "Electronics & Gadgets"
  },
  {
    id: 12,
    itemName: "Kettle",
    itemImage: "https://bits-pilani.store/media/images/17466152240001379859746754443463.jpg",
    itemPrice: 900,
    sellerName: "Meera Kapoor",
    sellerHostel: "Ch-3",
    dateAdded: "2025-05-12T10:40:00",
    contactNumber: "9876543999",
    category: "Kitchen & Cooking"
  },
  {
    id: 13,
    itemName: "Cricket Bat",
    itemImage: "https://bits-pilani.store/media/images/WhatsApp_Image_2025-04-29_at_00.jpg",
    itemPrice: 1200,
    sellerName: "Farhan Ahmed",
    sellerHostel: "Ch-1",
    dateAdded: "2025-05-10T16:15:00",
    contactNumber: "9876543000",
    category: "Sports & Fitness Gear"
  },
  {
    id: 14,
    itemName: "Keyboard",
    itemImage: "https://bits-pilani.store/media/images/image_Xiv40Rs.jpg",
    itemPrice: 800,
    sellerName: "Tanya Sharma",
    sellerHostel: "Ch-4",
    dateAdded: "2025-05-15T09:10:00",
    contactNumber: "9870123456",
    category: "Electronics & Gadgets"
  },
  {
    id: 15,
    itemName: "Dumbell",
    itemImage: "https://bits-pilani.store/media/images/174674711184913259707863620707.jpg",
    itemPrice: 450,
    sellerName: "Varun Mehta",
    sellerHostel: "Ah-7",
    dateAdded: "2025-05-11T14:30:00",
    contactNumber: "9876123789",
    category: "Room Decor"
  }
];

const categories = [
  "All Categories",
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

const ITEMS_PER_PAGE = 6;

const Home = ({ searchVal = "" ,selectedCategory,setSelectedCategory}) => {
  const [items, setItems] = useState(itemsData);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter and sort items based on search, category, and sort type
  useEffect(() => {
    let result = [...itemsData];
    
    // Filter by search term
    if (searchVal && searchVal.trim() !== "") {
      const searchTerm = searchVal.toLowerCase();
      result = result.filter(item => 
        item.itemName.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        item.sellerName.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by category
    if (selectedCategory !== "All Categories") {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    // Sort items
    if (sortType === "newest") {
      result.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    } else if (sortType === "priceAsc") {
      result.sort((a, b) => a.itemPrice - b.itemPrice);
    } else if (sortType === "priceDesc") {
      result.sort((a, b) => b.itemPrice - a.itemPrice);
    }
    
    setFilteredItems(result);
    setCurrentPage(1); // Reset to first page after filtering
  }, [searchVal, selectedCategory, sortType]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  
  // Get current items
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Container variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2 // Stagger children animations by 0.2s
      }
    }
  };

  // Item variants for animation
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      }
    }
  };

  return (
    <div style={{height:"calc(100vh - 120px)"}} className='overflow-auto'>
      <div className="p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white"
          >
            Campus Marketplace
          </motion.h1>
          {/* Dark mode toggle removed as per instruction */}
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
          >
            <FiFilter className="text-white" /> {isFilterOpen ? "Hide Filters" : "Show Filters"}
          </motion.button>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="w-full sm:w-auto pl-8 pr-4 py-2 bg-white dark:text-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg appearance-none focus:outline-none focus:border-blue-500 shadow-sm"
              >
                <option value="newest">Newest First</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
              <FaSort className="absolute left-2 top-3 text-gray-500 dark:text-gray-400" />
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 w-full sm:w-auto text-left sm:text-right">
              Showing {filteredItems.length} items
            </div>
          </div>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-white">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedCategory === category
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      } transition-colors hover:bg-blue-400 dark:hover:bg-blue-700`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Items grid */}
        {currentItems.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {currentItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col"
              >
                <div className="relative h-76 overflow-hidden">
                  <img
                    src={item.itemImage}
                    alt={item.itemName}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  
                  />
                  <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/70 to-transparent p-3">
                    <div className="flex items-center gap-1 text-white">
                      <FiTag className="text-blue-300" />
                      <span className="text-xs">{item.category}</span>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-md">
             
                    ₹{" "}{item.itemPrice}
                  </div>
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">{item.itemName}</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FiUser className="text-blue-500" />
                      <span>{item.sellerName} ({item.sellerHostel})</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FiPhone className="text-blue-500" />
                      <span>{item.contactNumber}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FiCalendar className="text-blue-500" />
                      <span>{formatDate(item.dateAdded)}</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <FiPhone className="text-white" /> Contact Seller
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600 dark:text-gray-400">No items found matching your criteria.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md bg-gray-200 dark:text-white dark:bg-gray-700 disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <FiChevronLeft />
              </button>
              
              <div className="flex flex-wrap items-center gap-1">
                {[...Array(totalPages).keys()].map(number => {
                  // Show limited page numbers on mobile
                  if (window.innerWidth < 640) {
                    if (
                      number + 1 === 1 ||
                      number + 1 === totalPages ||
                      (number + 1 >= currentPage - 1 && number + 1 <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={number + 1}
                          onClick={() => paginate(number + 1)}
                          className={`w-8 h-8 flex items-center justify-center rounded-md ${
                            currentPage === number + 1
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                          } transition-colors`}
                        >
                          {number + 1}
                        </button>
                      );
                    } else if (
                      (number + 1 === currentPage - 2 && currentPage > 3) ||
                      (number + 1 === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return <span key={`ellipsis-${number}`}>...</span>;
                    }
                    return null;
                  }
                  
                  // Show all page numbers on larger screens
                  return (
                    <button
                      key={number + 1}
                      onClick={() => paginate(number + 1)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md ${
                        currentPage === number + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                      } transition-colors`}
                    >
                      {number + 1}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 dark:text-white disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <FiChevronRight />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;