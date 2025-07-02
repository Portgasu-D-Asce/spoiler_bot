import os
import discord
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv("TOKEN")

intents = discord.Intents.default()
client = discord.Client(intents=intents)

@client.event
async def on_ready():
    print(f"Logged in as {client.user}")

    activity = discord.Streaming(
        name="with anonymous chats 👀",
        url="https://www.twitch.tv/ACE_1357"
    )
    await client.change_presence(status=discord.Status.online, activity=activity)
    print("Live status set!")

client.run(TOKEN)
