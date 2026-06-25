import { createContext, useState, useCallback } from "react";

export const MovieContext = createContext(null);

export const MovieProvider = ({ children }) => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const clearFilters = useCallback(() => {
    setSelectedGenre(null);
    setSearchQuery("");
  }, []);

  return (
    <MovieContext.Provider
      value={{
        selectedGenre,
        setSelectedGenre,
        searchQuery,
        setSearchQuery,
        clearFilters,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};
