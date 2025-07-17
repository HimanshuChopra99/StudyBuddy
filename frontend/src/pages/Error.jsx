import React from "react";
import { IoArrowForward } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center text-3xl h-[calc(100vh-3.5rem)] bg-richblack-900 text-white cursor-default">
      <p>Page Not Found</p>
      <div className="flex relative text-[15rem] font-extrabold">
        <p>404</p>
      </div>
      <button
        className="px-6 py-3 rounded-lg text-xl flex items-center gap-2 bg-richblack-700 text-white"
        onClick={() => navigate("/")}
      >
        <p>Back To Home</p>
        <IoArrowForward />
      </button>
    </div>
  );
};

export default Error;
