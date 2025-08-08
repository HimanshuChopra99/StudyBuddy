import { apiConnector } from "../apiconnector";
import { AiEndpoints } from "../apis";
const { CHAT_BOT } = AiEndpoints;
import { toast } from "react-hot-toast";

export const chatBot = async (message, token) => {
  let result = [];
  try {
    const response = await apiConnector(
      "POST",
      CHAT_BOT,
      { message },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    result = response.data;
  } catch (error) {
    console.log("Error in Ai chatbot response..........", error.message);
    toast.error(error.message);
  }
  return result;
};
