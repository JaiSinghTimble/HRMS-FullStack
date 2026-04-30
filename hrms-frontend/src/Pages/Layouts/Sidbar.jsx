import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaUserPlus,
  FaCalendarAlt,
  FaBriefcase,
} from "react-icons/fa";

const Sidebar = () => {
  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "Candidates", path: "/candidates", icon: <FaUsers /> },
    { name: "Onboarding", path: "/onboarding", icon: <FaUserPlus /> },
    { name: "Leave", path: "/leave", icon: <FaCalendarAlt /> },
    { name: "Jobs", path: "/jobs", icon: <FaBriefcase /> },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col px-5 py-6">

      {/* LOGO */}
      <div className="mb-10">
        <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
          HRMS
        </h1>
        <p className="text-xs text-gray-400">Management System</p>
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-2">
        {menu.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200
              
              ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 font-medium border-l-4 border-indigo-500"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* BOTTOM CARD (optional but modern touch) */}
      <div className="mt-auto bg-indigo-50 p-4 rounded-xl">
        <p className="text-sm text-gray-700 font-medium">
          Need Help?
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Check documentation or contact support.
        </p>
        <button className="mt-3 text-xs bg-indigo-500 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-600 transition">
          Support
        </button>
      </div>

    </div>
  );
};

export default Sidebar;