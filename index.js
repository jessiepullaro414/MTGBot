const TelegramBot = require('node-telegram-bot-api');
const mtg = require('mtgsdk')

const token = '';

const bot = new TelegramBot(token, {polling: true});

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }  

bot.onText(/\/names (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    mtg.card.where({ name: resp})
        .then(async cards => {
            let list='';

            await new Promise( (resolve) => {
                for(let i=0; i<cards.length; i++) 
                {
                    if (!((cards[i].setName).includes("Historic"))) {
                        if (!((cards[i].setName).includes("Online"))) {
                            list = list.concat(
                                "Name: " + cards[i].name + 
                                "\nType: " + cards[i].type +
                                (cards[i].manaCost == undefined ? '' : "\nManaCost: " + cards[i].manaCost) + 
                                "\nSet: " + cards[i].setName + 
                                "\nRarity: " + cards[i].rarity + 
                                '\n\n');
                        }
                    }
                }
                resolve(list);
            })

            return list;
        }).then( (list) => {
            if (!list) {
                bot
                    .sendMessage(chatId, "No Cards Found!")
                    .catch((error) => {
                        console.log(error.response.body.description)
                        bot.sendMessage(chatId, error.response.body.description) 
                    })
            } else if (list) {
                bot
                    .sendMessage(chatId, list)
                    .catch((error) => {
                        console.log(error.response.body.description)
                        bot.sendMessage(chatId, error.response.body.description) 
                    })
            } else {
                bot
                    .sendMessage(chatId, "Try again but do it correct this time!")
                    .catch((error) => {
                        console.log(error.response.body.description)
                        bot.sendMessage(chatId, error.response.body.description) 
                    })
            }
        })
1
});

bot.onText(/\/card (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    mtg.card.where({ name: resp})
        .then(async cards => {
            console.log(cards)
                if(cards[0].imageUrl) {
                    bot.sendPhoto(chatId, cards[0].imageUrl)
                } else if (cards[1].imageUrl) {
                    bot.sendPhoto(chatId, cards[1].imageUrl)
                } else {
                    bot.sendMessage(chatId, "No image can be found!")
                }
        });
});

bot.onText( /\/hitme/, (msg) => {
    const chatId = msg.chat.id
    mtg.card.where({ supertypes: 'legendary', type: 'creature'})
        .then(cards => {
            bot
                .sendPhoto(chatId, cards[getRandomInt(cards.length)].imageUrl)
                .catch(error => { bot.sendMessage(chatId, error) })
        });
});