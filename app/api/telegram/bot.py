# from fastapi import FastAPI, Request
# import logging
# from telegram import Update, Bot
# from telegram.ext import Application, CommandHandler, CallbackContext
# import os

# app = FastAPI()

# # Set up logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Set up your Telegram bot token
# TELEGRAM_TOKEN = "7766724477:AAHp0r8SvGJIIO9l02VsY6FuZisWFX3YvAg"

# # Initialize the Application with the Telegram bot token
# application = Application.builder().token(TELEGRAM_TOKEN).build()

# # Define a command handler (example command)
# async def start(update: Update, context: CallbackContext):
#     await update.message.reply_text("Hello! I'm your bot.")

# # Add the command handler to the application
# application.add_handler(CommandHandler("start", start))

# # Webhook route for Telegram updates
# @app.post("/webhook")
# async def webhook(request: Request):
#     try:
#         # Parse the incoming webhook data
#         update = await request.json()
#         logger.info(f"Received update: {update}")

#         # Safely access the message and check for 'text'
#         if 'message' in update and isinstance(update['message'], dict):
#             message = update['message']
#             if 'text' in message:
#                 text = message['text']
#                 logger.info(f"Received message text: {text}")
  
#                 chat_id = message['chat']['id']
#                 bot = Bot(TELEGRAM_TOKEN)
                
#                 # Await the asynchronous send_message call
#                 await bot.send_message(chat_id=chat_id, text=f"You said: {text}")
#             else:
#                 logger.warning("No text found in message.")
#         else:
#             logger.warning("No message found in update.")
        
#         # You can add your custom logic here to handle the message
#         # For example, responding back to the user:
#         # bot.send_message(chat_id=update['message']['chat']['id'], text="Received your message!")

#         return {"status": "ok"}
    
#     except Exception as e:
#         logger.error(f"Error processing update: {str(e)}")
#         return {"status": "error", "message": str(e)}

# if __name__ == "__main__":
#     # Run the application
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)

from fastapi import FastAPI, Request
import logging
from telegram import Update, Bot
from telegram.ext import Application, CommandHandler, CallbackContext
import os
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
    # Send a reply with "You said {message}" after receiving any message
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

        # Safely access the message and check for 'text'
        if 'message' in update and isinstance(update['message'], dict):
            message = update['message']
            if 'text' in message:
                text = message['text']
                logger.info(f"Received message text: {text}")
                
                # Send the same message back to the user with "You said {message}"
                chat_id = message['chat']['id']
                bot = Bot(TELEGRAM_TOKEN)
                
                # Await the asynchronous send_message call
                await bot.send_message(chat_id=chat_id, text=f"You said: {text}")
            else:
                logger.warning("No text found in message.")
        else:
            logger.warning("No message found in update.")
        
        return {"status": "ok"}
    
    except Exception as e:
        logger.error(f"Error processing update: {str(e)}")
        return {"status": "error", "message": str(e)}

# Vercel serverless function entry point
def handler(event, context):
    return app(event, context)
