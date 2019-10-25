import { ContextMessageUpdate } from 'telegraf'
import Stage from 'telegraf/stage'
import Scene from 'telegraf/scenes/base'
import { getSongsKeyboard } from './helpers'
import { getBackKeyboard } from '../../util/keyboards'
import logger from '../../util/logger'
import { api } from '../../util/api'
import { sendSticker, stickers, toHome } from '../../util/common'
import texts from '../../texts'

const { leave } = Stage
const search = new Scene('search')

search.enter(async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Enters search scene')
  const { backKeyboard } = getBackKeyboard(ctx)
  await ctx.reply(texts.scenes.search.enter, backKeyboard)
  await sendSticker(ctx, stickers.search)
})

search.leave(async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Leaves search scene')
})

search.hears(texts.keyboards.back_keyboard.back, toHome)

search.start(toHome)

search.on('text', async (ctx: ContextMessageUpdate) => {
  const query = ctx.message.text
  logger.debug(ctx, `New search query: ${query}`)

  if (!/^[а-яА-Я0-9 .-]*$/.test(query) && query.length >= 3) {
    await ctx.reply(texts.scenes.search.invalid)
  } else {
    const songs = await api.search(ctx.message.text.replace(/\W/g, ''))
    if (songs.length) {
      const songsKeyboard = await getSongsKeyboard(ctx, songs)
      await ctx.reply(texts.scenes.search.found, songsKeyboard)
    } else {
      await ctx.reply(texts.scenes.search.not_found, getBackKeyboard(ctx).backKeyboard)
    }
  }
})

export default search
