// src/contexts/ItemsContext.js
import React, { createContext, useState, useEffect, useMemo } from "react";
import axios from "axios";

export const ItemsContext = createContext();

export function ItemsProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchItems() {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/items/`
        );
        setItems(data);
      } catch (err) {
        setError("Failed to fetch items.");
      } finally {
        setLoading(false);
      }
    }
    const user = localStorage.getItem("user");
    if (user) {
      fetchItems();
    }
  }, []);

  // Function to calculate category count based on campus filter
  const getCategoryCount = (selectedCampus) => {
    let filteredItems = items;

    if (selectedCampus !== "All Campuses") {
      filteredItems = items.filter((item) => item.campus === selectedCampus);
    }

    const counts = {};
    filteredItems.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    counts["All Categories"] = filteredItems.length;

    return counts;
  };

  return (
    <ItemsContext.Provider value={{ items, loading, error, getCategoryCount }}>
      {children}
    </ItemsContext.Provider>
  );
}
