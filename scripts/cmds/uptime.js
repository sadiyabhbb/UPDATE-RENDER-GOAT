module.exports = {
  config: {
    name: "uptime",
    version: "1.0",
    author: "LIKHON AHMED",
    countDown: 5,
    role: 0,
    description: {
      en: "Check bot uptime",
      bn: "বটের uptime দেখায়"
    },
    category: "utility",
    guide: {
      en: "{pn} - Show bot uptime",
      bn: "{pn} - বটের uptime দেখায়"
    }
  },

  onStart: async function ({ message, client }) {
    const totalSeconds = process.uptime();
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    return message.reply(`Uptime: ${uptimeString}`);
  }
};
