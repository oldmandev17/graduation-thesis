import React, { useEffect, useState } from "react";

import {
  AiOutlineUser,
  AiOutlineEyeInvisible,
  AiOutlineEye,
} from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { IoCloseSharp } from "react-icons/io5";

function LoginPage() {
  const [show, setShow] = useState<boolean>(false);
  const [icon, setIcon] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (event.target.id !== "username") {
        setIcon(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className="flex flex-col align-middle">
      <div className="flex flex-col  items-center px-60 ">
        <p className=" text-white font-bold text-5xl py-2">Welcome</p>
        <p className=" text-white text-xs">
          We are glad to see you back with us
        </p>
      </div>
      <div className="flex flex-col justify-between py-7 px-52  gap-5  ">
        <div className="relative block bg-white-500  " id="divUsername">
          <span className="absolute inset-y-0 left-0 flex items-center pl-5">
            <AiOutlineUser className="h-5 w-5 fill-black " />
          </span>
          <input
            type="text"
            className="bg-white  text-black  w-full rounded-md py-2 pl-12 pr-10 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm placeholder:text-xs  "
            id="username"
            placeholder="Username"
            onFocus={() => setIcon(true)}
            onClick={() => setIcon(true)}
            onChange={(e) => {
              setText(e.target.value);
              setIcon(text !== "" && true);
            }}
            value={text}
          />

          <span className="absolute inset-y-0 right-0 flex items-center pr-3">
            {text !== "" && icon && (
              <IoCloseSharp
                onClick={() => setText("")}
                className="h-5 w-5 fill-black"
              />
            )}
          </span>
        </div>
        <div className="relative block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-5">
            <RiLockPasswordLine className="h-5 w-5 fill-black " />
          </span>
          <input
            type={show ? "text" : "password"}
            className="bg-white text-black  w-full rounded-md py-2 pl-12 pr-10 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm placeholder:text-xs  "
            id="password"
            placeholder="Password"
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-3">
            {show ? (
              <AiOutlineEyeInvisible
                onClick={() => setShow(!show)}
                className="h-5 w-5 fill-black "
              />
            ) : (
              <AiOutlineEye
                onClick={() => setShow(!show)}
                className="h-5 w-5 fill-black "
              />
            )}
          </span>
        </div>
        <button
          type="button"
          className="text-yellow-100  p-3 rounded-lg text-sm font-extrabold bg-[#1dbf73] hover:bg-green-500 "
        >
          NEXT
        </button>
        <div className="flex justify-end">
          <span className="cursor-pointer text-xs text-white">
            Forgot Password
          </span>
        </div>
        <div className=" hr-sect">
          <div className="font-bold text-xs">
            <div className=" text-white text-xs">
              <b>Login</b> with Others
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center border rounded-xl border-white hover:bg-gray-300 ">
          <button
            type="button"
            className="flex justify-center w-full gap-1 px-6 py-2 text-gray-800"
          >
            <span className="flex  inset-y-0 left-0  items-center">
              <FcGoogle className="h-6 w-6 " />
            </span>
            <span className="text-sm text-white">
              login with
              <span className="font-bold text-white text-sm"> google </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
