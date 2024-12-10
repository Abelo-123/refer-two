const { NextResponse } = require('next/server');

export const POST = async (req) => {
  const BOT_TOKEN = process.env.BOT_TOKEN;

  if (!BOT_TOKEN) {
    return NextResponse.json({ error: 'Bot token is not configured' }, { status: 500 });
  }

  const body = await req.json();

  // Handle Telegram updates
  if (body.message) {
    const chatId = body.message.chat.id;
    const text = body.message.text;

    // Example: Sending a message back using Telegram Bot API
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `You said: ${text}`,
      }),
    });
  }

  return NextResponse.json({ status: 'ok' });
};
