import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { IoClose } from "react-icons/io5";

import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal";
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar";
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../redux/slices/viewCourseSlice";

export default function ViewCourse() {
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [reviewModal, setReviewModal] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(
    window.innerWidth >= 768
  );
  const [showToggleBtn, setShowToggleBtn] = useState(window.innerWidth < 768);
  const hideTimerRef = useRef(null);

  // Fetch course data
  useEffect(() => {
    (async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token);
      dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
      dispatch(setEntireCourseData(courseData.courseDetails));
      dispatch(setCompletedLectures(courseData.completedVideos));
      let lectures = 0;
      courseData?.courseDetails?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length;
      });
      dispatch(setTotalNoOfLectures(lectures));
    })();
  }, []);

  // Toggle button auto-hide on mobile
  useEffect(() => {
    setShowToggleBtn(true);
  }, [sidebarVisible]);
  useEffect(() => {
    const handleInteraction = () => {
      if (window.innerWidth >= 768) return;
      setShowToggleBtn(true);
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)] flex-col md:flex-row">
        {/* Overlay for mobile sidebar */}
        {sidebarVisible && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSidebarVisible(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`${
            sidebarVisible ? "translate-x-0" : "-translate-x-81"
          } fixed md:static z-50 h-full bg-richblack-800 transform transition-transform duration-300 md:translate-x-0`}
        >
         {sidebarVisible &&
           <div className=" w-full flex justify-end h-10">
            <button
              className="text-white text-2xl w-10"
              onClick={() => setSidebarVisible(false)}
            >
              <IoClose />
            </button>
          </div>
         }
          <VideoDetailsSidebar setReviewModal={setReviewModal} />
        </div>

        {/* Main Content */}
        <div className="flex-1 h-[calc(100vh-3.5rem)] overflow-auto bg-richblack-900">
          <div className="mx-4 sm:mx-6 md:mx-10 py-4 relative">
            <Outlet
              context={{ showToggleBtn, sidebarVisible, setSidebarVisible }}
            />
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  );
}
