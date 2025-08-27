import React from "react";
import { Avatar, Badge } from "antd";
import { useLocation } from "react-router-dom";
function ChatHeader() {
  const location = useLocation();
  const user = location.state?.user || {};
  console.log("usersss", user.name);
  return (
    <div className="flex items-center gap-3 h-full">
      <Badge
        dot
        status="success"
        style={{
          width: 15,
          height: 15,
          marginTop: 10,
        }}
      >
        <Avatar
          src={user.image}
          size={60}
          //   className="outline outline-2 outline-slate-600 outline-offset-2 bg-slate-50 ml-4"
          className="bg-slate-50 ml-4"
        />
      </Badge>
      {/* <h2>{user.name}</h2> */}
    </div>
  );
}

export default ChatHeader;
