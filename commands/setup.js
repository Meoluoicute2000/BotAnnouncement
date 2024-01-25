const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'setup',
  description: 'Đặt kênh thông báo',
  execute(message, args) {
    if (!message.guild) {
      return message.reply('Lệnh này chỉ có thể được sử dụng trong máy chủ (guild).');
    }

    if (!message.member.permissions.has('MANAGE_GUILD')) {
      return message.reply('Bạn không có quyền đặt kênh thông báo.');
    }

    const channel = message.mentions.channels.first();

    if (!channel) {
      const embed = new EmbedBuilder()
        .setColor('#0099ff') 
        .setTitle('Đề cập đến kênh')
        .setDescription(`Hãy đề cập đến một kênh để thông báo.\n\n**Cách sử dụng:** \`anbsetup #kênh đặt thông báo\``)
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } else {
 
      const dataPath = path.join(__dirname, '../data/announcementChannels.json');
      let serverData = {};

      try {
        serverData = require(dataPath);
      } catch (err) {
        console.error('Error reading server data:', err);
      }

 
      serverData[message.guild.id] = channel.id;

     
      fs.writeFileSync(dataPath, JSON.stringify(serverData, null, 2), 'utf-8');

      console.log(`Announcement channel set to: ${channel.name}`);

      const embed = new EmbedBuilder()
        .setColor('#0099ff') 
        .setTitle('Bộ kênh thông báo')
        .setDescription(`Kênh thông báo đã được đặt thành ${channel}`)
        .setTimestamp();

      message.reply({ embeds: [embed] });
    }
  },
};
