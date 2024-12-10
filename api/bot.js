const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const bot = new TelegramBot('7766724477:AAHp0r8SvGJIIO9l02VsY6FuZisWFX3YvAg', { webHook: true });
const app = express();

// Use express.json middleware to parse JSON
app.use(express.json());

// Set Telegram webhook
const URL = 'https://refer-two-dv8l.vercel.app/';
bot.setWebHook(`${URL}/bot${bot.token}`);

// Endpoint for Telegram updates
app.post(`/bot${bot.token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Example command handler
bot.onText(/\/start (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const startParam = match[1];
    bot.sendMessage(chatId, `Welcome! Your start param is: ${startParam}`);
});

// Start Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Bot running on port ${PORT}`);
});
