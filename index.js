const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const fs = require('fs');
const { printWatermark } = require('./functions/handlers');
const figlet = require('figlet');
const express = require('express');
const path = require('path');

const client = new Client({
  intents: Object.keys(GatewayIntentBits).map((a) => {
    return GatewayIntentBits[a];
  }),
});

const prefix = 'anb';
client.commands = new Map();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('messageCreate', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('❌ Lệnh bị hạn chế - Hoặc không đủ quyền dùng.');
  }
});

async function login() {
  try {
    await client.login(process.env.TOKEN);
    console.log('\x1b[32m%s\x1b[0m', '|    🍔 Bot đã đăng nhập thành công!');
    console.log('\x1b[36m%s\x1b[0m', '|    🚀 Lệnh được tải thành công!');
    console.log('\x1b[32m%s\x1b[0m', `|    🌼 Đăng nhập như ${client.user.username}`);
    console.log('\x1b[36m%s\x1b[0m', `|    🏡 Bot đang ở trong ${client.guilds.cache.size} servers`);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Đăng nhập thất bại:', error);
    console.log('\x1b[31m%s\x1b[0m', '❌ Khách hàng không đăng nhập, Vui lòng khởi động lại quá trình...');
    process.kill(1);
  }
}

client.once('ready', () => {
  setTimeout(() => {
    console.log('\x1b[32m%s\x1b[0m', `|    🎯 Hoạt động đã được thiết lập thành công!`);
    client.user.setPresence({
      activities: [{ name: `lệnh của Cherry`, type: ActivityType.Listening, state: "🍒𝗖𝗵𝗲𝗿𝗿𝘆 𝗬𝗲̂𝘂 🐰𝗦𝗮𝘆𝗼𝗻𝗮𝗿𝗮 - 12/10/2023" }],
      status: 'online',
    });
  }, 2000); 
});

login();

setInterval(() => {
  if (!client || !client.user) {
    console.log('\x1b[31m%s\x1b[0m', '❌Khách hàng chưa đăng nhập, Đang khởi động lại quá trình...');
    process.kill(1);
  }
}, 15000);

const app = express();
const port = 3000;
app.get('/', (req, res) => {
  const imagePath = path.join(__dirname, 'index.html');
  res.sendFile(imagePath);
});
app.listen(port, () => console.log('\x1b[36m%s\x1b[0m', `|    🔗 Cherry đang mở cổng : ${port}`));

module.exports = client;
printWatermark();
