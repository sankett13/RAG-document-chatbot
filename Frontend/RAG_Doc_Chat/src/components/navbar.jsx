// components/Navbar.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUserCircle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
// No need to import '../user_dashboard.css' anymore

const Navbar = ({ userName = "User" }) => {
  return (
    <header
      className="
      bg-white p-4 md:px-8 shadow-sm flex justify-between items-center z-10 min-h-[60px]
      dark:bg-gray-800 dark:text-white dark:shadow-md
    "
    >
      <div className="text-xl font-semibold text-gray-800 dark:text-white">
        Welcome,{" "}
        <span className="text-blue-600 dark:text-blue-400">{userName}</span>!
      </div>
      <div className="flex items-center space-x-4">
        {/* Bell Icon */}
        <a
          href="#"
          className="text-gray-500 hover:text-blue-600 text-lg transition-colors duration-200 dark:text-gray-400 dark:hover:text-blue-300"
        >
          <FontAwesomeIcon icon={faBell} />
        </a>
        {/* User Circle Icon */}
        <a
          href="#"
          className="text-gray-500 hover:text-blue-600 text-lg transition-colors duration-200 dark:text-gray-400 dark:hover:text-blue-300"
        >
          <FontAwesomeIcon icon={faUserCircle} />
        </a>
        {/* Logout button - hidden on medium screens and up, visible on small screens */}
        <form action="/user/logout" method="POST">
          <button
            type="submit"
            className="
              flex items-center px-3 py-2 rounded-md
              bg-red-500 text-white text-sm font-medium
              hover:bg-red-600 transition-colors duration-200
              md:hidden {/* This makes it hidden on desktop */}
              dark:bg-red-600 dark:hover:bg-red-700
            "
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
          </button>
        </form>
      </div>
    </header>
  );
};

export default Navbar;
