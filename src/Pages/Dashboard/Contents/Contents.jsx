import React, { useState } from "react";

import { Input } from "antd";
import { CiSearch } from "react-icons/ci";
import { LuPlus } from "react-icons/lu";
import ContentModal from "./ContentModal";
import ContentsList from "./ContentsList";

const Head = () => {
  return (
    <div>
      <h1 className="text-dashboard text-[24px] font-medium">Contents</h1>
    </div>
  );
};

const AddCategory = ({ onOpen }) => {
  return (
    <div
      className="w-40 h-[45px] bg-dashboard flex items-center justify-center rounded gap-2 text-white cursor-pointer"
      onClick={onOpen}
    >
      <p>Add Category</p>
      <LuPlus color="white" size={20} />
    </div>
  );
};

export default function Contents() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <div className="flex  items-center justify-between mx-14 mt-24">
        <Head />
        <div className="w-full flex justify-end gap-4">
          <div className=" w-1/4">
            <Input
              placeholder="Search"
              suffix={<CiSearch size={24} />}
              style={{ height: "45px" }}
            />
          </div>

          <AddCategory onOpen={() => setIsModalOpen(true)} />
        </div>
      </div>
      <div className="mt-10">
        <ContentsList />
      </div>

      <ContentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
