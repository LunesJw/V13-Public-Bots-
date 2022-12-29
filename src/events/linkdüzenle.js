module.exports = async (oldMessage, newMessage, message) => {

    if(newMessage.author.bot || !newMessage.guild) return;
    
    const reklam = ["discord.app", "discord.gg", "discordapp", "discordgg", ".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".party", ".rf.gd", ".az", ".cf", ".me", ".in"]
            
    if(reklam.some(word => newMessage.content.includes(word))) {
    if(newMessage.deletable) newMessage.delete({timeout: 0030 }).catch(console.error); return newMessage.channel.send({content: `:link: Sunucuda Reklam Yasak`}).then((e) => setTimeout(() => { e.delete(); }, 5000))}
    
    }
    module.exports.conf = {
     name: "messageUpdate",
    }