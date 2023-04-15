import sk from './sk';
import cs from './cs';
import en from './en';

const localization = { sk, cs, en };

export type LanguageKeys = keyof typeof localization;
export type LocalizationKeys = keyof (typeof localization)[LanguageKeys];

export const languageKeys = Object.keys(localization) as LanguageKeys[];

export default localization;
