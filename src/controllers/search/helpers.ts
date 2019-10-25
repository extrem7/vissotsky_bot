import { Extra, Markup, ContextMessageUpdate, CallbackButton } from 'telegraf'
import { Song } from '../../util/api'

export async function getSongsKeyboard(ctx: ContextMessageUpdate, songs: Song[]) {
  return Extra.HTML().markup((m: Markup) => {
    const buttons = songs.map((song: Song): CallbackButton[] => {
      return [m.callbackButton(
        song.title,
        JSON.stringify({ a: 'song', id: song.id }),
        false
      )]
    })
    return m.inlineKeyboard(buttons, {})
  })
}