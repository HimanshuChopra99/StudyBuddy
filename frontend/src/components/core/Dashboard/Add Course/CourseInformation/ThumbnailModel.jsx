import { useState } from "react";
import axios from "axios";
import { generateThumbnail } from "../../../../../services/operations/courseDetailsAPI";
import toast from "react-hot-toast";

export default function ThumbnailModal({
  isOpen,
  onClose,
  onThumbnailGenerated,
}) {
  const [prompt, setPrompt] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const formData = new FormData();
    if (prompt) {
      formData.append("prompt", prompt);
    } else {
      toast.error("Prompt is Required");
    }

    try {
      const res = await generateThumbnail(formData);
      console.log("res", res);
      setThumbnail(res.data.thumbnailURL);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to generate thumbnail");
    } finally {
      setLoading(false);
    }
  };

  const handleUseThis = () => {
    onThumbnailGenerated(thumbnail);
    console.log(thumbnail)
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-richblack-800 text-richblack-5 rounded-lg p-6 w-[400px]">
        <h2 className="text-xl font-semibold mb-4">Generate Thumbnail</h2>

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter Your Course Name"
          className="form-style w-full my-2"
        />

        {loading && !thumbnail && (
          <div className="w-full h-[180px] flex items-center justify-center bg-richblack-700 rounded-md mb-4">
            <div className="w-full h-full shimmer rounded-md"></div>
          </div>
        )}

        {thumbnail && (
          <div className="w-full h-60 flex flex-col justify-between">
            <div className="border-1 border-richblack-500 h-[65%] rounded-lg overflow-hidden mt-2">
              <img
                src={thumbnail}
                className=" rounded"
                alt="Thumbnail Preview"
              />
            </div>
            <button
              onClick={handleUseThis}
              className="bg-green-600 text-white mt-3 px-4 py-2 w-full rounded-lg mb-4  hover:bg-green-600 hover:scale-102 duration-200"
            >
              Use This Thumbnail
            </button>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className=" bg-yellow-100 cursor-pointer gap-x-2 rounded-md py-2 text-sm md:text-lg px-3 md:px-5 font-semibold text-richblack-900 w-full hover:bg-yellow-50 hover:scale-102 duration-200"
        >
          {loading ? "Generating..." : "Generate Thumbnail"}
        </button>

        <button onClick={onClose} className="mt-4 w-full text-center">
          <span className="text-gray-500 underline hover:text-richblack-5 duration-200">
            Cancel
          </span>
        </button>
      </div>
    </div>
  );
}
