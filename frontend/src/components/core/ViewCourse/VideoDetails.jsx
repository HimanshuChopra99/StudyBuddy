// components/VideoDetails.jsx
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useNavigate,
  useParams,
  useLocation,
  useOutletContext,
} from "react-router-dom";

import "video-react/dist/video-react.css";
import { BigPlayButton, Player } from "video-react";

import {
  getLectureSummary,
  markLectureAsComplete,
} from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../redux/slices/viewCourseSlice";
import IconBtn from "../../common/IconBtn";
import DOMPurify from "dompurify";

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const playerRef = useRef(null);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse);

  const [videoData, setVideoData] = useState([]);
  const [previewSource, setPreviewSource] = useState("");
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState();

  const { showToggleBtn, sidebarVisible, setSidebarVisible } =
    useOutletContext();

  useEffect(() => {
    (async () => {
      if (!courseSectionData.length) return;
      if (!courseId && !sectionId && !subSectionId) {
        navigate(`/dashboard/enrolled-courses`);
      } else {
        const filteredData = courseSectionData.filter(
          (course) => course._id === sectionId
        );
        const filteredVideoData = filteredData?.[0]?.subSection.filter(
          (data) => data._id === subSectionId
        );
        setVideoData(filteredVideoData[0]);
        setPreviewSource(courseEntireData.thumbnail);
        setVideoEnded(false);
      }
    })();
  }, [courseSectionData, courseEntireData, location.pathname]);

  const isFirstVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId);
    return currentSectionIndx === 0 && currentSubSectionIndx === 0;
  };

  const goToNextVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length;
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId);

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx + 1
        ]._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      );
    } else {
      const nextSectionId = courseSectionData[currentSectionIndx + 1]._id;
      const nextSubSectionId =
        courseSectionData[currentSectionIndx + 1].subSection[0]._id;
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      );
    }
  };

  const isLastVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length;
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId);
    return (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    );
  };

  const goToPrevVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId);

    if (currentSubSectionIndx !== 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx - 1
        ]._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      );
    } else {
      const prevSectionId = courseSectionData[currentSectionIndx - 1]._id;
      const prevSubSectionLength =
        courseSectionData[currentSectionIndx - 1].subSection.length;
      const prevSubSectionId =
        courseSectionData[currentSectionIndx - 1].subSection[
          prevSubSectionLength - 1
        ]._id;
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      );
    }
  };

  const handelSummary = async () => {
    const videoUrl = videoData?.videoUrl;
    setLoading(true);
    try {
      const res = await getLectureSummary(videoUrl);
      const cleanHtml = DOMPurify.sanitize(
        res.replace(/```html|```/g, "").trim()
      );
      setSummary(cleanHtml);
    } catch (error) {
      console.error("Error in generating summary:", error);
      setSummary(
        `<p style="color: red; font-weight: 300; font-size: 1rem;">
    Failed to generate summary. Please try again later.
  </p>`
      );
    } finally {
      setLoading(false); // This will run whether there's an error or not
    }
  };

  useEffect(() => {}, []);

  const handleLectureCompletion = async () => {
    setLoading(true);
    const res = await markLectureAsComplete(
      { courseId: courseId, subsectionId: subSectionId },
      token
    );
    if (res) {
      dispatch(updateCompletedLectures(subSectionId));
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 text-white py-6">
      {/* Video Player */}
      <div className="relative w-full rounded-lg overflow-hidden shadow-lg border border-richblack-700">
        {!videoData ? (
          <img
            src={previewSource}
            alt="Preview"
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <Player
            ref={playerRef}
            aspectRatio="16:9"
            onEnded={() => setVideoEnded(true)}
            src={videoData?.videoUrl}
          >
            <BigPlayButton position="center" />
            {videoEnded && (
              <div className="absolute inset-0 z-50 flex flex-col justify-center items-center bg-gradient-to-t from-black/90 via-black/60 to-transparent text-center px-6">
                {!completedLectures.includes(subSectionId) && (
                  <IconBtn
                    disabled={loading}
                    onclick={handleLectureCompletion}
                    text={!loading ? "✅ Mark As Completed" : "Loading..."}
                    customClasses="text-lg font-semibold mb-4 w-fit"
                  />
                )}
                <IconBtn
                  disabled={loading}
                  onclick={() => {
                    if (playerRef?.current) {
                      playerRef.current.seek(0);
                      setVideoEnded(false);
                    }
                  }}
                  text="🔁 Rewatch"
                  customClasses="text-lg mb-6"
                />
                <div className="flex gap-4">
                  {!isFirstVideo() && (
                    <button
                      onClick={goToPrevVideo}
                      className="blackButton text-white text-base px-6 py-2 rounded-md"
                    >
                      ⬅️ Prev
                    </button>
                  )}
                  {!isLastVideo() && (
                    <button
                      onClick={goToNextVideo}
                      className="blackButton text-white text-base px-6 py-2 rounded-md"
                    >
                      Next ➡️
                    </button>
                  )}
                </div>
              </div>
            )}
          </Player>
        )}
      </div>

      {/* Lecture Info */}
      <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-8">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-richblack-5 mb-2">
            {videoData?.title}
          </h1>
          <p className="text-richblack-200 text-base leading-relaxed">
            {videoData?.description}
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          {showToggleBtn && (
            <button
              className="md:hidden w-full rounded bg-yellow-100 px-4 py-2 text-sm font-semibold text-black shadow hover:bg-yellow-200 hover:scale-105 transition-all duration-200"
              onClick={() => setSidebarVisible((prev) => !prev)}
            >
              {sidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
            </button>
          )}
          <button
            onClick={handelSummary}
            className="px-5 py-2 rounded-md bg-yellow-100 text-black font-semibold shadow hover:bg-yellow-200 hover:scale-105 transition-all duration-200"
          >
            Get Video Summary with AI
          </button>
        </div>
      </div>

      {/* Summary Section */}
      <div className="w-full bg-richblack-800 rounded-lg mx-auto min-h-[100px]">
        {loading ? (
          <div className="text-richblack-50 text-lg px-6 py-6 font-mono whitespace-nowrap overflow-hidden w-full h-[100px] animate-typewriter-loop rounded-lg shimmer">
            Generating summary for you...
          </div>
        ) : (
          summary && (
            <div
              className="prose prose-invert max-w-none px-6 py-6 list-disc space-y-2"
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          )
        )}
      </div>
    </div>
  );
};

export default VideoDetails;
