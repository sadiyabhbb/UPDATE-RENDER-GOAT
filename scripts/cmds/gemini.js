const axios = require("axios");

module.exports = {
  config: {
    name: "gemini",
    version: "1.0",
    author: "LIKHON AHMED",
    countDown: 5,
    role: 0,
    shortDescription: "Talk with Google Gemini AI",
    longDescription: "Send a prompt to Gemini and get a response",
    category: "AI",
    guide: {
      en: "{pn} <your prompt>"
    }
  },

  onStart: async function ({ message, args, event, api }) {
    const prompt = args.join(" ");
    if (!prompt) {
      return message.reply("⚠️ Please provide a prompt for Gemini.");
    }

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": "AIzaSyBdVCLnxARARGxmsjOvMtdWAXCYyd8eT2s" // এখানে তোমার Gemini API key বসাও
          }
        }
      );

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return message.reply("❌ Failed to get response from Gemini.");
      }

      api.setMessageReaction("✅", event.messageID, () => {}, true);
      return message.reply(text);

    } catch (e) {
      console.error("Gemini API Error:", e.message);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return message.reply("❌ An error occurred while communicating with Gemini API.");
    }
  }
};
