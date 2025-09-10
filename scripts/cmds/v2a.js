const fs = require("fs-extra");
const { exec } = require("child_process");

module.exports = {
  config: {
    name: "v2a",
    version: "1.0.0",
    author: "Dipto",
    countDown: 2,
    role: 0,
    description: "Convert a replied video to MP3",
    category: "MEDIA",
    guide: "[reply video]",
  },

  onStart: async function ({ api, event }) {
    // Reply kora video theke url ber korbo
    const videoUrl = event.messageReply?.attachments?.[0]?.url;
    if (!videoUrl) return api.setMessageReaction("❌", event.messageID, () => {}, true);

    api.setMessageReaction("🐥", event.messageID, () => {}, true);

    try {
      const cacheDir = __dirname + "/cache";
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

      const videoPath = cacheDir + "/temp_video.mp4";
      const audioPath = cacheDir + "/output_audio.mp3";

      // Video download
      const videoData = await require("axios")({
        method: "get",
        url: videoUrl,
        responseType: "arraybuffer",
      });
      fs.writeFileSync(videoPath, Buffer.from(videoData.data, "utf-8"));

      // Convert video to mp3
      await new Promise((resolve, reject) => {
        exec(
          `ffmpeg -y -i "${videoPath}" -vn -ab 128k -ar 44100 -f mp3 "${audioPath}"`,
          (error) => (error ? reject(error) : resolve())
        );
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      // Send MP3
      api.sendMessage(
        { attachment: fs.createReadStream(audioPath) },
        event.threadID,
        () => {
          fs.unlinkSync(videoPath);
          fs.unlinkSync(audioPath);
        },
        event.messageID
      );
    } catch (err) {
      api.setMessageReaction("❎", event.messageID, () => {}, true);
    }
  },
};
