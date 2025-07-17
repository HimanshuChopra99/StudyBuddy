import React, { useEffect, useState } from "react";
import IconBtn from "./IconBtn";

const ConfirmationModal = ({ modalData, setModalData }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    if (modalData) {
      setShow(true);
    }
  }, [modalData]);

  const handleClose = () => {
    setShow(false);
    // Wait for animation to finish
    setTimeout(() => setModalData(null), 200);
  };

  if (!modalData) return null;

  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center backdrop-blur-[2px] transition-opacity duration-300 bg-richblack-900/50">
      <div
        className={`relative w-11/12 max-w-[350px] rounded-lg flex flex-col items-center bg-richblack-800 p-6 shadow-lg transform transition-all duration-300
            ${
              show
                ? "scale-100 opacity-100 translate-y-0"
                : "scale-90 opacity-0 translate-y-10"
            }
          `}
      >
        {/* Close Icon */}
        <div
          onClick={handleClose}
          className="absolute text-2xl text-richblack-5 right-2 top-2 cursor-pointer"
        ></div>

        {/* Modal Content */}
        <p className="text-2xl font-semibold text-richblack-5">
          {modalData?.text1}
        </p>
        <p className="mt-3 mb-5 leading-6 text-richblack-200">
          {modalData?.text2}
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-x-4">
          <IconBtn
            onclick={modalData?.btn1Handler}
            text={modalData?.btn1Text}
          />
          <button
            className="cursor-pointer rounded-md bg-richblack-600 py-[8px] px-[20px] font-semibold text-richblack-100"
            onClick={() => {
              modalData?.btn2Handler?.();
              handleClose();
            }}
          >
            {modalData?.btn2Text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
