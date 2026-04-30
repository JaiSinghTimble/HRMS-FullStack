import React from "react";
import Sidebar from "../Layouts/Sidbar";
import Navbar from "../Layouts/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
<div className="flex-1 flex flex-col min-w-0">        
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
<div className="p-6 overflow-y-auto overflow-x-hidden">          {children}
        </div>

      </div>
    </div>
  );
};

export default MainLayout;