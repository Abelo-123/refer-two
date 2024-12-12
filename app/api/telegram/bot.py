from fastapi import FastAPI, Request
import logging
from telegram import Update, Bot
from telegram.ext import Application, CommandHandler, CallbackContext
import os
import asyncio
from starlette.middleware.trustedhost import TrustedHostMiddleware

app = FastAPI()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set up your Telegram bot token
TELEGRAM_TOKEN = "7766724477:AAHp0r8SvGJIIO9l02VsY6FuZisWFX3YvAg"

# Initialize the Application with the Telegram bot token
application = Application.builder().token(TELEGRAM_TOKEN).build()

# Define a command handler (example command)
async def start(update: Update, context: CallbackContext):
    user_message = update.message.text  # Get the text of the message
    await update.message.reply_text(f"You said: {user_message}")

# Add the command handler to the application
application.add_handler(CommandHandler("start", start))

# Webhook route for Telegram updates
@app.post("/api/telegram/webhook")
async def webhook(request: Request):
    try:
        # Parse the incoming webhook data
        update = await request.json()
        logger.info(f"Received update: {update}")

        if 'message' in update and isinstance(update['message'], dict):
            message = update['message']
            if 'text' in message:
                text = message['text']
                logger.info(f"Received message text: {text}")

                chat_id = message['chat']['id']
                bot = Bot(TELEGRAM_TOKEN)
                await bot.send_message(chat_id=chat_id, text=f"You said: {text}")
            else:
                logger.warning("No text found in message.")
        else:
            logger.warning("No message found in update.")

        return {"status": "ok"}

    except Exception as e:
        logger.error(f"Error processing update: {str(e)}")
        return {"status": "error", "message": str(e)}

# Entry point for Vercel serverless function
def handler(event, context):
    return asyncio.run(app(event, context))
