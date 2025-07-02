const { Client, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();
const handleDM = require('./dmHandler');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages, // dm
  ],
  partials: [Partials.Channel] 
});

client.once('ready', () => {
  console.log(`${client.user.tag} is online`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.channel.type === 1) { 
    return handleDM(message);
  }

  if (message.content.startsWith('!a ')) {
    const text = message.content.slice(3).trim();
    if (!text) return message.reply("Please provide a message.");

    const webhook = await message.channel.createWebhook({
      name: 'Anonymous',
      avatar: '',
    });

    await webhook.send({ content: text });
    await webhook.delete();
    await message.delete();
  }
});

client.login(process.env.TOKEN);
