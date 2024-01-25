const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'announce',
  description: 'Gửi thông báo đến kênh được chỉ định (Mods Only)',
  async execute(message, args) {
    try {
      if (!message.guild) {
        return message.reply('Lệnh này chỉ có thể được sử dụng trong máy chủ (guild).');
      }

      const requiredPermissions = ['MANAGE_MESSAGES', 'MANAGE_GUILD', 'ADMINISTRATOR'];

      const hasRequiredPermission = requiredPermissions.some((permission) =>
        message.member.permissions.has(permission)
      );

      if (!hasRequiredPermission) {
        return message.reply('Bạn không có quyền sử dụng lệnh này. (Mods Only)');
      }

      const dataPath = path.join(__dirname, '../data/announcementChannels.json');
      let serverData = {};

      try {
        serverData = require(dataPath);
      } catch (err) {
        console.error('Error reading server data:', err);
        return message.reply('Đã xảy ra lỗi khi đọc dữ liệu máy chủ. Vui lòng thử lại sau.');
      }

      const channelId = serverData[message.guild.id];

      if (!channelId) {
        return message.reply('Kênh thông báo chưa được thiết lập.');
      }

      const channel = message.guild.channels.cache.get(channelId);

      if (!channel) {
        return message.reply('Kênh thông báo không được tìm thấy.');
      }

      const embed = new EmbedBuilder();

      const title = await askQuestion(message, '**1. Nhập tiêu đề cho thông báo của bạn: **');
      if (title !== 'skip') embed.setTitle(title);

      const color = await askQuestion(message, '**2. Chỉ định màu của Embed:**');
      if (color !== 'skip') embed.setColor(color);

      const description = await askQuestion(message, '**3. Viết mô tả tin nhắn :** ');
      if (description !== 'skip') embed.setDescription(description);

      const imageUrl = await askQuestion(message, '**4. Bạn có URL hình ảnh cho thông báo không:** ');
      if (imageUrl !== 'skip') embed.setImage(imageUrl);

      embed.setTimestamp();

      // Ask for confirmation before sending the message.
      const confirmation = await askQuestion(message, '▶️ Bạn có muốn gửi không? (Nhập **yes** để gửi)');

      if (confirmation.toLowerCase() === 'yes') {
        channel.send({ embeds: [embed] });
        message.reply('Thông báo đã được gửi!');
      } else {
        message.reply('Thông báo bị hủy bỏ.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      message.reply('❌ Lệnh bị hạn chế.');
    }
  },
};

async function askQuestion(message, question) {
  const questionEmbed = new EmbedBuilder()
    .setColor('#0099ff')
    .setAuthor({
        name: 'Tạo tin nhắn Embed',
        iconURL: 'https://cdn.discordapp.com/attachments/1156866389819281418/1162304862248255538/message-icon-png-10.png', 
        url: 'https://discord.gg/FUEHs7RCqz'
    })
    .setDescription(question)
    .setFooter({ text: 'Nhập "Skip" đẻ bỏ qua!' });
  
  await message.reply({ embeds: [questionEmbed] });
  
  return new Promise(resolve => {
    const filter = m => m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector({ filter, max: 1 });

    collector.on('collect', m => {
      const response = m.content.toLowerCase();
      
      if (response === 'skip' || response === '!skip') {
        resolve('skip');
        
      } else {
        resolve(m.content);
        
      }
    });
  });
}
