import {Scenes, session, Telegraf, Markup, Telegram } from "telegraf"
import express from 'express'
import config from "../config.js";
import conn from "../conn.js";
import kb from "./kb.js";
import btns from "./kbBtns.js";
const app = express()
const bot = new Telegraf(config.TOKEN)

app.listen(config.PORT, async()=>{
    console.log(`Bot is running on port ${config.PORT}`);
});
app.get('/sendTo', async (req, res) =>{
    res.sendStatus(200)
    var message = req.query.message
    var key = req.query.key + ''
    conn.query('SELECT * FROM `users` WHERE `key` = "' + key + '"',(err,res)=>{
        if(err){
            console.log('ERR:', err);
        }else{
            console.log(res);
            for(let r of res){
                bot.telegram.sendMessage(r.userId, message)
            }
        }
    })
    
})
const requestKey = new requestKeyScene()
const deleteKey = new deleteKeyScene()
const stage = new Scenes.Stage([
    requestKey,
    deleteKey
])
bot.use(session())
bot.use(stage.middleware())


// bot.command('start', async ctx=>{
//     ctx.deleteMessage()
//     const userId = ctx.message.from.id
//     ctx.scene.enter(`requestKey`)
//     // ctx.reply('Вы авторизовались', Markup.keyboard([['Добавить ключ', 'Удалить ключ']]))
// })
bot.on('message', async ctx=>{
    ctx.session.userId = ctx.message.from.id
    const userId = ctx.session.userId
    switch (ctx.message.text) {
        // case btns.key.addKey:
        //     ctx.scene.enter('requestKey')
        //     break 
        // case btns.key.delKey:
        //     ctx.scene.enter('deleteKey')
        //     break
        case '/start':
            if(ctx.message){
                ctx.deleteMessage()
            }
            showMenu(ctx)
            break
        default:
            if(ctx.message){
                ctx.deleteMessage();
            }   
            showMenu(ctx)
            break
    }
})
bot.on('callback_query', async ctx=>{
    ctx.session.userId = ctx.callbackQuery.from.id
    const userId = ctx.session.userId
    var data = ctx.callbackQuery.data.split('_')
    switch(data[0]){
        case 'addKey':
            ctx.deleteMessage();
            ctx.scene.enter('requestKey')
            break
        case 'showKeys':
            ctx.deleteMessage();
            showList(ctx, userId);
            break
        case 'delKey':
            ctx.deleteMessage();
            ctx.scene.enter('deleteKey')
            break
        case 'back':
            ctx.deleteMessage()
            showMenu(ctx)
            break
        default:
            break
            
    }
})
bot.launch()


//=================SCENES=========================
function requestKeyScene(){
    const requestKey = new Scenes.BaseScene(`requestKey`)
    requestKey.enter(async ctx =>await ctx.reply('Введите ключ:', Markup.inlineKeyboard([Markup.button.callback('Назад', `back_`)])))
    requestKey.on('text', async ctx => {

        ctx.deleteMessage();
        const key = ctx.message.text
        const userId = ctx.message.from.id
        if(key.length !== 36){
            ctx.reply(`Неверный формат ключа`)
        }else{

            conn.query('SELECT * FROM `users` WHERE `key` = "' + key + '" and userId = "' + userId + '"', (err,res)=>{
                if(err){
                    console.log(err);
                }else{
                    if(res.length == 0){
                        conn.query(`INSERT INTO users VALUES('${userId}', '${key}')`, (err, res)=>{
                            if(err){
                                console.log(err);
                                ctx.reply(`Произошла ошибка при добавлении ключа`)
                            }else{
                                ctx.reply(`Ключ добавлен`)
                            }
                        })
                    }else{
                        ctx.reply(`Вы пытаетесь добавить уже существующий ключ!`)
                        
                    }
                }
            })
        }
        showMenu(ctx)
        ctx.scene.leave()
    })
    requestKey.on(`callback_query`, async ctx =>{
        ctx.deleteMessage();
        showMenu(ctx)
        ctx.scene.leave()
    })
    return requestKey
}

function deleteKeyScene(){
    const deleteKey = new Scenes.BaseScene('deleteKey')
    deleteKey.enter(ctx=>{
        conn.query('SELECT * FROM `users` WHERE `userId` = "' + ctx.session.userId + '"', (err,res)=>{
            if(err){
                console.log(err);
            }else{
                if(res.length == 0){
                    ctx.reply(`Похоже, у вас нет ни одного ключа`, Markup.inlineKeyboard([Markup.button.callback('Назад', `back_`)]))
                }else{
                    let kb = []
                    for(let a of res){
                        kb.push([Markup.button.callback(a[`key`], `${a[`key`]}`)])
                    }
                    kb.push([Markup.button.callback('Назад', `back_`)])
                    ctx.reply(`Выберете ключ, который хотите удалить`, Markup.inlineKeyboard(kb))
                }
            }
        })
        
    })
    
    deleteKey.on(`callback_query`, ctx=>{
        ctx.session.userId = ctx.callbackQuery.from.id
        ctx.answerCbQuery();
        ctx.deleteMessage();
        if(ctx.callbackQuery.data != 'back_'){
            conn.query('DELETE FROM `users` WHERE `userId` = "' + ctx.session.userId + '" and `key` = "' + ctx.callbackQuery.data + '"', (err,res)=>{
                if(err){
                    console.log(err);
                }else{
                    setTimeout(() => {
                        ctx.reply(`Удалено`)
                    }, 150);
                }
            })
        }else{
            showMenu(ctx)
        }
        
        ctx.scene.leave()
    })
    return deleteKey
}


//===========Functions==============
function showMenu(ctx){
   setTimeout(() => {
        ctx.reply(`Возможные действия:`, Markup.inlineKeyboard(kb.key))
   }, 150);
}
function showList(ctx, userId){
    conn.query('SELECT * FROM `users` WHERE `userId` = "' + userId + '"', (err,res)=>{
        if(err){
            console.log(err);
        }else{
            if(res.length == 0){
                ctx.reply(`Похоже, у вас нет ни одного ключа`, Markup.inlineKeyboard([Markup.button.callback('Назад', `back_`)]))
            }else{
                let kb = []
                for(let a of res){
                    kb.push([Markup.button.callback(a[`key`], `${a[`key`]}`)])
                }
                kb.push([Markup.button.callback('Назад', `back_`)])
                ctx.reply(`Список ключей:`, Markup.inlineKeyboard(kb))
            }
        }
    })
        
}