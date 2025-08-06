const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Init Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.summarizeHindiTranscript = async (hindiTranscript) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const prompt = `
You are an AI summarizer.

Below is the transcript of a lecture video in Hindi, English, or Hinglish.

Your task is to:
1. Summarize the **main topic** of the video in clear, simple English.
2. Write a short paragraph explaining the topic inside a <p> tag.
3. Then, list the key learning points or takeaways using an unordered list (<ul> with <li>).
   - Important terms should be wrapped in <strong> tags.
   - Only use valid and clean HTML.

Strict Output Rules:
- Your response must be HTML only.
- No explanation or pre-text — just return clean HTML, just clean proper html.

Transcript:
${hindiTranscript}
`;

    const result = await model.generateContent(prompt);
    const summary = await result.response.text();
    return summary;
  } catch (err) {
    console.error("❌ Gemini summarization error:", err.message);
    throw err;
  }
};
