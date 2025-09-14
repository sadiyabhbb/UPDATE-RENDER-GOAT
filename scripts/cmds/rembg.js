const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

module.exports = {
  config: {
    name: "rembg",
    version: "2.0",
    author: "LIKHON AHMED",
    countDown: 10,
    role: 0,
    shortDescription: "Remove background from an image (with options)",
    longDescription: "Reply to an image and the bot will remove its background using Rembg API with optional parameters.",
    category: "tools",
    guide: {
      en: "{pn} [format=png/webp] [w=800] [h=600] [bg=#RRGGBBAA] [angle=0] [expand=true/false]"
    }
  },

  onStart: async function ({ message, event, args }) {
    const apiKey = "10d164e7-5109-46c9-99c1-fffbe613419f"; // তোমার API key

    if (
      !event.messageReply ||
      !event.messageReply.attachments ||
      event.messageReply.attachments.length === 0
    ) {
      return message.reply("❌ Please reply to an image to remove background.");
    }

    const attachment = event.messageReply.attachments[0];
    if (attachment.type !== "photo") {
      return message.reply("❌ Please reply to a valid photo.");
    }

    const imageUrl = attachment.url;
    const tempFile = path.join(__dirname, `rembg_result.png`);

    // default options
    let options = {
      format: "png",
      w: null,
      h: null,
      exact_resize: "false",
      mask: "false",
      bg_color: null,
      angle: "0",
      expand: "true"
    };

    // parse arguments (e.g. format=webp w=800 h=600 bg=#ffffff angle=45 expand=false)
    args.forEach(arg => {
      let [key, value] = arg.split("=");
      if (!value) return;
      key = key.toLowerCase();

      if (key === "format") options.format = value;
      if (key === "w") options.w = value;
      if (key === "h") options.h = value;
      if (key === "exact_resize") options.exact_resize = value;
      if (key === "mask") options.mask = value;
      if (key === "bg") options.bg_color = value;
      if (key === "angle") options.angle = value;
      if (key === "expand") options.expand = value;
    });

    try {
      message.reply("⏳ Removing background, please wait...");

      // Download image first
      const imgRes = await axios.get(imageUrl, { responseType: "arraybuffer" });
      const inputFile = path.join(__dirname, "input_temp.jpg");
      fs.writeFileSync(inputFile, imgRes.data);

      const form = new FormData();
      form.append("image", fs.createReadStream(inputFile));
      if (options.format) form.append("format", options.format);
      if (options.w) form.append("w", options.w);
      if (options.h) form.append("h", options.h);
      if (options.exact_resize) form.append("exact_resize", options.exact_resize);
      if (options.mask) form.append("mask", options.mask);
      if (options.bg_color) form.append("bg_color", options.bg_color);
      if (options.angle) form.append("angle", options.angle);
      if (options.expand) form.append("expand", options.expand);

      const response = await axios.post("https://api.rembg.com/rmbg", form, {
        headers: {
          "x-api-key": apiKey,
          ...form.getHeaders()
        },
        responseType: "arraybuffer"
      });

      fs.writeFileSync(tempFile, response.data);

      await message.reply({
        body: "✅ Background removed successfully!",
        attachment: fs.createReadStream(tempFile)
      });

      fs.unlinkSync(tempFile);
      fs.unlinkSync(inputFile);
    } catch (err) {
      console.error(err);
      message.reply("❌ Failed to remove background. Please try again later.");
    }
  }
};
