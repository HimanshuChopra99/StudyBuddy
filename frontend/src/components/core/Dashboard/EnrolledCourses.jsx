import { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";

function TypingText({ phrases }) {
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState("");
  useEffect(() => {
    let pos = 0,
      timeout;
    const type = () => {
      setDisplay(phrases[index].substring(0, pos + 1));
      if (pos < phrases[index].length - 1) {
        pos++;
        timeout = setTimeout(type, 35);
      } else {
        setTimeout(() => {
          setDisplay("");
          setIndex((prev) => (prev + 1) % phrases.length);
        }, 1200);
      }
    };
    type();
    return () => clearTimeout(timeout);
  }, [index, phrases]);
  return (
    <p className="text-richblack-200 text-lg min-h-[1.5em] mb-4 animate-fadeIn">
      {display}
      <span className="border-l border-richblack-400 animate-blink ml-0.5"></span>
      {/* Typing caret + keyframes */}
      <style>{`
        .animate-blink { animation: blink 1.0s steps(1) infinite; }
        @keyframes blink { 0%, 50% {opacity:1;} 51%,100%{opacity:0;} }
      `}</style>
    </p>
  );
}

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [enrolledCourses, setEnrolledCourses] = useState(null);
  const getEnrolledCourses = async () => {
    try {
      const res = await getUserEnrolledCourses(token);

      setEnrolledCourses(res);
    } catch (error) {
      console.log("Could not fetch enrolled courses.");
    }
  };
  useEffect(() => {
    getEnrolledCourses();
  }, []);

  return (
    <>
      <div className="text-3xl text-richblack-50">Enrolled Courses</div>
      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="dots-container">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </div>
        </div>
      ) : !enrolledCourses.length ? (
        <div className="flex flex-col items-center justify-center h-[50vh] w-full">
          <div className="flex mb-8 space-x-2">
            <span className="w-4 h-4 bg-white rounded-full animate-bounce animation-delay-0"></span>
            <span className="w-4 h-4 bg-white rounded-full animate-bounce animation-delay-100"></span>
            <span className="w-4 h-4 bg-white rounded-full animate-bounce animation-delay-200"></span>
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-richblack-5 animate-fadeIn">
            Start Your Learning Journey!
          </h2>
          <TypingText
            phrases={[
              "No courses yet? Let's fix that.",
              "Explore new topics and grow with us.",
              "Click below to begin your learning journey.",
            ]}
          />
          <a
            href="/catalog/android"
            className="mt-7 px-7 py-2 bg-yellow-100 text-richblack-900 font-bold rounded-full shadow hover:bg-[#fcb100] transition duration-200"
          >
            Browse Courses
          </a>
          {/* Anim (fade, pulse, move) */}
          <style>{`
            .animate-bounce{animation:bounce 1s infinite alternate;}
            .animation-delay-0{animation-delay:0s;}
            .animation-delay-100{animation-delay:0.15s;}
            .animation-delay-200{animation-delay:0.3s;}
            @keyframes bounce{to{transform:translateY(-18px);}}
            .animate-fadeIn{animation:fadeIn 1.5s cubic-bezier(.4,0,.2,1) both;}
            @keyframes fadeIn{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}
            .animate-pulse{animation:pulse 2s infinite;}
            @keyframes pulse{0%,100%{box-shadow:0 0 0 0 #fde68a99;}50%{box-shadow:0 0 24px 8px #fde68a99;}}
            .animate-move{animation:move 0.8s infinite alternate;}
            @keyframes move{0%{transform:translateX(0);}100%{transform:translateX(8px);}}
          `}</style>
        </div>
      ) : (
        <div className="my-8 text-richblack-5">
          {/* Headings */}
          <div className="flex rounded-t-lg bg-richblack-500 ">
            <p className="w-[45%] px-5 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3">Duration</p>
            <p className="flex-1 px-2 py-3">Progress</p>
          </div>
          {/* Course Names */}
          {enrolledCourses.map((course, i, arr) => (
            <div
              className={`flex items-center border border-richblack-700 ${
                i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
              }`}
              key={i}
            >
              <div
                className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                onClick={() => {
                  navigate(
                    `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                  );
                }}
              >
                <img
                  src={course.thumbnail}
                  alt="course_img"
                  loading='lazy'
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div className="flex max-w-xs flex-col gap-2">
                  <p className="font-semibold">{course.courseName}</p>
                  <p className="text-xs text-richblack-300">
                    {course.courseDescription.length > 50
                      ? `${course.courseDescription.slice(0, 50)}...`
                      : course.courseDescription}
                  </p>
                </div>
              </div>
              <div className="w-1/4 px-2 py-3">{course?.totalDuration}</div>
              <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                <p>Progress: {course.progressPercentage || 0}%</p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="8px"
                  isLabelVisible={false}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
