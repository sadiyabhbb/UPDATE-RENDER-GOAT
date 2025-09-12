const axios = require("axios");

module.exports = {
	config: {
		name: "apitest",
		aliases: ["testapi", "api"],
		version: "1.0",
		author: "LIKHON AHMED",
		countDown: 5,
		role: 2,
		description: {
			en: "Test API endpoints with GET method"
		},
		category: "utility",
		guide: {
			en: "{pn} <API_URL> — Fetch API response"
		}
	},

	langs: {
		en: {
			missingUrl: "❌ Please provide an API URL",
			error: "❌ Failed to fetch API: %1",
			success: "📄 API Response:\n%1"
		}
	},

	onStart: async function({ message, args, event, usersData, getLang }) {
		const apiUrl = args[0];
		if (!apiUrl) return message.reply(getLang("missingUrl"));

		try {
			const res = await axios.get(apiUrl, {
				headers: { 'Accept': '*/*' }
			});

			let output = res.data;
			if (typeof output === "object") output = JSON.stringify(output, null, 2);

			return message.reply(getLang("success", output));
		} catch (err) {
			return message.reply(getLang("error", err.message));
		}
	}
};
