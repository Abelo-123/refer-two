import express from 'express';
import fetch from 'node-fetch'; // If you use node-fetch v2, import fetch this way

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON body

const BOT_TOKEN = "7766724477:AAHp0r8SvGJIIO9l02VsY6FuZisWFX3YvAg";

if (!BOT_TOKEN) {
    console.error('Bot token is not configured');
    process.exit(1);
}

app.post('/api/telegram', async (req, res) => {
    const body = req.body;

    // Handle Telegram updates
    if (body.message) {
        const chatId = body.message.chat.id;
        const text = body.message.text;

        // Send a message back to the chat using Telegram Bot API
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: `You said: ${text}`,
            }),
        }).catch((err) => {
            console.error('Error sending message:', err);
            return res.status(500).json({ error: 'Failed to send message to Telegram' });
        });
    }

    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
