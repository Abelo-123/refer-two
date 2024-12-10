import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON body

const BOT_TOKEN = "7766724477:AAHp0r8SvGJIIO9l02VsY6FuZisWFX3YvAg";

if (!BOT_TOKEN) {
    console.error('Bot token is not configured');
    process.exit(1);
}

// Handle incoming messages
app.post('/api/telegram', async (req, res) => {
    const body = req.body;

    // Handle Telegram updates
    if (body.message) {
        const chatId = body.message.chat.id;
        const text = body.message.text;

        // If it's a /start command with a deep link
        if (text.startsWith('/start')) {
            // Parse the start parameter, which is in the query string
            const urlParam = new URLSearchParams(body.message.text.replace('/start ', '')).get('url');

            if (urlParam) {
                // If there's a URL parameter, send an inline keyboard with a redirect link
                const replyMarkup = {
                    inline_keyboard: [
                        [
                            {
                                text: 'Click here to visit the link',
                                url: urlParam, // The URL you want to redirect to
                            }
                        ]
                    ]
                };

                // Send message with the inline keyboard
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: 'You clicked the start button! Here is the link:',
                        reply_markup: replyMarkup,
                    })
                }).catch((err) => {
                    console.error('Error sending message:', err);
                    return res.status(500).json({ error: 'Failed to send message to Telegram' });
                });
            } else {
                // If no URL param is found, send a message without the inline keyboard
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: 'You clicked the start button, but no URL was provided.',
                    })
                }).catch((err) => {
                    console.error('Error sending message:', err);
                    return res.status(500).json({ error: 'Failed to send message to Telegram' });
                });
            }
        } else {
            // Handle other text messages
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: `You said: ${text}`,
                })
            }).catch((err) => {
                console.error('Error sending message:', err);
                return res.status(500).json({ error: 'Failed to send message to Telegram' });
            });
        }
    }

    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
