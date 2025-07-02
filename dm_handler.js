const fs = require('fs');
const path = require('path');

module.exports = async function handleDM(message) {
  const username = message.author.username;
  const userId = message.author.id;
  const tag = message.author.tag;
  const content = message.content;
  const timestamp = new Date().toISOString();

  //logs/dm_logs_YYYY-MM-DD.log
  const dateStr = new Date().toISOString().split('T')[0];
  const logFileName = `dm_logs_${dateStr}.log`;
  const logPath = path.join(__dirname, '../logs', logFileName);

  try {
    await message.reply(`Hey ${username} 👋\nUse  !a <message>  to send an anonymous message in the server.\nThis is a DM, so your identity is safe.`);

    const successLog = `[${timestamp}] SUCCESS:
User: ${tag} (ID: ${userId})
Message: ${content}\n\n`;

    fs.appendFile(logPath, successLog, (fsErr) => {
      if (fsErr) console.error('Failed to write success log:', fsErr);
    });

  } catch (err) {
    const errorLog = `[${timestamp}] ERROR:
User: ${tag} (ID: ${userId})
Message: ${content}
Error: ${err.stack}\n\n`;

    fs.appendFile(logPath, errorLog, (fsErr) => {
      if (fsErr) console.error('Failed to write error log:', fsErr);
    });
  }
};
