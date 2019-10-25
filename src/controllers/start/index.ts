import { ContextMessageUpdate } from 'telegraf'
import Scene from 'telegraf/scenes/base'
import logger from '../../util/logger'
import { getMainKeyboard } from '../../util/keyboards'
import { stickers, sendSticker } from '../../util/common'
import texts from '../../texts'

const start = new Scene('start')

start.enter(async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Opens start section')
  const { mainKeyboard } = getMainKeyboard(ctx)
  await sendSticker(ctx, stickers.start)
  if (ctx.session.created) {
    await ctx.reply(texts.scenes.start.welcome_back, mainKeyboard)
  } else {
    logger.debug(ctx, 'New user has been created')
    ctx.session.created = new Date().getTime()
    ctx.session.name = ctx.message.from.first_name
    if (ctx.message.from.last_name) ctx.session.name += ` ${ctx.message.from.last_name}`
    ctx.session.favorites = []
    ctx.session.excludeRandom = []
    ctx.session.excludeJokes = []
    ctx.session.messagesToDelete = []
    ctx.session.song = null
    const { mainKeyboard } = getMainKeyboard(ctx)
    await ctx.reply(texts.scenes.start.new_account, mainKeyboard)
  }
})

export default start
