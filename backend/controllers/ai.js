const { GoogleGenerativeAI, Modality } = require("@google/generative-ai");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const axios = require("axios");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//gemini + pollinations
exports.generateThumbnail = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res
      .status(400)
      .json({ success: false, message: "Prompt is required" });
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  geminiInput = `
      You act as ab proferssional thumbnail designer. where user send his course name and according to teh course you have to design the thumbnail deisgn accoring to the course name. The course sixe is 16:9. and change teh design according to the user prompt change tahe design.

      Here is the user prompt: """${prompt}""".

       Return only the enhanced AI-ready prompt — no extra commentary or formatting.
      `;
  const geminiResult = await model.generateContent(geminiInput);
  console.log(geminiResult);
  const enhancedPrompt = geminiResult.response.text().trim();
  console.log("Enhanced Prompt:", enhancedPrompt);

  const width = 1280;
  const height = 720;
  const seed = Math.floor(Math.random() * 1000000);
  const imgModel = "stable-diffusion-xl";

  const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(
    enhancedPrompt
  )}?width=${width}&height=${height}&seed=${seed}&model=${imgModel}`;

  console.log(imageUrl);

  const cloudinaryRes = await uploadImageToCloudinary(
      imageUrl,
      process.env.FOLDER_NAME
    );

    return res.status(200).json({
      success: true,
      thumbnailURL: imageUrl,
    });
};


//gemini + image art
// exports.generateThumbnail = async (req, res) => {
//   const { prompt } = req.body;
//   if (!prompt) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Prompt is required" });
//   }

//   try {
//     // //enhance prompt with gemini
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     geminiInput = `
//     Act as an prompt enchnace for thumbnail design, where user enter his course name and your role is not enhnace the prompt so that 'Image Art' website can easilt understand and gemearte the thumbnail design that looks this youtube thumbnail. You can takes refresnce from google to make thumbnail design prompt.

//     Here is the user prompt: """${prompt}"""

//     Return only the enhanced AI-ready prompt — no extra commentary or formatting.
//     `;

//     const geminiResult = await model.generateContent(geminiInput);
//     console.log(geminiResult);
//     const enhancedPrompt = geminiResult.response.text().trim();
//     console.log("Enhanced Prompt:", enhancedPrompt);

//     const form = new FormData();
//     form.append("prompt", enhancedPrompt);
//     form.append("style", "realistic"); // or any style supported by Vyro
//     form.append("aspect_ratio", "16:9");
//     form.append("seed", "9");

//     const imgRes = await axios.post(
//       "https://api.vyro.ai/v2/image/generations",
//       form,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.IMAGE_AI}`,
//         },
//         responseType: "arraybuffer",
//       }
//     );
//     console.log(imgRes);

//     const base64Image = Buffer.from(imgRes.data).toString("base64");

//     const cloudinaryRes = await uploadImageToCloudinary(
//       `data:image/png;base64,${base64Image}`,
//       process.env.FOLDER_NAME
//     );

//     return res.status(200).json({
//       success: true,
//       thumbnailURL: cloudinaryRes.secure_url,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error generating thumbnail",
//       error: error.response?.data || error.message,
//     });
//   }
// };
