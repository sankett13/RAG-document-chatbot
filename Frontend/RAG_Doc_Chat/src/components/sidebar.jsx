// components/Sidebar.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faFileUpload,
  faCog,
  faInfoCircle,
  faFilePdf,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
// No need to import '../user_dashboard.css' anymore, as we're using Tailwind CSS

const Sidebar = ({
  activePage,
  documents = [],
  userName,
  onDocumentSelect,
}) => {
  return (
    <aside
      className="
      w-64 min-w-64 bg-gray-800 text-gray-100 p-6 shadow-lg z-20
      dark:bg-gray-900 dark:shadow-xl
      hidden md:flex flex-col {/* HIDDEN on small screens, FLEX (column) on medium and larger */}
    "
    >
      {/* Sidebar Header */}
      <div className="text-center pb-6 mb-6 border-b border-gray-700">
        <h3 className="text-3xl font-bold text-blue-400">Dashboard</h3>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-grow">
        {" "}
        {/* flex-grow allows nav to take available space */}
        <ul>
          {/* Home Link */}
          <li>
            <a
              href="/user/dashboard"
              className={`
                flex items-center p-3 mb-2 rounded-md transition-colors duration-200
                hover:bg-gray-700 hover:text-blue-300
                dark:hover:bg-gray-700 dark:hover:text-blue-300
                ${
                  activePage === "dashboard"
                    ? "bg-gray-700 text-blue-300 border-l-4 border-blue-400 pl-2"
                    : "text-gray-200"
                }
              `}
            >
              <FontAwesomeIcon icon={faHome} className="mr-3 text-lg" /> Home
            </a>
          </li>
          {/* Upload Document Link */}
          <li>
            <a
              href="/user/dashboard"
              className={`
                flex items-center p-3 mb-2 rounded-md transition-colors duration-200
                hover:bg-gray-700 hover:text-blue-300
                dark:hover:bg-gray-700 dark:hover:text-blue-300
                ${
                  activePage === "upload"
                    ? "bg-gray-700 text-blue-300 border-l-4 border-blue-400 pl-2"
                    : "text-gray-200"
                }
              `}
            >
              <FontAwesomeIcon icon={faFileUpload} className="mr-3 text-lg" />{" "}
              Upload Document
            </a>
          </li>
          {/* Settings Link */}
          <li>
            <a
              href="#"
              className="
                flex items-center p-3 mb-2 rounded-md transition-colors duration-200
                text-gray-200 hover:bg-gray-700 hover:text-blue-300
                dark:hover:bg-gray-700 dark:hover:text-blue-300
              "
            >
              <FontAwesomeIcon icon={faCog} className="mr-3 text-lg" /> Settings
            </a>
          </li>
          {/* Help Link */}
          <li>
            <a
              href="#"
              className="
                flex items-center p-3 mb-2 rounded-md transition-colors duration-200
                text-gray-200 hover:bg-gray-700 hover:text-blue-300
                dark:hover:bg-gray-700 dark:hover:text-blue-300
              "
            >
              <FontAwesomeIcon icon={faInfoCircle} className="mr-3 text-lg" />{" "}
              Help
            </a>
          </li>

          {/* Documents Category */}
          <li
            className="
            text-gray-400 text-xs uppercase tracking-wider mt-6 pt-4 border-t border-gray-700
            px-3 mb-3
          "
          >
            Your Documents
          </li>

          {/* User Documents List */}
          <div
            id="userDocumentsList"
            className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2"
          >
            {/* Scrollbar Styling - Add to your main CSS file (e.g., index.css) if you want custom scrollbars and have installed a Tailwind scrollbar plugin, or define them directly in CSS: */}
            {/* Example custom CSS for scrollbars (add to your global CSS file, NOT in JSX):
            .document-list-scroll::-webkit-scrollbar {
                width: 6px;
            }
            .document-list-scroll::-webkit-scrollbar-thumb {
                background-color: #555;
                border-radius: 3px;
            }
            .document-list-scroll::-webkit-scrollbar-track {
                background-color: #333;
            }
            */}

            {/* Correct JSX Conditional Rendering */}
            {documents.length > 0 ? (
              documents.map((doc) => (
                <li className="mb-2" key={doc._id}>
                  <button
                    onClick={() => onDocumentSelect && onDocumentSelect(doc)}
                    title={doc.filename}
                    id={doc._id}
                    className="
                      flex items-center p-2 rounded-md transition-colors duration-200
                      text-gray-300 hover:bg-gray-700 hover:text-blue-300 text-sm
                      whitespace-nowrap overflow-hidden text-ellipsis w-full text-left
                      dark:hover:bg-gray-700 dark:hover:text-blue-300
                    "
                  >
                    <FontAwesomeIcon
                      icon={faFilePdf}
                      className="mr-2 text-red-400 text-base"
                    />
                    {doc.filename.length > 20
                      ? doc.filename.substring(0, 17) + "..."
                      : doc.filename}
                  </button>
                </li>
              ))
            ) : (
              <li className="text-gray-400 text-sm italic px-3 py-2">
                No documents uploaded yet.
              </li>
            )}
          </div>
        </ul>
      </nav>

      {/* Sidebar Footer (Logout) */}
      <div className="mt-auto pt-6 border-t border-gray-700 text-center">
        <form action="http://localhost:3000/user/logout" method="POST">
          <button
            type="submit"
            className="
              flex items-center justify-center w-full px-4 py-2 rounded-md
              bg-red-600 text-white font-medium text-base
              hover:bg-red-700 transition-colors duration-200
              dark:bg-red-700 dark:hover:bg-red-800
            "
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
          </button>
        </form>
      </div>
    </aside>
  );
};

export default Sidebar;
