// say.js
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { execSync } = require("child_process");

module.exports = {
  config: {
    name: "say",
    aliases: ["s"],
    version: "1.4",
    author: "LIKHON",
    countDown: 2,
    role: 0,
    description: "Text to speech (বাংলা) — /say <text>",
    category: "utilities",
    guide: "{pn} <বাংলা টেক্সট> - বাংলায় বলবে"
  },

  onStart: async function ({ message, args }) {
    try {
      const text = args.join(" ").trim();
      if (!text) return message.reply("❌ পাঠানোর জন্য বাংলা টেক্সট লিখো। উদাহরণ: /say আমি ঠিক আছি।");

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      // টেক্সট ভেঙে নেওয়া
      const MAX_CHUNK = 180;
      const chunks = [];
      const sentences = text.match(/[^।!?]+[।!?]?/g) || [text];
      let buffer = "";
      for (const s of sentences) {
        if ((buffer + " " + s).trim().length <= MAX_CHUNK) {
          buffer = (buffer + " " + s).trim();
        } else {
          if (buffer) chunks.push(buffer);
          buffer = s.trim();
        }
      }
      if (buffer) chunks.push(buffer);

      // গুগল TTS
      const ttsBuffers = [];
      for (const chunk of chunks) {
        const url = "https://translate.google.com/translate_tts";
        const params = new URLSearchParams({
          ie: "UTF-8",
          q: chunk,
          tl: "bn",
          client: "tw-ob"
        });
        const res = await axios.get(`${url}?${params.toString()}`, {
          responseType: "arraybuffer",
          headers: {
            "User-Agent": "Mozilla/5.0",
            "Referer": "http://translate.google.com/",
          }
        });
        ttsBuffers.push(Buffer.from(res.data));
        await new Promise(r => setTimeout(r, 220));
      }

      const rawFile = path.join(cacheDir, `say_raw_${Date.now()}.mp3`);
      fs.writeFileSync(rawFile, Buffer.concat(ttsBuffers));

      let finalFile = rawFile;
      try {
        execSync("ffmpeg -version", { stdio: "ignore" });

        const processedFile = path.join(cacheDir, `say_final_${Date.now()}.mp3`);

        // এখানে bass boost + treble cut + loudnorm দিলাম
        const afilter = [
          `asetrate=44100*1.0`,
          `aresample=44100`,
          `bass=g=4:f=100`,                 // bass boost
          `treble=g=-1`,                    // treble হালকা কম
          `highpass=f=60`,                  // অপ্রয়োজনীয় low rumble কাট
          `equalizer=f=250:width_type=o:width=2:g=2`, // warmth
          `loudnorm=I=-14:TP=-2:LRA=7`
        ].join(",");

        execSync(`ffmpeg -y -i "${rawFile}" -af "${afilter}" -codec:a libmp3lame -q:a 3 "${processedFile}"`);
        finalFile = processedFile;
        try { fs.unlinkSync(rawFile); } catch {}
      } catch {
        finalFile = rawFile;
      }

      await message.reply({
        body: "",
        attachment: fs.createReadStream(finalFile)
      });

      try { fs.unlinkSync(finalFile); } catch {}
    } catch (err) {
      console.error("say.js error:", err?.message || err);
      return message.reply("❌ TTS সম্ভব হয়নি। পরে আবার চেষ্টা করুন।");
    }
  }
};
