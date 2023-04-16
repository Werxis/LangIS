import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Box, Button } from '@mui/material';
import useDialog from './hooks/useDialog';
import LanguageSelect from './components/LanguageSelect';
import TextInput from './components/forms/TextInput';
import { AccountCircle } from '@mui/icons-material';
import TextArea from './components/forms/TextArea';

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

      <Box sx={{ mx: 'auto', width: 800, my: 3 }}>
        <Formik
          initialValues={{
            firstName: '',
            description: '',
          }}
          onSubmit={(values) => console.log('values: ', values)}
          validationSchema={Yup.object({
            firstName: Yup.string()
              .max(10, 'Max 10 chars')
              .required('Required'),
            description: Yup.string().required(),
          })}
        >
          <Form>
            <TextInput
              name="firstName"
              type="text"
              label="First Name"
              placeholder="Jane"
              helperText="Enter your name"
              icon={<AccountCircle />}
            />
            <TextArea
              name="description"
              fullWidth
              rows={5}
              placeholder="Enter something"
            />
          </Form>
        </Formik>
      </Box>
    </div>
  );
}

export default App;
