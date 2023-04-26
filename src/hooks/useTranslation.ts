import localization, { LocalizationKeys } from '../localization';
import { useLanguage } from '../hooks';

const useTranslation = () => {
  const [language] = useLanguage();
  return (translationKey: LocalizationKeys) =>
    localization[language][translationKey];
};

export default useTranslation;
