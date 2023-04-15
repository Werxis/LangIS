import { atom } from 'recoil';
import { LanguageKeys } from '../localization';

export const languageAtom = atom<LanguageKeys>({
  key: 'language',
  default: 'cs',
});
