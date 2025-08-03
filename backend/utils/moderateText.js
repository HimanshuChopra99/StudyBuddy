const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function modeerateReviewContent(text) {
  const prompt = `You are a content moderation system. 
Check if the following text is safe for publishing in a student course review.

Text: """${text}"""

Reply only with: "safe" or "unsafe" based on whether the text contains:
- Adult (18+) content
- Abusive, offensive, or hateful language
- Profanity or harmful speech
- Gibberish, random characters, or meaningless spam

Respond only with the word "safe" or "unsafe". Do not explain anything.`;

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
