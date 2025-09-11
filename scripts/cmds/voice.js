const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "voice",
    version: "1.1",
    author: "LIKHON",
    countDown: 3,
    role: 0,
    description: "Play or list voice files from cache/audio folder",
    category: "media"
  },

  onStart: async function ({ message, args }) {
    const audioFolder = path.join(__dirname, "cache", "audio");
    const exts = [".mp3", ".m4a", ".wav", ".ogg"];

    if (!args[0]) 
      return message.reply("❌ | Please provide a voice name or use `/voice list`");

    
    if (args[0].toLowerCase() === "list") {
      if (!fs.existsSync(audioFolder)) {
        return message.reply("❌ | Audio folder not found!");
      }

      const files = fs.readdirSync(audioFolder).filter(file =>
        exts.includes(path.extname(file).toLowerCase())
      );

      if (files.length === 0) {
        return message.reply("📂 | No voice files found in cache/audio folder.");
      }

      let msg = "🎵 Available voices:\n";
      files.forEach((file, i) => {
        msg += `${i + 1}. ${path.basename(file, path.extname(file))}\n`;
      });

      return message.reply(msg);
    }

    
    const voiceName = args.join(" ");
    let filePath = null;

    for (const ext of exts) {
      const fullPath = path.join(audioFolder, voiceName + ext);
      if (fs.existsSync(fullPath)) {
        filePath = fullPath;
        break;
      }
    }

    if (!filePath) {
      return message.reply(`❌ | Voice file not found: ${voiceName}`);
    }

    return message.reply({
      body: ``,
      attachment: fs.createReadStream(filePath)
    });
  }
};
