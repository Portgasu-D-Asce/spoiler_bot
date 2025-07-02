const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
  console.log(`${client.user.tag} is online`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('!a ')) {
    const text = message.content.slice(3).trim(); 
    if (!text) return message.reply("❌ Please provide a message.");

    
    const webhook = await message.channel.createWebhook({
      name: 'Anonymous',
      avatar: '', 
    });

    await webhook.send({
      content: text,
    });

    await webhook.delete();  

    await message.delete(); 
  }
});

client.login(process.env.TOKEN);

