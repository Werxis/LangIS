import { useRecoilState } from 'recoil';
import { languageAtom } from '../recoil/atoms';

const useLanguage = () => useRecoilState(languageAtom);

export default useLanguage;
