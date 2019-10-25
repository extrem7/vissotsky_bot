import { ContextMessageUpdate } from 'telegraf'
import telegram from '../telegram'
import { getMainKeyboard } from './keyboards'
import texts from '../texts'

export function sleep(sec: number) {
  return new Promise(resolve => setTimeout(resolve, sec * 1000))
}

export const toHome = async (ctx: ContextMessageUpdate) => {
  const { mainKeyboard } = getMainKeyboard(ctx)
  if (ctx.session.messagesToDelete.length) {
    while (ctx.session.messagesToDelete.length)
      ctx.session.messagesToDelete.shift()
  }
  await telegram.deleteMessage(ctx.chat.id, ctx.message.message_id)
  await sendSticker(ctx, stickers.next)
  if (ctx.session.excludeJokes.length >= texts.shared.jokes.length / 2) {
    ctx.session.excludeJokes.shift()
  }
  const joke = getJoke(ctx.session.excludeJokes)
  ctx.session.excludeJokes.push(joke)
  await ctx.reply(`${texts.shared.jokes[joke]}\n${texts.shared.what_next}`, mainKeyboard)
  ctx.scene.leave()
}

export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const deleteMessage = async (ctx: ContextMessageUpdate) => {
  const messageToDelete = ctx.callbackQuery.message
  await telegram.deleteMessage(messageToDelete.chat.id, messageToDelete.message_id)
}

export const editMessage = async (ctx: ContextMessageUpdate, text: string, markup: any) => {
  const messageToDelete = ctx.callbackQuery.message
  await telegram.editMessageText(messageToDelete.chat.id, messageToDelete.message_id, undefined, text, markup)
}

export const hideButton = async (ctx: ContextMessageUpdate) => {
  if (ctx.session.keyboard === undefined) ctx.session.keyboard = []
  ctx.session.keyboard.push(ctx.message.text)
}

export const isButtonHidden = (ctx: ContextMessageUpdate, button: string) => {
  if (ctx.session.keyboard !== undefined) return ctx.session.keyboard.includes(button)
}

export enum stickers {
  start = 'CAADAgADMgcAAu75nwUvx6ZgoLJcNxYE',
  search = 'CAADAgADVgcAAu75nwUeIXjVUE7PphYE',
  song = 'CAADAgADXQcAAu75nwV7Y4h3n5X9AxYE',
  about = 'CAADAgADWwcAAu75nwVz91RiqwexURYE',
  favorite = 'CAADAgADSAcAAu75nwWX9xa3p0c_7RYE',
  emptyFavorite = 'CAADAgADJgcAAu75nwVQl9OJFtxGyRYE',
  error = 'CAADAgADSQcAAu75nwUm2nBRc-rAnBYE',
  next = 'CAADAgADKAcAAu75nwUfH_Uj1uGfRRYE',
}

export const sendSticker = async (ctx: ContextMessageUpdate, sticker: stickers) => {
  return await ctx.replyWithSticker(sticker)
}

export function getJoke(exclude: number[]): number {
  const length = texts.shared.jokes.length - 1
  const random = getRandomInt(0, length)
  if (!exclude.includes(random)) {
    return random
  } else {
    return getJoke(exclude)
  }
}