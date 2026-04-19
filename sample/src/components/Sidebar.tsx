import { FileText, CheckSquare, Clock, Settings as Cog } from "lucide-react";

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const links = [
    { id: "upload", label: "Upload", icon: <FileText size={20} /> },
    { id: "review", label: "Review", icon: <CheckSquare size={20} /> },
    { id: "history", label: "History", icon: <Clock size={20} /> },
    { id: "settings", label: "Settings", icon: <Cog size={20} /> },
  ];

  return (
    <nav className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-gray-200 dark:border-gray-700">
        Code Review
      </div>

      <ul className="flex flex-col flex-grow">
        {links.map(({ id, label, icon }) => (
          <li key={id}>
            <button
              onClick={() => setCurrentPage(id)}
              className={`flex items-center w-full gap-3 p-4 hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
                currentPage === id
                  ? "bg-gray-300 dark:bg-gray-600 font-semibold"
                  : ""
              }`}
            >
              {icon} {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
