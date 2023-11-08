import React, { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";

function ForgotPasswordPage() {
  const [icon, setIcon] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  return (
    <div className="bg-[#093f25] w-full h-screen">
      <div className="flex flex-col items-center   pt-56 gap-5 p-5  ">
        <div className="text-white font-bold text-4xl">
          Forgot Your Password?
        </div>
        <div className="relative block bg-white-500  " id="divUsername">
          <span className="absolute  flex items-center left-5 top-2">
            <AiOutlineUser className="h-5 w-5 fill-black " />
          </span>
          <input
            type="text"
            className="bg-white  text-black  w-64 rounded-md py-2 pl-12 pr-10 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm placeholder:text-xs  "
            id="username"
            placeholder="Input your email address"
            onFocus={() => setIcon(true)}
            onClick={() => setIcon(true)}
            onChange={(e) => {
              setText(e.target.value);
              setIcon(text !== "" && true);
            }}
            value={text}
          />

          <span className="absolute flex items-center left-56 top-2">
            {text !== "" && icon && (
              <IoCloseSharp
                onClick={() => setText("")}
                className="h-5 w-5 fill-black"
              />
            )}
          </span>
        </div>
        <button
          type="button"
          className="h-7 w-20 rounded-md font-semibold text-white text-sm bg-[#1dbf73] hover:bg-green-500"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
