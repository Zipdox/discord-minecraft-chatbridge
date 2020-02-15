const mineflayer = require('mineflayer');
const Discord = require('discord.js');
const config = require('./config.js');
const client = new Discord.Client();


const bot = mineflayer.createBot(config.minecraft);


function say(text){
    if(text.length > 256){
        text = text.match(/.{1,256}/g)[0];
    }
    bot.chat(text);
}


bot.on('login', function(){
    console.log('Logged in to Minecraft as', bot.username);
});

var discordReady = false;
client.on('ready', () => {
    console.log('Logged in to Discord as', client.user.tag);
    discordReady = true;
});

bot.on('message', jsonMsg => {
    if(!discordReady) return;

    var rawText = '';
    function iterateMsg(jmessage){
        if(jmessage.text != undefined){
            if(jmessage.text.length > 0){
                rawText += jmessage.text;
            }
        }
        if(jmessage.extra != undefined){
            for(var msgPart of jmessage.extra){
                iterateMsg(msgPart);
            }
        }
    }
    iterateMsg(jsonMsg.json);
    // console.log(rawText);
    if(rawText.length == 0) return;
    if (!/\S/.test(rawText)) return;
    rawText = '```' + rawText.replace(new RegExp('`', 'g'), '​`').replace(/§/g, '') + '```';
    client.channels.get(config.channelid).send(rawText.replace(new RegExp('​````', 'g'), '​```'));
});


client.on('message', msg => {
    if(msg.bot || msg.author.id == client.user.id) return;
    say(`<${msg.author.username}> ${msg.content}`);
});


setInterval(function(){
    if(bot.entity != undefined){
      var yaw = Math.random() * 2 * Math.PI - Math.PI;
      var pitch = Math.random() * Math.PI - (0.5 * Math.PI);
      bot.look(yaw, pitch, true);
    }
}, 5000);

client.login(config.token);
