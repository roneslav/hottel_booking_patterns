"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type SearchState = {
  city: string;
  checkIn: string;
  checkOut: string;
  guests: number;
};

type SearchContextType = {
  search: SearchState;
  updateSearch: (updates: Partial<SearchState>) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState<SearchState>({
    city: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const updateSearch = (updates: Partial<SearchState>) => {
    setSearch(prev => ({ ...prev, ...updates }));
  };

  return (
    <SearchContext.Provider value={{ search, updateSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used within SearchProvider");
  return context;
}