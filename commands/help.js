const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Hiển thị các lệnh của Bot',
  execute(message, args, commandList) {
    const botUser = message.client.user;

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Bot Commands')
      .setDescription('▶️  **Các lệnh có sẵn :**\n‎ ')
      .addFields(
        { name: '`anbsetup`', value: 'Cấu hình kênh để bot gửi thông báo.' },
        
        { name: '`anbannounce`', value: 'Bắt đầu tạo Tin nhắn thông báo nhúng.' },
        
        { name: '`anbping`', value: 'Kiểm tra độ trễ của Bot.' }
      )
      .setFooter({ text: 'Made By Cherry' })
      .setThumbnail(botUser.avatarURL({ dynamic: true, format: 'png', size: 1024 }));

    message.reply({ embeds: [embed] });
  },
};
