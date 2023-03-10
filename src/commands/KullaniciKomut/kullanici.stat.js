const {  voice, mesaj2, star, miniicon } = require("../../configs/emojis.json");
const messageUserChannel = require("../../schemas/messageUserChannel");
const voiceUserChannel = require("../../schemas/voiceUserChannel");
const messageUser = require("../../schemas/messageUser");
const voiceUser = require("../../schemas/voiceUser");
const voiceUserParent = require("../../schemas/voiceUserParent");
const moment = require("moment");
const inviterSchema = require("../../schemas/inviter");
let { Stats, Seens } = require('../../schemas/Tracking');
require("moment-duration-format");
const { MessageEmbed, MessageActionRow, MessageSelectMenu, } = require("discord.js");
const conf = require("../../configs/sunucuayar.json")
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    conf: {
      aliases: ["ramals","statss"],
      name: "ramals",
      help: "ramals"
    },
  
run: async (client, message, args, embed, prefix) => {

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const inviterData = await inviterSchema.findOne({ guildID: message.guild.id, userID: member.user.id });
    const total = inviterData ? inviterData.total : 0;
    const regular = inviterData ? inviterData.regular : 0;
    const bonus = inviterData ? inviterData.bonus : 0;
    const leave = inviterData ? inviterData.leave : 0;
    const fake = inviterData ? inviterData.fake : 0;
    let seens = await Seens.findOne({userID: member.user.id});
    const category = async (parentsArray) => {
        const data = await voiceUserParent.find({ guildID: message.guild.id, userID: member.id });
        const voiceUserParentData = data.filter((x) => parentsArray.includes(x.parentID));
        let voiceStat = 0;
        for (var i = 0; i <= voiceUserParentData.length; i++) {
          voiceStat += voiceUserParentData[i] ? voiceUserParentData[i].parentData : 0;
        }
        return moment.duration(voiceStat).format("H [saat], m [dakika] s [saniye]");
      };
      
      const Active1 = await messageUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 });
      const Active2 = await voiceUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 });
      let messageTop;
      Active1.length > 0 ? messageTop = Active1.splice(0, 5).map(x => `<#${x.channelID}>: \`${Number(x.channelData).toLocaleString()} mesaj\``).join("\n") : messageTop = "Veri bulunmuyor."

      const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: member.id });
      const voiceData = await voiceUser.findOne({ guildID: message.guild.id, userID: member.id });
      const messageWeekly = messageData ? messageData.weeklyStat : 0;
      const voiceWeekly = moment.duration(voiceData ? voiceData.weeklyStat : 0).format("H [saat], m [dakika]");
      const messageDaily = messageData ? messageData.dailyStat : 0;
      const voiceDaily = moment.duration(voiceData ? voiceData.dailyStat : 0).format("H [saat], m [dakika]");

      const row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setPlaceholder('Kullan??c??n??n Statlar??n?? G??r??nt??le')
          .setCustomId('kurulumselect')
          .addOptions([
          { 
              label: "Ses ??statistik Detay",
              description: "Ses istatistiklerinin detayl?? bilgilerini g??r??nt??lemektedir.",
              value: "weeklyStat",
              emoji: "????"

          },
          { 
            label: "Mesaj ??statistik Detay",
            description: "Mesaj istatistiklerinin detayl?? bilgilerini g??r??nt??lemektedir.",
            value: "InviteRegisterStat",
            emoji: "??????"

          },
          { 
            label: "Kapat",
            description: "Men??y?? Kapat.",
            value: "closeMenu",
            emoji: "???"
          }
        ])
        );


        embed.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) }).setTimestamp().setColor(message.author.displayHexColor).setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })}).setThumbnail(message.guild.iconURL({ dynamic: true }))
      embed.setDescription(`${member.toString()} Adl?? ??yesinin <t:${Math.floor(Date.now() / 1000)}:R> tarihinden  itibaren Sunucumuzdaki Toplam ??statistikleri A??a????da Belirtilmi??tir!`)
