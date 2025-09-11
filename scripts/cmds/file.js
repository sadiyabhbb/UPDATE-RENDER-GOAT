const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "file",
    version: "1.4",
    author: "LIKHON6T9X",
    role: 2,
    countDown: 5,
    description: "Send any file as text message (restricted by UID)",
    category: "Tools",
    guide: "/file filename",
  },

  onStart: async function ({ api, event, args }) {
    
    const allowedUIDs = [
      "61572915213085",
      "UID2",           
      "UID3",           
      "UID4"            
    ];

    if (!allowedUIDs.includes(event.senderID)) {
      return api.sendMessage("❌ | You are not authorized to access this command", event.threadID, event.messageID);
    }

    if (!args[0]) {
      return api.sendMessage("❌ | Please provide a file name", event.threadID, event.messageID);
    }

    const fileName = args[0].endsWith(".js") ? args[0] : args[0] + ".js";

    const basePaths = [
      path.join(__dirname, "..", "cmds"),
      path.join(__dirname, "..", "scripts"),
      __dirname
    ];

    let filePath = null;

    for (const base of basePaths) {
      const tempPath = path.join(base, fileName);
      if (fs.existsSync(tempPath)) {
        filePath = tempPath;
        break;
      }
    }

    if (!filePath) {
      return api.sendMessage(`❌ | File not found: ${fileName}`, event.threadID, event.messageID);
    }

    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      return api.sendMessage(`🐥 | File: ${fileName}\n\n${fileContent}`, event.threadID, event.messageID);
    } catch (err) {
      return api.sendMessage(`❌ | Error reading file: ${fileName}\n${err.message}`, event.threadID, event.messageID);
    }
  },
};
