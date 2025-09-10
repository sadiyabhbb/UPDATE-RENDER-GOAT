const axios = require("axios");

module.exports = {
  config: {
    name: "sms",
    version: "1.0",
    author: "LIKHON AHMED",
    countDown: 5,
    role: 0,
    description: {
      en: "Send OTP SMS or check API status",
      bn: "OTP SMS পাঠানো বা API চেক করা"
    },
    category: "utility",
    guide: {
      en: "{pn} <number> <count>\n{pn} <apiname> <number> <count>",
      bn: "{pn} <number> <count>\n{pn} <apiname> <number> <count>"
    }
  },

  onStart: async function ({ message, args }) {
    if (args.length < 2) {
      return message.reply("❌ ব্যবহার: /sms <number> <count> অথবা /sms <apiname> <number> <count>");
    }

    let url = "";
    if (args.length === 2) {
      // case: /sms number count
      const [number, count] = args;
      url = `https://update-bomb.onrender.com/ck?phone=${number}&count=${count}`;
    } else if (args.length === 3) {
      // case: /sms apiname number count
      const [api, number, count] = args;
      url = `https://update-bomb.onrender.com/check?api=${api}&phone=${number}&count=${count}`;
    }

    try {
      const res = await axios.get(url);
      const data = res.data;

      // output format
      const output = {
        number: data.number || args[1],
        OTP: data.OTP || 1,
        author: "LIKHON AHMED"
      };

      return message.reply("```json\n" + JSON.stringify(output, null, 2) + "\n```");
    } catch (e) {
      return message.reply("⚠️ API call failed: " + e.message);
    }
  }
};