.addFields(
{ name: "**Toplam Ses**",  value: `
\`\`\`css
${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}
\`\`\`
`, inline: true },
{ name: "**Toplam Mesaj**",  value: `
\`\`\`css
${messageData ? messageData.topStat : 0} mesaj
\`\`\`
`, inline: true },
{ name:"**Toplam Davet**",  value: `
\`\`\`css
${inviterData ? `${total} regular`: "Veri bulunmuyor."} 
\`\`\`
`, inline: true },
 )

      embed.addField(`${client.emojis.cache.find(x => x.name === "voice")} **Ses ??statisti??i**`, `
             

            ${client.emojis.cache.find(x => x.name === "miniicon")} Haftal??k Ses Aktifli??i : \` ${voiceWeekly} \`
            ${client.emojis.cache.find(x => x.name === "miniicon")} G??nl??k Ses Aktifli??i : \` ${voiceDaily} \`
            
            ${client.emojis.cache.find(x => x.name === "mesaj2")} **Yaz?? ??statisti??i**
            ${client.emojis.cache.find(x => x.name === "miniicon")} Haftal??k At??lan Mesaj : \` ${Number(messageWeekly).toLocaleString()} mesaj \`
            ${client.emojis.cache.find(x => x.name === "miniicon")} G??nl??k At??lan Mesaj : \` ${Number(messageDaily).toLocaleString()} mesaj \`
            
            ${star} **Davetleri :** **${total}** (**${regular}** ger??ek, **${bonus}** bonus, **${leave}** ayr??lm????, **${fake}** fake)
            `, false);
            let msg = await message.channel.send({ components: [row], embeds: [embed] })
            message.react(`${client.emojis.cache.find(x => x.name === "green")}`);
             msg.awaitMessageComponent({ filter: (component) => component.user.id === message.author.id, componentType: 'SELECT_MENU',}).then(async (interaction) => {
             if(interaction.values[0] == "genelStat") {
                const embeds = new MessageEmbed()
.setDescription(`???? A??ag??da **${message.guild.name}** sunucusunun genel sohbet (\`mesaj\`) s??ralamas?? listelenmektedir.`)

.addFields(
{ name: "__**Toplam Mesaj**__",  value: `
\`\`\`css
${messageData ? messageData.topStat : 0} mesaj
\`\`\`
`, inline: true },
{ name: "__**Haftal??k Mesaj**__",  value: `
\`\`\`css
${Number(messageWeekly).toLocaleString()} mesaj
\`\`\`
`, inline: true },
{ name:"__**G??nl??k Mesaj**__",  value: `
\`\`\`css
${Number(messageDaily).toLocaleString()} mesaj
\`\`\`
`, inline: true },
)
embeds.addField(`${star} **Mesaj ??statisti??i**`, `
${messageTop}

Genel Sohbet (\`mesaj\`) s??ralamas?? \`${moment(Date.now()).format("LLL")}\` tarihinde otomotik olarak g??ncellenmi??tir.
`, false);

            interaction.update({ components: [row], embeds: [embeds] }).then(e => setTimeout(() => interaction.message.delete().catch(() => { }), 30000))}		 
             if(interaction.values[0] == "weeklyStat") {
                const embeds = new MessageEmbed()
                .setDescription(`???? A??ag??da **${message.guild.name}** sunucusunun genel sohbet (\`ses\`) s??ralamas?? listelenmektedir.`)
.addFields(
{ name: "__**Toplam Ses**__",  value: `
\`\`\`css
${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}
\`\`\`
`, inline: true },
{ name: "__**Haftal??k Ses**__",  value: `
\`\`\`css
${voiceWeekly}
\`\`\`
`, inline: true },
{ name:"__**G??nl??k Ses**__",  value: `
\`\`\`css
${voiceDaily}
\`\`\`
`, inline: true },
 )
                
                  embeds.addField(`${star} **Sesli Sohbet ??statisti??i**`, `
                ${client.emojis.cache.find(x => x.name === "miniicon")} Toplam: \` ${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")} \`
                ${client.emojis.cache.find(x => x.name === "miniicon")} Public Odalar: \` ${await category(conf.publicParents)} \`
                ${client.emojis.cache.find(x => x.name === "miniicon")} Secret Odalar: \` ${await category(conf.privateParents)} \`
                ${client.emojis.cache.find(x => x.name === "miniicon")} Alone Odalar: \` ${await category(conf.aloneParents)} \`
                ${client.emojis.cache.find(x => x.name === "miniicon")} Y??netim Yetkili Odalar??: \` ${await category(conf.funParents)} \`
                ${client.emojis.cache.find(x => x.name === "miniicon")} Kay??t Odalar??: \` ${await category(conf.registerParents)} \`
                ${client.emojis.cache.find(x => x.name === "miniicon")} Son G??r??lme Seste ${seens.lastSeenVoice ? `<t:${String(seens.lastSeenVoice ? seens.lastSeenVoice : Date.now()).slice(0, 10)}:R>` : "Son Seste G??r??lme Bulunamad??!"}

                Genel Sohbet (\`ses\`) s??ralamas?? \`${moment(Date.now()).format("LLL")}\` tarihinde otomotik olarak g??ncellenmi??tir.
                 `, false);

                interaction.update({ components: [row], embeds: [embeds] }).then(e => setTimeout(() => interaction.message.delete().catch(() => { }), 30000))}
                if(interaction.values[0] == "InviteRegisterStat") {
                
                    const embeds = new MessageEmbed()
.setDescription(`???? A??ag??da **${message.guild.name}** sunucusunun genel sohbet (\`mesaj\`) s??ralamas?? listelenmektedir.`)

.addFields(
{ name: "__**Toplam Mesaj**__",  value: `
\`\`\`css
${messageData ? messageData.topStat : 0} mesaj
\`\`\`
`, inline: true },
{ name: "__**Haftal??k Mesaj**__",  value: `
\`\`\`css
${Number(messageWeekly).toLocaleString()} mesaj
\`\`\`
`, inline: true },
{ name:"__**G??nl??k Mesaj**__",  value: `
\`\`\`css
${Number(messageDaily).toLocaleString()} mesaj
\`\`\`
`, inline: true },
)
embeds.addField(`${star} **Mesaj ??statisti??i**`, `
${messageTop}

Genel Sohbet (\`mesaj\`) s??ralamas?? \`${moment(Date.now()).format("LLL")}\` tarihinde otomotik olarak g??ncellenmi??tir.
`, false);
    
                    interaction.update({ components: [row], embeds: [embeds] }).then(e => setTimeout(() => interaction.message.delete().catch(() => { }), 30000))
                }                                
                    if(interaction.values[0] == "closeMenu") {
                        interaction.message.delete()					
                        }
                

                    
                
                    })

}
}