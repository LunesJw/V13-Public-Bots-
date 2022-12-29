module.exports = async (message) => {

if(message.author.id === "") return;
if(message.author.id === "") return;

const reklam = ["discord.app", "discord.gg", "discordapp", "discordgg", ".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".party", ".rf.gd", ".az", ".cf", ".me", ".in"]
    
if(reklam.some(word => message.content.includes(word))) {
if(message.deletable) message.delete({timeout: 0030 }).catch(console.error); return message.channel.send({content: `:link: Sunucuda Reklam Yasak`}).then((e) => setTimeout(() => { e.delete(); }, 5000))}

}
module.exports.conf = {
 name: "message",
}