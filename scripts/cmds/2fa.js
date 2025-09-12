const speakeasy = require('speakeasy');

module.exports = {
  config: {
    name: "2fa",
    aliases: ["totp"],
    version: "1.0",
    author: "LIKHON AHMED",
    countDown: 3,
    role: 0,
    description: "Generate 2FA code from any secret",
    category: "utility",
    guide: "{pn} <secret> – Generate 2FA code from secret"
  },

  onStart: async function({ message, args }) {
    if (!args[0]) return message.reply("❌ ব্যবহার: /2fa <secret>");

    // Join all args and clean: remove spaces/dashes, normalize to base32
    const secret = args.join('').replace(/[^A-Z2-7]/gi, '').toUpperCase();

    try {
      // Generate 6-digit TOTP code without strict validation
      const token = speakeasy.totp({
        secret: secret,
        encoding: 'base32',
        digits: 6,
        step: 30
      });

      return message.reply(`🔑 2FA Code: ${token}`);
    } catch (e) {
      return message.reply("❌ কোড জেনারেট করতে পারছি না।\nError: " + e.message);
    }
  }
};
