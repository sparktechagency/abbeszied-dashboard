import React from "react";
import SidebarContent from "./SidebarContent";
// import { Outlet, useParams } from "react-router-dom";
import ChatRoom from "./ChatRoom";
import ChatHeader from "./ChatHeader";

function SupportChat() {
  return (
    <div className="w-full h-screen flex relative rounded-lg">
      {/* Sidebar */}
      <div className="w-[25%] h-[87%] bg-slate-300  rounded-l-lg">
        <SidebarContent />
      </div>

      {/* Chat Area */}
      <div className="w-[75%] bg-green-400-200">
        {/* <div className="h-[100px] bg-blue-400">
          <ChatHeader />
        </div> */}
        <div className="h-[87%] bg-slate-200 rounded-r-lg">
          <ChatRoom />
          {/* <Outlet /> */}
        </div>
        {/* <div className="w-full absolute bottom-0 h-[100px] bg-amber-400">
          keyboard
        </div> */}
      </div>
    </div>
  );
}

export default SupportChat;
