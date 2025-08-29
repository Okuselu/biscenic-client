import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define theme types
export type Theme = 'light' | 'dark';

// Define theme context interface
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Create theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider props
interface ThemeProviderProps {
  children: ReactNode;
}

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize theme from localStorage or default to 'light'
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('biscenic-theme') as Theme;
    return savedTheme || 'light';
  });

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
  };

  // Set specific theme
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Apply theme to document and save to localStorage
  useEffect(() => {
    // Apply theme class to document root
    document.documentElement.setAttribute('data-theme', theme);
    
    // Save theme preference to localStorage
    localStorage.setItem('biscenic-theme', theme);
    
    // Apply theme class to body for global styling
    document.body.className = `theme-${theme}`;
  }, [theme]);

  // Context value
  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;