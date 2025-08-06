import { useEffect, useRef, useState } from "react";
import { BsChatDots } from "react-icons/bs";
import ChatBot from "../components/common/ChatBot";

export default function StudentChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 }); // Top and left
  const dragRef = useRef(null);

  // Load saved position
  useEffect(() => {
    const saved = localStorage.getItem("chatbotPosition");
    if (saved) {
      setPosition(JSON.parse(saved));
    }
  }, []);

  // Handle drag
  const handleDragStart = (e) => {
    const chatBtn = dragRef.current;
    chatBtn.dataset.startX = e.clientX;
    chatBtn.dataset.startY = e.clientY;
    chatBtn.dataset.origX = position.x;
    chatBtn.dataset.origY = position.y;

    // Prevent ghost image while dragging
    const img = new Image();
    img.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAGgwJ/lKX+lwAAAABJRU5ErkJggg==";
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleDrag = (e) => {
    if (e.clientX === 0 && e.clientY === 0) return;

    const chatBtn = dragRef.current;
    const dx = e.clientX - chatBtn.dataset.startX;
    const dy = e.clientY - chatBtn.dataset.startY;

    const newX = parseInt(chatBtn.dataset.origX) + dx;
    const newY = parseInt(chatBtn.dataset.origY) + dy;

    setPosition({ x: newX, y: newY });
  };

  const handleDragEnd = () => {
    localStorage.setItem("chatbotPosition", JSON.stringify(position));
  };

  const toggleChat = () => {
    if (isOpen) {
      setIsVisible(false);
      setTimeout(() => setIsOpen(false), 300);
    } else {
      setIsOpen(true);
      setTimeout(() => setIsVisible(true), 10);
    }
  };

  return (
    <>
      {/* Floating Draggable Button */}
      {!isOpen && (
        <button
          ref={dragRef}
          draggable
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onClick={toggleChat}
          className="fixed z-50 bg-yellow-100 hover:bg-yellow-200 p-4 rounded-full shadow-md transition-colors"
          style={{
            top: `${position.y}px`,
            left: `${position.x}px`,
            cursor: "grab",
          }}
        >
          <BsChatDots className="text-xl text-richblack-900" />
        </button>
      )}

      {/* Chat Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-transparent"
            onClick={toggleChat}
          />

          {/* Chat Panel */}
          <div
            className={`absolute bottom-0 right-0 sm:bottom-20 sm:right-6 w-full sm:w-auto px-2 sm:px-0 flex justify-center sm:justify-end items-end 
              transition-all duration-300 ease-in-out 
              ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
          >
            <ChatBot onClose={toggleChat} />
          </div>
        </div>
      )}
    </>
  );
}
