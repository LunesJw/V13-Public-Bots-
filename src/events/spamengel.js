const conf = require("../configs/sunucuayar.json")

const usersMap = new Map();
const LIMIT = 5;
const TIME = 10000;
const DIFF = 2000;

module.exports = async (message) => {

if(message.author.bot) return;
if(message.member.permissions.has("ADMINISTRATOR")) return;
if(message.member.roles.cache.get(conf.ChatMute)) return;
if(usersMap.has(message.author.id)) {
  
const userData = usersMap.get(message.author.id);
const { lastMessage, timer } = userData;
const difference = message.createdTimestamp - lastMessage.createdTimestamp;
let msgCount = userData.msgCount;
  
if(difference > DIFF) { clearTimeout(timer); userData.msgCount = 1; userData.lastMessage = message; userData.timer = setTimeout(() => { usersMap.delete(message.author.id); }, TIME); usersMap.set(message.author.id, userData)}
else { msgCount++;
if (parseInt(msgCount) === LIMIT) {
  
    const chatMute = message.guild.roles.cache.get("1038110717653553152")
    message.member.roles.add(chatMute)
message.reply({content: `15 dakika spam engel yedin Karrrrdeşim`})
setTimeout(() => {
  
if(!message.member.roles.cache.get(conf.chatMute)) return;
message.member.roles.remove(chatMute);
message.reply({content: `Spam Engelin Açıldı Amk cocu`})})
} else { userData.msgCount = msgCount; usersMap.set(message.author.id, userData)}} 
} else {
let fn = setTimeout(() => { usersMap.delete(message.author.id)}, TIME); usersMap.set(message.author.id, { msgCount: 1, lastMessage: message, timer: fn })}

}
module.exports.conf = {
 name: "message",
}