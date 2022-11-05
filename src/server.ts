import axios from 'axios';
import { Telegraf } from 'telegraf'
import getBotTokenOrQuit from './util/getBotToken';

const botToken = getBotTokenOrQuit();

const bot = new Telegraf(botToken)

bot.start((ctx) => ctx.reply("Hello!  Let's talk!"))
bot.help((ctx) => ctx.reply('Hmm i am not programmed to be helpful, yet!'))
bot.hears('hello', (ctx) => ctx.reply('Ok, I heard you say hello'))
bot.command('sing', (ctx) => ctx.reply('La la la!  I got your command.'))
bot.command('date', (ctx) => ctx.reply(`${new Date}`))

//Reply with a random joke
bot.command('joke', async (ctx) => {
    try{
        const response = await axios.get('https://official-joke-api.appspot.com/jokes/random')
        const setup = response.data.setup
        const punchline = response.data.punchline
        const punchlinePrompts= ['what', 'why', 'how']

        ctx.reply(setup)
        bot.hears([...punchlinePrompts], (ctx) => ctx.reply(punchline))
    }
    catch(error){
        ctx.reply('Sorry, no can do')
    }
    })

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
