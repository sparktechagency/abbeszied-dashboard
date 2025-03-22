import { React, useState } from "react";
import { Input } from "antd";
import { IoCloseCircleOutline } from "react-icons/io5";
import { LuPlus } from "react-icons/lu";

import { Button } from "antd";
import TextEditor from "./TextEditor";

const { TextArea } = Input;

const onChange = (e) => {
  console.log("Change:", e.target.value);
};

export default function ContentsForm() {
  return (
    <div className="h-90% flex flex-col gap-10 ">
      <div className="flex justify-between mt-3 relative">
        <div className="w-[425px] h-[148px] flex flex-col justify-between">
          <div>
            <p className="text-[12px]">
              Categoy Name(<span style={{ color: "red" }}>*</span>)
            </p>
            <Input className=" w-full min-w-32 h-11" />
          </div>
          <div>
            <p className="text-[12px]">
              Choose icon(<span style={{ color: "red" }}>*</span>)
            </p>
            <Input
              className=" w-full min-w-32 h-11"
              suffix={
                <button className="bg-[#d9d9d9] px-2 py-1 rounded border border-1 border-black">
                  Choose File
                </button>
              }
            />
          </div>
          <p className="text-[9px] text-[#7E7E7E] ">Note : Only PNG format.</p>
        </div>
        <div className="w-[425px] h-[130px] flex flex-col justify-between">
          <p className="text-[12px]">Category Tips</p>
          <TextArea
            showCount
            // maxLength={100}
            onChange={onChange}
            placeholder="disable resize"
            style={{
              height: 140,
              resize: "none",
            }}
          />
        </div>
      </div>
      <hr className="m-0"></hr>
      {/* <TextEditor /> */}
      <div className="w-full h-full flex flex-col items-center justify-between">
        <div className="w-full h-auto flex items-center justify-between">
          <h1 className="text-[20px]">Contents</h1>
          <Button
            icon={<LuPlus size={16} />}
            size="large"
            className="bg-transparent border-black"
          >
            Add New Content
          </Button>
        </div>
        <div className="w-full flex justify-between mt-2">
          <div className="w-[48%] h-auto bg-[#E6F4FD] p-6 rounded-xl relative">
            <div>
              <p className="text-[12px]">
                Header(<span style={{ color: "red" }}>*</span>)
              </p>
              <Input placeholder="sjdfh" className="w-full min-w-32 h-11" />
            </div>
            <div className="mt-2">
              <p className="text-[12px]">
                Content(<span style={{ color: "red" }}>*</span>)
              </p>
              <TextEditor />
            </div>
            <Button block className="mt-2 bg-[#023F86] text-white ">
              Save
            </Button>
            <button className="absolute top-3 right-3">
              <IoCloseCircleOutline size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
