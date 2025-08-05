const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function modeerateReviewContent(text) {
  const prompt = `You are a moderation bot. Check if the following text is inappropriate for a course review.

Text: """${text}"""

Reply only with: "safe" or "unsafe" based on:
- Abuse, hate, adult content, profanity, spam, or nonsense.

Only reply with "safe" or "unsafe".`;

  try {
    const response = await model.generateContent(prompt);
    const text = await response.response.text();
    const verdict = text.toLocaleLowerCase().trim();
    return verdict === "safe";
  } catch (error) {
    console.error("Moderation failed:", error.message);
    return false;
  }
}

module.exports = { modeerateReviewContent };
