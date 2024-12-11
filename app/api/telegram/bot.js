const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
require('dotenv').config(); // Load .env for local development


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON body

const BOT_TOKEN = process.env.BOT_TOKEN

const bot = new TelegramBot(BOT_TOKEN);

app.post('/api/telegram', (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Listen for /start commands with parameters
bot.onText(/\/start (.+)/, (msg, match) => {
    const chatId = msg.chat.id; // Telegram chat ID
    const param = match[1]; // Extracted parameter from the deep link

    // Construct the dynamic URL with the extracted parameter
    const dynamicUrl = `https://t.me/PaxyoSMMRefer_bot?startapp=${param}`;

    // Create a button to open the constructed URL
    const keyboard = {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Visit the URL',
                        url: dynamicUrl, // Use the dynamic URL
                    },
                ],
            ],
        },
    };

    // Send a message with the button
    bot.sendMessage(chatId, `Click the button below to visit: ${dynamicUrl}`, keyboard);
});

// Default endpoint for health checks
app.get('/', (req, res) => {
    res.send('Bot is running');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
