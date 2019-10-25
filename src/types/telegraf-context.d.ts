import { I18n } from 'telegraf-i18n'

declare module 'telegraf' {
  type ContextUpdate = (ctx: any, next?: (() => any) | undefined) => any;
  interface ContextMessageUpdate {
    middleware(): ContextUpdate;
    scene: any;
    session: {
      created: number;
      name: string;
      messagesToDelete: any[];
      keyboard: string[];
      excludeRandom: number[];
      excludeJokes: number[];
      favorites: number[];
      song: number;
    };
  }
}
