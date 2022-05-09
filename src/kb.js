var btns = require('./kbBtns.js')
var {Scenes, session, Telegraf, Markup, Telegram } = require('telegraf')
const kb = {
    key: [[Markup.button.callback(btns.key.addKey, `addKey_`), Markup.button.callback(btns.key.showKeys, `showKeys_`), Markup.button.callback(btns.key.delKey, `delKey_`)]]
}
module.exports = kb