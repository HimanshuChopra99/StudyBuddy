import React from "react";
import Button from "./Button";
import { TypeAnimation } from "react-type-animation";
import { FaArrowRight } from "react-icons/fa";

const CodeBlocks = ({
  position,
  heading,
  subheading,
  btn1,
  btn2,
  codeblock,
  bgGradiant1,
  bgGradiant2,
  backgroundGradient,
  codeColor,
}) => {
  return (
    <div
      className={`flex ${position} my-20 justify-between flex-col lg:gap-30 gap-10 w-12/12 `}
    >
      {/* Section 1  */}
      <div className="w-[100%] lg:w-[55%] flex flex-col gap-8 ">
        {heading}

        {/* Sub Heading */}
        <div className="text-richblack-300 text-base font-medium w-[80%] -mt-3">
          {subheading}
        </div>

        {/* Button Group */}
        <div className="flex flex-col sm:flex-row gap-7 mt-1">
          <Button active={btn1.active} linkto={btn1.link} className="w-30 h-20 ">
            <div className="flex items-center gap-2">
              {btn1.btnText}
              <FaArrowRight />
            </div>
          </Button>
          <Button active={btn2.active} linkto={btn2.link}>
            {btn2.btnText}
          </Button>
        </div>
      </div>

      {/* Section 2 */}

      <div className="relative lg:w-1/2">
        <div className={`absolute h-60 blur-2xl w-60 ${bgGradiant1} opacity-50 rounded-full left-0 top-10 infinity-float`}></div>
        <div className={`absolute h-20 blur-2xl w-20 ${bgGradiant2} opacity-50 rounded-full left-100 top-0 infinity-float`}></div>
        <div className="reactCode h-fit code-border flex flex-row py-3 text-[10px] sm:text-sm leading-[18px] sm:leading-6 relative w-[100%] lg:w-[470px]">
          {backgroundGradient}
          {/* Indexing */}
          <div className="text-center flex flex-col w-[10%] select-none text-richblack-400 font-inter font-bold ">
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
            <p>6</p>
            <p>7</p>
            <p>8</p>
            <p>9</p>
            <p>10</p>
            <p>11</p>
          </div>

          {/* Codes */}
          <div
            className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-1`}
          >
            <TypeAnimation
              sequence={[codeblock, 1000, ""]}
              cursor={true}
              repeat={Infinity}
              style={{
                whiteSpace: "pre-line",
                display: "block",
              }}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
        s
      </div>
    </div>
  );
};

export default CodeBlocks;
