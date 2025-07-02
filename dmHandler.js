const fs = require('fs');
const path = require('path');
const handleFileDrop = require('./fileDropHandler');

module.exports = async function handleDM(message) {
  const username = message.author.username;
  const tag = message.author.tag;
  const content = message.content;
  const timestamp = new Date().toISOString();

  const dateStr = timestamp.split('T')[0];
  const logDir = path.join(__dirname, 'logs');
  const logFileName = `dm_logs_${dateStr}.log`;
  const logPath = path.join(logDir, logFileName);
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

  try {
    if (content.startsWith('!af')) {
      return await handleFileDrop(message);
    }

    await message.reply(`Hey ${username} 👋\nUse \`!a <msg>\` to send anonymous messages.\nUse \`!af <channel_id> [optional caption]\` and attach a file to drop anonymously.`);
    
    const log = `[${timestamp}] DM SUCCESS:
User: ${tag}
Message: ${content}\n\n`;
    fs.appendFile(logPath, log, err => err && console.error('Log error:', err));
  } catch (err) {
    const errorLog = `[${timestamp}] ERROR:
User: ${tag}
Message: ${content}
Error: ${err.stack}\n\n`;
    fs.appendFile(logPath, errorLog, fsErr => fsErr && console.error('Failed to write error log:', fsErr));
  }
};
