//import { useTranslation } from './recoil/atoms';
// import LanguageSelect from './components/LanguageSelect';

import useElementSize from './hooks/useElementSize';

function App() {
  // const t = useTranslation();
  // const text = t('home');
  // console.log('text: ', text);

  const [ref, size] = useElementSize();
  console.log('size: ', size);

  return (
    <div style={{ width: '100vw', height: '100vh' }} ref={ref}>
      <div>Hello World!</div>
    </div>
  );
}

export default App;
