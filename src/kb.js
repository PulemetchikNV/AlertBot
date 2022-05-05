import btns from "./kbBtns.js";
import {Scenes, session, Telegraf, Markup, Telegram } from "telegraf"
const kb = {
    key: [[Markup.button.callback(btns.key.addKey, `addKey_`), Markup.button.callback(btns.key.delKey, `delKey_`)]]
}
export default kb