import { createContext, useContext, useEffect, useMemo, useState } from "react";

const THEME_STORAGE_KEY = "svm-theme-mode";

const ThemeModeContext = createContext({
  themeMode: "dark",
  toggleThemeMode: () => {},
});

const getInitialThemeMode = () => {
  const savedMode = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedMode === "dark" || savedMode === "light") {
    return savedMode;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const ThemeModeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(getInitialThemeMode);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeMode);
    document.documentElement.style.colorScheme = themeMode;
    localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [themeMode]);

  const toggleThemeMode = () => {
    setThemeMode((previousMode) => (previousMode === "dark" ? "light" : "dark"));
  };

  const contextValue = useMemo(
    () => ({
      themeMode,
      toggleThemeMode,
    }),
    [themeMode],
  );

  return <ThemeModeContext.Provider value={contextValue}>{children}</ThemeModeContext.Provider>;
};

export const useThemeMode = () => useContext(ThemeModeContext);
