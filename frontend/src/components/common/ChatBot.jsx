import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import { chatBot } from "../../services/operations/chatBot";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // Or any other style (see below)

const ChatBot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendToAI = (text) => {
    setIsTyping(true);
    setTimeout(() => {
      const aiReply = `You asked: "${text}". Here’s a helpful answer!`;
      setMessages((msgs) => [
        ...msgs,
        { sender: "ai", text: aiReply, timestamp: new Date() },
      ]);
      setIsTyping(false);
    }, 2000 + Math.random() * 1000);
  };

  const handleSend = async () => {
    const message = input.trim();
    if (!message) return;
    const userMsg = {
      sender: "user",
      text: message,
      timestamp: new Date(),
    };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const result = await chatBot(message, token);
      console.log(result.data);
      const aiText = result?.data || "No response from AI.";

      setMessages((msgs) => [
        ...msgs,
        {
          sender: "ai",
          text: aiText,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "ai",
          text: "Something went wrong. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    }
    setIsTyping(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-[90vw] sm:w-[400px] h-[90vh] sm:h-[600px] bg-gray-200 border border-gray-300 rounded-lg shadow-md flex flex-col relative ">
      {/* Header with close button */}
      <div className="flex justify-between rounded-t-lg items-center px-4 py-3 border-b border-gray-300 bg-white">
        <h2 className="font-semibold text-gray-700">Study Buddy</h2>
        <button onClick={onClose}>
          <IoClose className="text-xl text-gray-600 hover:text-black" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`relative max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                m.sender === "user"
                  ? "bg-green-200 text-black rounded-br-sm"
                  : "bg-white text-gray-700 rounded-bl-sm"
              }`}
            >
              <ReactMarkdown
                children={m.text}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              />
              <div className="text-[10px] text-right text-gray-400 mt-1">
                {m.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-2 rounded-2xl flex gap-2">
              <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
              <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-200" />
              <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-400" />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="flex p-3 border-t-1 border-gray-300 bg-white rounded-b-md ">
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 resize-none border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
        />
        <button
          onClick={handleSend}
          className="ml-3 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
