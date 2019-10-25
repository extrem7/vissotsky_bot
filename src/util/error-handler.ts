import { ContextMessageUpdate } from 'telegraf'
import logger from './logger'
import texts from '../texts'

const asyncWrapper = (fn: Function) => {
  return async function(ctx: ContextMessageUpdate, next: Function) {
    try {
      return await fn(ctx)
    } catch (error) {
      logger.error(ctx, 'asyncWrapper error, %O', error)
      ctx.reply(texts.shared.something_went_wrong)
      return next()
    }
  }
}

export default asyncWrapper
