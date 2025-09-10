module.exports = {
  config: {
    name: "spam",
    version: "1.0",
    author: "LIKHON AHMED",
    countDown: 5,
    role: 3,
    description: {
      en: "Spam message multiple times",
      bn: "একই মেসেজ একাধিকবার পাঠায়"
    },
    category: "utility",
    guide: {
      en: "{pn} <text> <count> - Send the text multiple times",
      bn: "{pn} <text> <count> - একই মেসেজ একাধিকবার পাঠায়"
    }
  },

  onStart: async function ({ message, args }) {
    if (args.length < 2) 
      return message.reply("❌ uses: /spam <text> <count>");

    const count = parseInt(args[args.length - 1]);
    if (isNaN(count) || count < 1) 
      return message.reply("❌ Count should be a number greater than 0");

    // মেসেজ টা combine করা (শেষ টা count তাই বাদ দিয়ে বাকি join)
    const text = args.slice(0, -1).join(" ");

    for (let i = 0; i < count; i++) {
      await message.reply(text);
    }
  }
};
