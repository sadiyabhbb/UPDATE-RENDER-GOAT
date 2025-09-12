// encode.js
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "encode",
    version: "1.0",
    author: "LIKHON",
    role: 0,
    description: "Encode file বা টেক্সটকে base64 এ রূপান্তর করবে",
    category: "utility"
  },

  onStart: async function ({ message, args, event }) {
    try {
      const cache = path.join(__dirname, "cache");
      if (!fs.existsSync(cache)) fs.mkdirSync(cache, { recursive: true });

      // === ফাইল encode ===
      if (event.type === "message_reply" && event.messageReply.attachments?.length) {
        const fileUrl = event.messageReply.attachments[0].url;
        const filename = event.messageReply.attachments[0].filename || `file_${Date.now()}`;
        const res = await axios.get(fileUrl, { responseType: "arraybuffer" });
        const encoded = Buffer.from(res.data).toString("base64");

        const outPath = path.join(cache, `${filename}.b64.txt`);
        fs.writeFileSync(outPath, encoded);
        return message.reply({ attachment: fs.createReadStream(outPath) });
      }

      // === টেক্সট encode ===
      if (args.length) {
        const text = args.join(" ");
        const encoded = Buffer.from(text, "utf8").toString("base64");

        if (encoded.length <= 1500) return message.reply(encoded);

        const outPath = path.join(cache, `text_${Date.now()}.b64.txt`);
        fs.writeFileSync(outPath, encoded);
        return message.reply({ attachment: fs.createReadStream(outPath) });
      }

      return message.reply("❌ ব্যবহার: ফাইল reply করে `/encode` অথবা `/encode <টেক্সট>` দিন।");
    } catch {
      return message.reply("❌ encode করতে সমস্যা হয়েছে।");
    }
  }
};
