import { Sun, Moon } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="flex justify-between items-center bg-white dark:bg-gray-800 px-6 py-4 shadow-md">
      <h1 className="text-xl font-bold">AI Code Review Agent</h1>
      <button
        onClick={toggleDarkMode}
        aria-label="Toggle Dark Mode"
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  );
}
