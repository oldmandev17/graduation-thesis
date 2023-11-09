import React from "react";
import {
  AiOutlineSearch,
  AiOutlineBell,
  AiOutlineMail,
  AiOutlineHeart,
} from "react-icons/ai";

function Header() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-4 py-5  items-center px-28 ">
        <img src="/Fiverr-Logo.png" alt="logo" width="80" height="80" />
        <div className="flex flex-row w-full">
          <input
            type="text"
            className=" text-lg w-full h-12 border border-1 border-gray-300 rounded-lg rounded-r-none text-gray-900 py-0 pl-5 focus:rounded-none  "
            placeholder="what service are you looking for today?"
          />
          <span className="bg-black w-16 flex flex-col justify-center pl-5 rounded-l-none rounded-r-lg cursor-pointer ">
            <AiOutlineSearch className="fill-white w-6 h-6" />
          </span>
        </div>
        <div className="flex flex-row justify-between">
          <span className=" flex flex-row justify-center items-center h-9 w-9 hover:rounded-full hover:bg-gray-100 ">
            <AiOutlineBell className="fill-gray-400 w-6 h-6 cursor-pointer" />
          </span>
          <span className=" flex flex-row justify-center items-center h-9 w-9 hover:rounded-full hover:bg-gray-100 ">
            <AiOutlineMail className="fill-gray-400 w-6 h-6 cursor-pointer" />
          </span>
          <span className=" flex flex-row justify-center items-center h-8 w-8 ">
            <AiOutlineHeart className="fill-gray-400 w-6 h-6  cursor-pointer" />
          </span>
        </div>
        <div className="text-gray-400 text-lg font-bold hover:text-green-500 cursor-pointer">
          Orders
        </div>
        <div className="flex flex-row justify-center w-24 ">
          <img
            src="./roses.jpg"
            alt="avata"
            className=" rounded-full h-10 w-10 cursor-pointer"
          />
        </div>
      </div>
      <div className="flex flex-row border border-y-2 border-gray-100  px-28  justify-between">
        <span className="flex items-center h-10 font-semibold  text-gray-600 text-base cursor-pointer border-b-4 border-white  hover:border-green-500">
          Graphics & Design
        </span>
        <span className="flex items-center h-10 font-semibold  text-gray-600 text-base cursor-pointer border border-t-0 border-x-0 border-b-4 border-white  hover:border-green-500">
          Graphics & Design
        </span>
        <span className="flex items-center h-10 font-semibold  text-gray-600 text-base cursor-pointer border border-t-0 border-x-0 border-b-4 border-white  hover:border-green-500">
          Graphics & Design
        </span>
        <span className="flex items-center h-10 font-semibold  text-gray-600 text-base cursor-pointer border border-t-0 border-x-0 border-b-4 border-white  hover:border-green-500">
          Graphics & Design
        </span>
        <span className="flex items-center h-10 font-semibold  text-gray-600 text-base cursor-pointer border border-t-0 border-x-0 border-b-4 border-white  hover:border-green-500">
          Graphics & Design
        </span>
        <span className="flex items-center h-10 font-semibold  text-gray-600 text-base cursor-pointer border border-t-0 border-x-0 border-b-4 border-white  hover:border-green-500">
          Graphics & Design
        </span>
      </div>
    </div>
  );
}

export default Header;
