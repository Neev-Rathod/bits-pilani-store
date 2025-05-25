// src/contexts/ItemsContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ItemsContext = createContext();

export function ItemsProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryCount, setCategoryCount] = useState({});

  useEffect(() => {
    async function fetchItems() {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/items/`
        );
        setItems(data);

        // calculate categoryCount once
        const counts = {};
        data.forEach((item) => {
          counts[item.category] = (counts[item.category] || 0) + 1;
        });
        counts["All Categories"] = data.length;
        setCategoryCount(counts);
      } catch (err) {
        setError("Failed to fetch items.");
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  return (
    <ItemsContext.Provider value={{ items, loading, error, categoryCount }}>
      {children}
    </ItemsContext.Provider>
  );
}
