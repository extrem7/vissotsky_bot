import { ContextMessageUpdate } from 'telegraf'
import Scene from 'telegraf/scenes/base'
import logger from '../../util/logger'
import { api } from '../../util/api'
import { getSongsKeyboard } from '../search/helpers'
import { sendSticker, stickers } from '../../util/common'
import texts from '../../texts'

const favorite = new Scene('favorite')

favorite.enter(async (ctx: ContextMessageUpdate) => {
  if (!ctx.session.favorites.length) {
    await sendSticker(ctx, stickers.emptyFavorite)
    await ctx.reply(texts.scenes.favorite.empty)
    return ctx.scene.leave()
  }
  logger.debug(ctx, 'Opens favorite section')
  const songs = ctx.session.favorites.map(id => api.song(id))
  const songsKeyboard = await getSongsKeyboard(ctx, songs)
  await ctx.reply(texts.scenes.favorite.list, songsKeyboard)
})

export default favorite
