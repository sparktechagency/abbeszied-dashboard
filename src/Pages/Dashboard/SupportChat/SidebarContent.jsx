import React, { useState, useRef } from "react";
import { Input, Avatar, Badge } from "antd";
import { IoIosSearch } from "react-icons/io";
import { nanoid } from "@reduxjs/toolkit";
import { Link } from "react-router-dom";
import man from "../../../assets/man.png";

function SidebarContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const usersContainerRef = useRef(null);

  // Filter & prioritize searched user
  const filteredUsers = people
    .filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      a.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ? 1 : -1
    );

  return (
    <div className="h-full flex flex-col bg-white rounded-lg border-r">
      {/* Header Section */}
      <div className="flex flex-col justify-start gap-2 p-4 bg-white sticky top-0 z-10 rounded-bl-lg rounded-br-lg rounded-tl-lg">
        <p className="text-[16px] font-semibold text-black">Support Chat</p>
        <Input
          prefix={<IoIosSearch />}
          placeholder="Search..."
          className="h-10 w-[90%] gap-2"
          allowClear
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <p className="text-[#343A40] font-semibold">Recent</p>
      </div>

      {/* Scrollable User List */}
      <div
        ref={usersContainerRef}
        className="bg-white rounded-bl-lg flex-1 overflow-y-auto"
      >
        {filteredUsers.length > 0 ? (
          filteredUsers.map((item) => (
            <Link key={item.id} to={`/chat/${item.id}`} state={{ user: item }}>
              <div className="h-16 border-t hover:bg-slate-50 px-4">
                <div className="flex justify-between py-2.5">
                  <div className="flex items-center gap-2">
                    <Badge
                      dot
                      status="success"
                      className="border-2 rounded-full"
                    >
                      <Avatar src={item.avatar || ""}>
                        {!item.avatar && item.name.charAt(0)}
                      </Avatar>
                    </Badge>
                    <div>
                      <h3>{item.name}</h3>
                      <p>Messages</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 items-center">
                    <p>{item.lastSeen} min ago</p>
                    {item.newMessageCount > 0 && (
                      <p className="rounded-full bg-[#EF476F2E] text-red-500 text-[12px] w-fit px-1.5">
                        {item.newMessageCount}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">No users found</p>
        )}
      </div>
    </div>
  );
}

export default SidebarContent;

// Dummy Data
const people = [...Array(30)].map((_, i) => ({
  id: nanoid(),
  name: `John Doe ${i + 1}`,
  lastSeen: Math.floor(Math.random() * 10) + 1,
  newMessageCount: i % 3 === 0 ? Math.floor(Math.random() * 5) : 0,
  avatar: i % 2 === 0 ? man : "",
}));
