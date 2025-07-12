import { FcGoogle } from "react-icons/fc";
import { useSelector } from "react-redux";

import frameImg from "../../../assets/Images/frame.png";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

function Template({ title, description1, description2, image, formType }) {
  const { loading } = useSelector((state) => state.auth);

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900  mx-10">
      {loading ? (
        <div className="dots-container">
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-12 py-10 md:flex-row-reverse md:items-start md:justify-center">
          {/* Right Side - Image */}
          <div className="relative w-full max-w-[550px] hidden lg:block ">
            <img
              src={frameImg}
              alt="Pattern"
              loading="lazy"
              className="w-full h-auto object-contain"
            />
            <img
              src={image}
              alt="Students"
              loading="lazy"
              className="absolute top-0 right-0 z-10 w-[90%] md:w-[95%]"
            />
          </div>

          {/* Left Side - Text + Form */}
          <div className="w-full max-w-[500px] text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl font-semibold text-richblack-5 leading-snug">
              {title}
            </h1>
            <p className="mt-4 text-lg text-richblack-100 leading-relaxed">
              {description1}{" "}
              <span className="font-edu-sa font-bold italic text-blue-100">
                {description2}
              </span>
            </p>

            <div className="mt-8">
              {formType === "signup" ? <SignupForm /> : <LoginForm />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Template;
