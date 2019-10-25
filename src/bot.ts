import { config } from 'dotenv'
import { api } from './util/api'
import fs from 'fs'
import Telegraf, { ContextMessageUpdate } from 'telegraf'
import Stage from 'telegraf/stage'
// import { TelegrafMongoSession } from 'telegraf-session-mongodb'
import LocalSession from 'telegraf-session-local'
// import mongoose from 'mongoose'
import rp from 'request-promise'
import logger from './util/logger'
import random from './controllers/random'
import startScene from './controllers/start'
import searchScene from './controllers/search'
import songScene from './controllers/song'
import favoriteScene from './controllers/favorite'
import asyncWrapper from './util/error-handler'
import { getMainKeyboard } from './util/keyboards'
import { sendSticker, stickers } from './util/common'
import { download } from './controllers/song/actions'
import { song } from './controllers/search/actions'

import texts from './texts'
/*
const mongodb = mongoose.connect(`mongodb://localhost:27017/${process.env.DATABASE_HOST}`, {
  useNewUrlParser: true,
  useFindAndModify: false
})

mongoose.connection.on('error', err => {
  logger.error(
    undefined,
    `Error occured during an attempt to establish connection with the database: %O`,
    err
  )
  process.exit(1)
})
*/
//mongoose.connection.on('open', () => {
  const bot = new Telegraf(process.env.TELEGRAM_TOKEN)
  const stage = new Stage([
    startScene,
    searchScene,
    songScene,
    favoriteScene
  ])

//  let session: any
  // bot.use((...args) => session.middleware(...args))
   bot.use((new LocalSession({ database: 'sessions.json' })).middleware())

 /* session = new TelegrafMongoSession(mongoose.connection.db, {
    collectionName: 'sessions',
    sessionName: 'session'
  })*/

  bot.use(stage.middleware())

  bot.command('saveme', async (ctx: ContextMessageUpdate) => {
    logger.debug(ctx, 'User uses /saveme command')

    const { mainKeyboard } = getMainKeyboard(ctx)
    await ctx.reply(texts.shared.what_next, mainKeyboard)
  })
  bot.start(asyncWrapper(async (ctx: ContextMessageUpdate) => ctx.scene.enter('start')))
  bot.hears(
    texts.keyboards.main_keyboard.search,
    asyncWrapper(async (ctx: ContextMessageUpdate) => ctx.scene.enter('search')))
  bot.hears(
    texts.keyboards.main_keyboard.random,
    asyncWrapper(random))
  bot.hears(
    texts.keyboards.main_keyboard.favorite,
    asyncWrapper(async (ctx: ContextMessageUpdate) => ctx.scene.enter('favorite')))
  bot.hears(
    texts.keyboards.back_keyboard.back,
    asyncWrapper(async (ctx: ContextMessageUpdate) => {
      logger.debug(ctx, 'Return to the main menu with the back button')
      const { mainKeyboard } = getMainKeyboard(ctx)

      await ctx.reply(texts.shared.what_next, mainKeyboard)
    }))

  bot.on('callback_query', asyncWrapper(async (ctx: ContextMessageUpdate) => {
    const { a } = JSON.parse(ctx.callbackQuery.data)

    switch (a) {
      case'download':
        await download(ctx)
        break
      case 'song':
        await song(ctx)
        break
    }
  }))

  bot.hears(/(.*?)/, async (ctx: ContextMessageUpdate) => {
    logger.debug(ctx, 'Default handler has fired')
    await api.random([])
    const { mainKeyboard } = getMainKeyboard(ctx)
    await sendSticker(ctx, stickers.error)
    await ctx.reply(texts.other.default_handler, mainKeyboard)
  })

  bot.catch((error: any) => {
    logger.error(undefined, 'Global error has happened, %O', error)
  })

  bot.on('sticker', ctx => {
    console.log(ctx.message.sticker.file_id)
  })


  process.env.NODE_ENV === 'production' ? startProdMode(bot) : startDevMode(bot)
// })

function startDevMode(bot: Telegraf<ContextMessageUpdate>) {
  logger.debug(undefined, 'Starting a bot in development mode')
  bot.startPolling()
  rp(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/deleteWebhook`).then(() =>
    bot.startPolling()
  )
}

async function startProdMode(bot: Telegraf<ContextMessageUpdate>) {
  logger.debug(undefined, 'Starting a bot in production mode')
  const tlsOptions = {
    key: fs.readFileSync(process.env.PATH_TO_KEY),
    cert: fs.readFileSync(process.env.PATH_TO_CERT)
  }

  await bot.telegram.setWebhook(
    `https://hostname:${process.env.WEBHOOK_PORT}/${process.env.TELEGRAM_TOKEN}`,
    {
      source: 'cert.pem'
    }
  )

  bot.startWebhook(`/${process.env.TELEGRAM_TOKEN}`, tlsOptions, +process.env.WEBHOOK_PORT)
}
