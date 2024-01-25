const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ping',
  description: 'Kiểm tra Ping Bot',
  execute(message, args) {
    const pingEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Ping')
      .setDescription('Độ trễ của bot.')
      .setTimestamp();

    message.reply({ embeds: [pingEmbed] }).then(sentMessage => {
      const ping = sentMessage.createdTimestamp - message.createdTimestamp;

      const updatedPingEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Ping')
        .setDescription(`Độ trễ của Bot là: ${ping}ms`)
        .setTimestamp();

      sentMessage.edit({ embeds: [updatedPingEmbed] });
    });
  },
};
