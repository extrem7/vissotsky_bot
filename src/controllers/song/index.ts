import Scene from 'telegraf/scenes/base'
import { ContextMessageUpdate } from 'telegraf'
import logger from '../../util/logger'
import { getSongKeyboard } from './helpers'
import { records, comment, lyrics } from './actions'
import { favorite, favoriteRemove } from '../favorite/actions'
import { sendSticker, stickers, toHome } from '../../util/common'
import { api } from '../../util/api'
import texts from '../../texts'
import search from '../search'

const song = new Scene('song')

song.enter(async (ctx: ContextMessageUpdate) => {
  const song = api.song(ctx.session.song)
  logger.debug(ctx, `Enters song scene with song #${song.id} ${song.title}`)
  await sendSticker(ctx, stickers.song)
  await ctx.reply(song.title, getSongKeyboard(ctx))
})

song.leave(async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Leaves song scene')
  ctx.session.keyboard = []
  ctx.session.song = null
})

song.hears(texts.keyboards.back_keyboard.back, toHome)

search.start(toHome)

song.hears(texts.keyboards.song_keyboard.records, records)
song.hears(texts.keyboards.song_keyboard.lyrics, lyrics)
song.hears(texts.keyboards.song_keyboard.comment, comment)
song.hears(texts.keyboards.song_keyboard.favorite, favorite)
song.hears(texts.keyboards.song_keyboard.favorite_remove, favoriteRemove)

export default song