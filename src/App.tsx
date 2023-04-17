import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Box, Button } from '@mui/material';
import useDialog from './hooks/useDialog';
import LanguageSelect from './components/LanguageSelect';
import TextInput from './components/forms/TextInput';
import { AccountCircle } from '@mui/icons-material';
import TextArea from './components/forms/TextArea';
import SingleSelect from './components/forms/SingleSelect';
import { SelectOptions } from './components/forms/SingleSelect';
import Checkbox from './components/forms/Checkbox';
import RadioGroup from './components/forms/RadioGroup';

type Fruits = 'apple' | 'banana' | '';
type Grades = 'A' | 'B' | 'C' | 'D' | 'E' | '';

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

  const fruitOptions: SelectOptions<Fruits> = [
    {
      value: '',
      label: 'Empty',
    },
    {
      value: 'apple',
      label: 'Apple',
    },
    {
      value: 'banana',
      label: 'Banana',
    },
  ];

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
            fruits: '' as Fruits,
            license: false,
            grade: 'C' as Grades,
          }}
          onSubmit={(values) => console.log('values: ', values)}
          validationSchema={Yup.object({
            firstName: Yup.string()
              .max(10, 'Max 10 chars')
              .required('Required'),
            description: Yup.string().required(),
            fruits: Yup.mixed<Fruits>().required('Required select field'),
            grade: Yup.string().required().oneOf(['A', 'B', 'C']),
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
            <SingleSelect
              name="fruits"
              id="fruits"
              options={fruitOptions}
              color="secondary"
              label="Fruits"
              helperText="Select some fruit!!!!!!!"
              fullWidth
            />
            <Checkbox
              name="license"
              label="Súhlasíte s vyššie uvedenými podmienkami ?"
              size="medium"
              color="secondary"
              //icon="apple"
              //checkedIcon="javascript"
            />
            <RadioGroup
              name="grade"
              id="grade"
              direction="row"
              label="Grades: "
              color="secondary"
              helperText="Choose your preferred grade"
              options={[
                {
                  label: 'A',
                  value: 'A',
                },
                {
                  label: 'B',
                  value: 'B',
                },
                {
                  label: 'C',
                  value: 'C',
                },
                {
                  label: 'D',
                  value: 'D',
                },
                {
                  label: 'E',
                  value: 'E',
                },
              ]}
            />
            <Button variant="outlined" type="submit">
              Submit
            </Button>
          </Form>
        </Formik>
      </Box>
    </div>
  );
}

export default App;
