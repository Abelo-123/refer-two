import requests

TOKEN = "7766724477:AAHp0r8SvGJIIO9l02VsY6FuZisWFX3YvAg"
WEBHOOK_URL = "https://bar-aaa-independently-mi.trycloudflare.com/webhook"

# Set the webhook to your FastAPI server URL
response = requests.post(f"https://api.telegram.org/bot{TOKEN}/setWebhook", data={"url": WEBHOOK_URL})

print(response.json())  # Check the response from Telegram
