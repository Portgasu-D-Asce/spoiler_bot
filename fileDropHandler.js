// fileDropHandler.js
const { AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = async function handleFileDrop(message) {
  const content = message.content;
  const tag = message.author.tag;
  const timestamp = new Date().toISOString();

  const parts = content.split(' ');
  if (parts.length < 2) {
    return await message.reply("Please provide a channel ID.\nUsage: `!af <channel_id> [optional caption]`");
  }

  const channelId = parts[1];
  const fileNote = parts.slice(2).join(' ') || '📎 Anonymous file drop';
  const files = message.attachments.map(att => new AttachmentBuilder(att.url, { name: att.name }));

  const dateStr = timestamp.split('T')[0];
  const logDir = path.join(__dirname, 'logs');
  const logFileName = `dm_logs_${dateStr}.log`;
  const logPath = path.join(logDir, logFileName);
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

  if (!files.length) {
    return await message.reply("Please attach a file to drop anonymously.");
  }

  try {
    const targetChannel = await message.client.channels.fetch(channelId);
    if (!targetChannel || !targetChannel.isTextBased()) {
      return await message.reply("Invalid channel ID or channel is not text-based.");
    }

    await targetChannel.send({
      content: fileNote,
      files: files,
    });

    await message.reply("File sent anonymously to the server.");

    const log = `[${timestamp}] FILE DROP SUCCESS:
User: ${tag}
Channel: ${channelId}
Message: ${fileNote}
Files: ${files.map(f => f.name).join(', ')}\n\n`;
    fs.appendFile(logPath, log, err => err && console.error('Log error:', err));
  } catch (err) {
    const errorLog = `[${timestamp}] FILE DROP ERROR:
User: ${tag}
Channel: ${channelId}
Message: ${content}
Error: ${err.stack}\n\n`;
    fs.appendFile(logPath, errorLog, fsErr => fsErr && console.error('Log error:', fsErr));
    await message.reply("Failed to drop file. Make sure the channel ID is correct and the bot has access.");
  }
};
