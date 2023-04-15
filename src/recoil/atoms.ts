import { atom, useRecoilState } from 'recoil';
import localization, { LanguageKeys, LocalizationKeys } from '../localization';

// - - -

const languageState = atom<LanguageKeys>({
  key: 'language',
  default: 'cs',
});

export const useLanguage = () => useRecoilState(languageState);

export const useTranslation = () => {
  const [language] = useLanguage();
  return (translationKey: LocalizationKeys) =>
    localization[language][translationKey];
};

// - - -
