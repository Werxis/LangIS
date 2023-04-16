import { Button } from '@mui/material';
import useDialog from './hooks/useDialog';
import LanguageSelect from './components/LanguageSelect';

function App() {
  const { setDialog } = useDialog();

  const onSubmit = async () => {
    const a = await fetch('https://jsonplaceholder.typicode.com/todos');
    const data = await a.json();
    console.log('data: ', data);
    console.log('SUBMITTED');
  };

  const onClose = () => {
    console.log('CLOSED!');
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div>Hello World!</div>
      <div style={{ marginLeft: '8px' }}>
        <LanguageSelect />
      </div>
      <div style={{ marginLeft: '16px', marginTop: '16px' }}>
        <Button
          variant="outlined"
          onClick={() =>
            setDialog(
              'Vymazať užívatele',
              "Ste si naprosto istý, že chcete vymazat užívatele 'Werxis'? Táto akcia je nevratná a nedá sa vrátiť späť!",
              'Potvrdiť',
              onSubmit,
              onClose,
              {
                size: 'tiny',
              }
            )
          }
        >
          Open Dialog
        </Button>
      </div>
    </div>
  );
}

export default App;
