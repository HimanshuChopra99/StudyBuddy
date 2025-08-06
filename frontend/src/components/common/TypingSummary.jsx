// components/common/TypingSummary.jsx
import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";

const TypingSummary = ({ rawHtml }) => {
  const [displayed, setDisplayed] = useState("");
  const [fullText, setFullText] = useState("");

  useEffect(() => {
    const cleanHtml = rawHtml.replace(/```html|```/g, "").trim();
    const sanitized = DOMPurify.sanitize(cleanHtml);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = sanitized;
    const plainText = tempDiv.innerText;
    setFullText(plainText);
  }, [rawHtml]);

  useEffect(() => {
    if (!fullText) return;

    let index = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + fullText.charAt(index));
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <p className="whitespace-pre-wrap text-richblack-5  text-base leading-relaxed">
      {displayed}
    </p>
  );
};

export default TypingSummary;
