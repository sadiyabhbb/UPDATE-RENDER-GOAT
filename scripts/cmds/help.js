const { commands } = global.GoatBot;
const { getPrefix } = global.utils;

module.exports = {
  config: {
    name: "help",
    version: "2.2",
    author: "MODIFIED LIKHON AHMED",
    countDown: 5,
    role: 0,
    shortDescription: "Show all bot commands in styled format",
    longDescription: "Display help menu in category style like a guide book",
    category: "info",
    guide: {
      en: "{pn} [page | command name]"
    }
  },

  onStart: async function ({ message, args, event, threadsData }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);

    
    if (args.length > 0 && isNaN(args[0])) {
      const name = args[0].toLowerCase();
      const cmd =
        commands.get(name) ||
        [...commands.values()].find(c => c.config.aliases?.includes(name));

      if (!cmd) return message.reply(`❌ Command not found: ${name}`);
      const c = cmd.config;

      const info = `
╭──✦ [ Command: ${c.name.toUpperCase()} ]
├‣ 📜 Name: ${c.name}
├‣ 🪶 Aliases: ${c.aliases?.join(", ") || "None"}
├‣ 👤 Credits: ${c.author || "Unknown"}
╰‣ 🔑 Permission: ${c.role == 0 ? "Everyone" : (c.role == 1 ? "Group Admin" : "Bot Admin Only")}

╭─✦ [ INFORMATION ]
├‣ Cost: Free
├‣ Description:
│   ${c.longDescription || c.shortDescription || "No description"}
╰‣ Guide: ${c.guide?.en || `${prefix}${c.name}`}

╭─✦ [ SETTINGS ]
├‣ 🚩 Prefix Required: ✓ Required
╰‣ ⚜ Premium: ✗ Free to Use
`;
      return message.reply(info);
    }

    
    const categories = {};
    for (const [, cmd] of commands) {
      if (!cmd.config || !cmd.config.category) continue;
      const cat = cmd.config.category.toUpperCase();
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmd.config.name);
    }

    const sortedCategories = Object.keys(categories).sort();
    sortedCategories.forEach(cat => categories[cat].sort());

    const perPage = 6;
    const totalPages = Math.ceil(sortedCategories.length / perPage);
    const page = parseInt(args[0]) || 1;
    if (page < 1 || page > totalPages) {
      return message.reply(`❌ Page ${page} does not exist. Total pages: ${totalPages}`);
    }

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const showCats = sortedCategories.slice(start, end);

    let msg = `✨ [ Guide For Beginners - Page ${page} ] ✨\n\n`;

    for (const cat of showCats) {
      msg += `╭──── [ ${cat} ]\n`;
      let line = "│ ";
      categories[cat].forEach((cmd, i) => {
        line += `✧ ${cmd}`;
        if ((i + 1) % 3 === 0) {
          msg += line + "\n";
          line = "│ ";
        }
      });
      if (line.trim() !== "│") msg += line + "\n";
      msg += "╰───────────────◊\n";
    }

    msg += `\n╭─『 LIKHON BOT 』\n`;
    msg += `╰‣ Total commands: ${commands.size}\n`;
    msg += `╰‣ Page ${page} of ${totalPages}\n`;
    msg += `╰‣ A Personal Facebook Bot\n`;
    msg += `╰‣ ADMIN: 𝐋𝐈𝐊𝐇𝐎𝐍 𝐀𝐇𝐌𝐄𝐃\n`;
    msg += `╰‣ If you Don't know how to use commands Then Type ${prefix}help [commandName]`;

    return message.reply(msg);
  }
};
