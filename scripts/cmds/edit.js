const axios = require("axios");
const fs = require("fs");
const path = require("path");
const os = require("os");

module.exports = {
  config: {
    name: "edit",
    aliases: ["geminiedit"],
    version: "2.1",
    author: "ArYAN",
    countDown: 30,
    role: 0,
    shortDescription: "Edit or generate an image using EditV2 API",
    category: "AI",
    guide: {
      en: "{pn} <text> (reply to an image)",
    },
  },

  onStart: async function ({ message, event, args, api }) {
    const prompt = args.join(" ");
    if (!prompt) return message.reply("⚠ Please provide some text for the image.");

    const tempPath = path.join(__dirname, "cache", `${Date.now()}.png`);
    const apiUrl = "https://apis-top.vercel.app/aryan/editv2";

    try {
      // Set reaction to loading (no console cursor manipulation)
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      // Prepare API request
      const params = { prompt };
      if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments[0]) {
        params.imgurl = event.messageReply.attachments[0].url;
      }

      const response = await axios.get(apiUrl, { params });
      const imageData = response.data?.image_data;

      if (!imageData) {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return message.reply(`❌ API Error: ${response.data?.message || "Failed to get image data."}`);
      }

      const buffer = Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ""), "base64");
      fs.writeFileSync(tempPath, buffer);

      // Reaction success
      api.setMessageReaction("✅", event.messageID, () => {}, true);

      // Send image and delete temp file
      await message.reply(
        {
          body: "✅ Image generated successfully!",
          attachment: fs.createReadStream(tempPath),
        },
        event.threadID,
        () => {
          fs.unlinkSync(tempPath);
        },
        event.messageID
      );

    } catch (e) {
      console.error("❌ API ERROR:", e.message);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return message.reply("❌ An error occurred while creating or editing the image.");
    }
  },
};
