import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaChevronDown } from "react-icons/fa";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  // 👉 Replace this with real logged-in user data later
const navigate = useNavigate();

const email = localStorage.getItem("userEmail") || "admin@company.com";

const user = {
  name: email.split("@")[0],
  email
};
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");

  navigate("/");
};

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">

      {/* LEFT */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Dashboard
        </h2>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5">

        {/* SEARCH */}
        <div className="hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-100 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* NOTIFICATION */}
        <div className="relative cursor-pointer">
          <FaBell className="text-gray-500 text-lg hover:text-gray-700 transition" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full"></span>
        </div>

        {/* PROFILE */}
        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-9 h-9 bg-indigo-500 text-white flex items-center justify-center rounded-full text-sm font-semibold">
              {user.name.charAt(0)}
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-700">
                {user.name}
              </p>
              <p className="text-xs text-gray-400">
                {user.email}
              </p>
            </div>

            <FaChevronDown className="text-gray-400 text-xs" />
          </div>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 mt-3 w-52 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50">

              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium text-gray-700">
                  {user.name}
                </p>
                <p className="text-xs text-gray-400">
                  {user.email}
                </p>
              </div>

              <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                Profile
              </button>

              <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                Settings
              </button>

             <button
  onClick={handleLogout}
  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
>
  Logout
</button>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Navbar;