import { isLoaderOfWholePageOnAtom } from '../recoil/atoms';
import { useRecoilState } from 'recoil';

const useLoader = () => {
  return useRecoilState(isLoaderOfWholePageOnAtom);
};

export default useLoader;
