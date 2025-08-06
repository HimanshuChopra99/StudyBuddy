// assemblyaiService.js
const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.ASSEMBLY_AI;
const BASE_URL = "https://api.assemblyai.com/v2";

// Submit video URL for processing
async function submitAudio(videoUrl) {
  try {
    const response = await axios.post(
      `${BASE_URL}/transcript`,
      {
        audio_url: videoUrl,
        language_code: "hi",
        // summarization: true,
        summary_model: "informative",
        summary_type: "bullets",
      },
      {
        headers: {
          authorization: API_KEY,
          "content-type": "application/json",
        },
      }
    );
    return response.data.id;
  } catch (error) {
    console.error("SubmitAudio Error:", error.response?.data || error.message);
    throw new Error("Failed to submit audio to AssemblyAI");
  }
}
// Poll AssemblyAI until transcription is done
async function pollTranscript(transcriptId) {
  const endpoint = `${BASE_URL}/transcript/${transcriptId}`;
  try {
    while (true) {
      const res = await axios.get(endpoint, {
        headers: { authorization: API_KEY },
      });

      if (res.data.status === "completed") {
        return res.data;
      } else if (res.data.status === "error") {
        console.error("Polling error:", res.data.error);
        throw new Error("Transcription failed: " + res.data.error);
      }

      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5s
    }
  } catch (error) {
    console.error("PollTranscript Error:", error.message || error);
    throw error; // Re-throw to be handled by calling function
  }
}

// Main function to transcribe and summarize
async function transcribeAndSummarize(videoUrl) {
  const transcriptId = await submitAudio(videoUrl);
  const result = await pollTranscript(transcriptId);
  return {
    transcript: result.text,
    // summary: result.summary,
  };
}

module.exports = { transcribeAndSummarize };
