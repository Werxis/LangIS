import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Box, Button } from '@mui/material';
import { useDialog } from '../hooks';
import LanguageSelect from '../components/LanguageSelect';
import TextInput from '../components/forms/TextInput';
import { AccountCircle } from '@mui/icons-material';
import TextArea from '../components/forms/TextArea';
import SingleSelect from '../components/forms/SingleSelect';
import { SelectOptions } from '../components/forms/SingleSelect';
import Checkbox from '../components/forms/Checkbox';
import RadioGroup from '../components/forms/RadioGroup';
import FileInput, {
  FileInputValueWithoutNull,
} from '../components/forms/FileInput';

type Fruits = 'apple' | 'banana' | '';
type Grades = 'A' | 'B' | 'C' | 'D' | 'E' | '';

const Test = () => {
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
            setDialog({
              dialogTitle: 'Vymazať užívatele',
              dialogData:
                "Ste si naprosto istý, že chcete vymazat užívatele 'Werxis'? Táto akcia je nevratná a nedá sa vrátiť späť!",
              submitLabel: 'Potvrdiť',
              onSubmit,
              onClose,
              dialogOptions: { size: 'tiny' },
            })
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
            age: '',
            fileTest: '',
          }}
          onSubmit={(values) => console.log('values: ', values)}
          validationSchema={Yup.object({
            firstName: Yup.string()
              .max(10, 'Max 10 chars')
              .required('Required'),
            description: Yup.string().required(),
            fruits: Yup.mixed<Fruits>().required('Required select field'),
            grade: Yup.string().required().oneOf(['A', 'B', 'C']),
            age: Yup.number().required().lessThan(140).moreThan(0),
            fileTest: Yup.mixed<FileInputValueWithoutNull>().required(),
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

            <TextInput name="age" type="number" />
            <FileInput
              name="fileTest"
              fileType="oneByOne"
              printFilesInfo
              fullWidth
              accept="image/*"
              //helperText="test helper text.."
            />

            <Button variant="outlined" type="submit">
              Submit
            </Button>
          </Form>
        </Formik>
      </Box>
    </div>
  );
};

export default Test;
