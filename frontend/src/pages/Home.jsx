import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import HighlightText from "../components/core/HomePage/HighlightText";
import Button from "../components/core/HomePage/Button";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import Footer from "../components/common/Footer";
import TimelineSection from "../components/core/HomePage/TimelineSection";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import ExploreMore from "../components/core/HomePage/ExploreMore";
import ReviewSlider from "../components/common/ReviewSlider";

function Home() {
  return (
    <div>
      {/* Section 1 */}
      <div className="relative mx-auto flex flex-col gap-10 w-10/12 items-center  ">
        <Link to={"/signup"}>
          <div className="group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-semibold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit">
            <div className="flex flex-row items-center gap-2 rounded-full px-3 py-1 transition-all duration-200 group-hover:bg-richblack-900">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        <div className="text-center text-4xl font-semibold text-white">
          Empower Your Future with
          <HighlightText text={"Coding Skills"} />
        </div>

        <div className="w-[60%] text-center text-lg font-large text-richblack-300">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>

        <div className="flex flex-row gap-7">
          <Button active={true} linkto={"/signup"}>
            Learn More
          </Button>
          <Button active={false} linkto={"/login"}>
            Book a Demo
          </Button>
        </div>

        <div className="mx-3 my-7 w-10/12 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
          <video
            className="shadow-[20px_20px_rgba(255,255,255)]"
            muted
            loop
            autoPlay
          >
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

        <div className="w-10/12">
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-5xl font-semibold text-white">
                Unlock your
                <HighlightText text={"coding potential"} /> with our online
                courses.
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            btn1={{
              btnText: "Try it Yourself",
              link: "/signup",
              active: true,
            }}
            btn2={{
              btnText: "Learn More",
              link: "/signup",
              active: false,
            }}
            bgGradiant1={"bg-blue-500"}
            bgGradiant2={"bg-purple-500"}
            codeColor={"text-white"}
            codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
            backgroundGradient={<div className="codeblock1 absolute"></div>}
          />

          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="text-5xl font-semibold text-white">
                Start
                <HighlightText text={"coding in seconds"} />
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            btn1={{
              btnText: "Continue Lesson",
              link: "/signup",
              active: true,
            }}
            btn2={{
              btnText: "Learn More",
              link: "/signup",
              active: false,
            }}
            bgGradiant1={"bg-purple-500"}
            bgGradiant2={"bg-blue-500"}
            codeColor={"text-white"}
            codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
            backgroundGradient={<div className="codeblock1 absolute"></div>}
          />
        </div>
        <ExploreMore />
      </div>

      {/* Section 2 */}
      <div className="bg-white text-richblack-700 w-full flex flex-col justify-center">
        <div className="homepage_bg h-[333px] w-full">
          <div className="max-w-maxContent h-full flex justify-center items-center gap-5 mx-auto">
            <div className="flex flex-row gap-7 lg:mt-20 text-white">
              <Button active={true} linkto={"/signup"}>
                <div className="flex items-center gap-2">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </Button>
              <Button active={false} linkto={"/login"}>
                Learn More
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 w-12/12 lg:w-8/12 max-w-maxContent flex flex-col items-center justify-between gap-7">
          <div className="w-full flex flex-col gap-4 lg:flex-row justify-between items-center lg:items-start">
            <div className="w-[45%] text-center lg:text-start">
              <div className="text-4xl font-bold">
                Get the skills you need for a
                <HighlightText text={"job that is in demand."} />
              </div>
            </div>
            <div className="flex flex-col gap-10 w-[50%] items-center text-center lg:items-start lg:text-start">
              <div className="font-semibold">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              <Button active={true} linkto={"/signup"}>
                <div>Learn more</div>
              </Button>
            </div>
          </div>

          <TimelineSection />

          <LearningLanguageSection />
        </div>
      </div>

      <div className="w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white">
        <InstructorSection />

        {/* Review Slider here */}
      </div>
      <div className=" mb-16 mt-3">
        {/* <RatingSlider /> */}
        <h1 className="text-center text-4xl font-semibold mt-8 text-white">
          Reviews from other learners
        </h1>
        <ReviewSlider />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
