import React from "react";
import { Outlet } from "react-router-dom";
import SidebarContent from "./SidebarContent";
// import ChatHeader from "./ChatHeader";

function SupportChat() {
  return (
    <div className="w-full h-screen flex relative rounded-lg">
      {/* Sidebar */}
      <div className="w-[25%] h-[87%] bg-slate-300 rounded-l-lg">
        <SidebarContent />
      </div>

      {/* Chat Area */}
      <div className="w-[75%] bg-green-400-200">
        <div className="h-[87%] bg-slate-200 rounded-r-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default SupportChat;
