
import React from "react";

export type Themes = "dark" | "light" | "system"

type Theme = {
  theme: Themes;
  changeTheme: (t: Themes) => void; 
}

export const ThemeContext = React.createContext<Theme>({
  theme: "light",
  changeTheme: () => {}
});

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [theme, setTheme] = React.useState<Themes>("dark");

  const changeTheme = React.useCallback((theme: Themes) => {
    setTheme(theme);
    localStorage.setItem("theme", theme);
  }, []);

  React.useEffect(() => {
    const html = document.documentElement;
    const storedTheme = localStorage.getItem("theme");
    html.classList.remove("dark", "light");

    if ((!storedTheme) || storedTheme === "system") {
      const query = window.matchMedia("(prefers-color-scheme: dark)");
      if (query.matches) {
        html.classList.add("dark");
      } else {
        html.classList.add("light");
      }
    } else if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
      html.classList.add(storedTheme);
    }
  }, [theme, changeTheme]);

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};