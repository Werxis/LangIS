import { FC, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import {
  useDialog,
  useFirestoreOnSnapshot,
  useMediaDevice,
  useTranslation,
  useFirestoreQueryOnSnapshot,
} from '../../hooks';

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { Close, Delete, Edit } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';

import { TextInput } from '../../components/forms';

import { User } from 'firebase/auth';
import {
  Course,
  CourseTeacher,
  CourseWithId,
  LangIsUserWithId,
  addCourse,
  deleteCourse,
  getCoursesCollectionRef,
  getTeachersQuery,
  updateCourse,
} from '../../firebase/firestore';

interface CoursesPageProps {
  user: User;
  userLangIs: LangIsUserWithId;
}

const Courses: FC<CoursesPageProps> = ({ userLangIs }) => {
  const t = useTranslation();
  const { data: courses } = useFirestoreOnSnapshot(getCoursesCollectionRef());
  const [isAddCourseFormActive, setIsAddCourseFormActive] = useState(false);
  const { deviceType } = useMediaDevice();
  const { setDialog } = useDialog();

  const enrollUserInCourse = async (course: CourseWithId) => {
    const isCapacityExceeded = course.students.length >= course.capacity;
    const isStudentAlreadyInCourse = course.students.includes(userLangIs.uid);
    if (!isCapacityExceeded && !isStudentAlreadyInCourse) {
      course.students.push(userLangIs.uid);
      const { uid, students } = course;
      await updateCourse(uid, { students });
    }
  };

  const cancelUserEnrollment = async (course: CourseWithId) => {
    course.students = course.students.filter(
      (studentUid) => studentUid !== userLangIs.uid
    );
    const { uid, students } = course;
    await updateCourse(uid, { students });
  };

  const addCourseTest = async () => {
    const courseTeacher: CourseTeacher = {
      uid: 'hZQhgSs2VEea7NiKy0jNaB4yNFh1',
      firstName: 'Tomáš',
      lastName: 'Učitel',
      photoUrl:
        'https://firebasestorage.googleapis.com/v0/b/langis-93ba3.appspot.com/o/images%2Fprofile_pictures%2FhZQhgSs2VEea7NiKy0jNaB4yNFh1__teacher%20test%20crop.jpg?alt=media&token=f30f8ee2-99fd-47d1-9d7a-f7b9abb357b1',
    };
    const testCourse: Course = {
      name: 'Kurz špatnělštiny test',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      language: 'espanol',
      level: 'A2',
      price: 4000,
      capacity: 15,
      students: [],
      teacher: courseTeacher,
    };
    await addCourse(testCourse);
  };

  return (
    <Container
      sx={{ marginBottom: deviceType === 'mobile' ? '75px' : '100px' }}
    >
      {/* Title */}
      <Typography
        sx={{ m: '0.5em' }}
        variant="h3"
        component="h2"
        align="center"
      >
        {t('courses')}
      </Typography>

      {/* Admin stuff */}
      {/* TODO delete test button */}
      {userLangIs.role === 'admin' && (
        <Button onClick={addCourseTest}>Add course (TEST)</Button>
      )}
      {!(userLangIs.role === 'admin') ? (
        <></>
      ) : !isAddCourseFormActive ? (
        <Button onClick={() => setIsAddCourseFormActive(true)}>
          {t('addNewCourse')}
        </Button>
      ) : (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            maxWidth: '500px',
            width: '100%',
            zIndex: '1',
          }}
        >
          <IconButton
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
            onClick={() => setIsAddCourseFormActive(false)}
          >
            <Close />
          </IconButton>
          <AddCourseForm />
        </Box>
      )}

      {/* Courses */}
      {courses && (
        <Grid container spacing={4}>
          {courses.map((course) => (
            <Grid item xs={12} md={6} key={course.uid}>
              <Card
                key={course.uid}
                elevation={12}
                sx={{
                  maxWidth: '560px',
                  m: 'auto',
                  maxHeight: '560px',
                  overflow: 'auto',
                }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant="h6"
                    component="div"
                    textAlign={'center'}
                    sx={{ textDecoration: 'underline', fontWeight: 'bold' }}
                  >
                    {course.name}
                  </Typography>
                  <Typography marginTop={2} sx={{ fontStyle: 'italic' }}>
                    {course.description}
                  </Typography>
                  <Typography>{course.language}</Typography>

                  <Box
                    marginTop={3}
                    sx={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <Box sx={{ display: 'flex', gap: '5px' }}>
                      <Typography fontWeight={'bold'}>
                        {t('languageLevel')}:
                      </Typography>
                      <Typography>{course.level}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: '5px' }}>
                      <Typography fontWeight={'bold'}>
                        {t('teacher')}:
                      </Typography>
                      <Typography>
                        {course.teacher.firstName +
                          ' ' +
                          course.teacher.lastName}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: '5px' }}>
                      <Typography fontWeight={'bold'}>
                        {t('capacity')}:
                      </Typography>
                      <Typography>
                        {course.students.length}/{course.capacity}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: '5px' }}>
                      <Typography fontWeight={'bold'}>{t('price')}:</Typography>
                      <Typography>{course.price} CZK</Typography>
                    </Box>
                  </Box>
                </CardContent>

                <CardActions
                  sx={{
                    marginBottom: 1,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  {userLangIs.role === 'student' &&
                    (course.students.includes(userLangIs.uid) ? (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() =>
                          setDialog({
                            dialogTitle: 'Zrušenie zápisu',
                            dialogData:
                              'Ste si naprosto istý, že sa chcete odpísať z nasledujúceho kurzu?',
                            submitLabel: 'Cancel Enrollment',
                            onSubmit: () => cancelUserEnrollment(course),
                          })
                        }
                        sx={{ width: '80%' }}
                      >
                        {t('cancelEnrollment')}
                      </Button>
                    ) : course.students.length < course.capacity ? (
                      <Button
                        variant="outlined"
                        color="success"
                        startIcon={<AddIcon />}
                        onClick={() => enrollUserInCourse(course)}
                        sx={{ width: '80%' }}
                      >
                        {t('enrollInCourse')}
                      </Button>
                    ) : (
                      <Typography>{t('courseFull')}</Typography>
                    ))}
                  {userLangIs.role === 'admin' && (
                    <>
                      <IconButton>
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          deleteCourse(course.uid);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!courses && <Typography>{t('noCoursesAvailable')}</Typography>}
    </Container>
  );
};

export default Courses;

const AddCourseForm = () => {
  const t = useTranslation();
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const { data: teachers } = useFirestoreQueryOnSnapshot(getTeachersQuery());

  const [submissionErrorMessage] = useState<string | null>(null);

  const selectTeacher = (e: SelectChangeEvent) => {
    setSelectedTeacher(e.target.value);
  };

  return (
    <>
      <Typography variant="h5" component="h2">
        {t('addNewCourse')}
      </Typography>

      <Box sx={{ marginTop: 2.5 }}>
        <Formik
          initialValues={{
            name: '',
            description: '',
            language: '',
            level: '',
            capacity: 0,
            price: 0,
            teacher: '',
          }}
          onSubmit={async (values) => {
            console.log('test');
            console.log(values);
            const courseTeacher = teachers.find(
              (t) => t.uid === values.teacher
            );
            await addCourse({
              ...values,
              students: [],
              teacher: courseTeacher as CourseTeacher,
            });
          }}
          validationSchema={Yup.object({
            name: Yup.string().required('Name is required!'),
            description: Yup.string().required('Description is required!'),
            language: Yup.string().required('Language is required!'),
            level: Yup.string().required('Level is required!'),
            capacity: Yup.string().required('Capacity is required!'),
            price: Yup.number().required('Price is required!'),
            teacher: Yup.string().required('Teacher is required!'),
          })}
        >
          <Form>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
              }}
            >
              <TextInput
                name="name"
                type="text"
                label={t('courseName')}
                size="small"
                fullWidth
                required
              />

              <TextInput
                name="description"
                type="text"
                label={t('courseDescription')}
                size="small"
                fullWidth
                required
              />

              <TextInput
                name="language"
                type="text"
                label={t('courseLanguage')}
                size="small"
                fullWidth
                required
              />

              <TextInput
                name="level"
                type="text"
                label={t('languageLevel')}
                size="small"
                fullWidth
                required
              />

              <TextInput
                name="capacity"
                type="number"
                label={t('capacity')}
                size="small"
                fullWidth
                required
              />

              <TextInput
                name="price"
                type="number"
                label={t('price')}
                size="small"
                fullWidth
                required
              />

              {/* TODO change to single select */}
              <InputLabel id="teacher-label">{t('teacher')}</InputLabel>
              <Select
                name="teacher"
                label={t('teacher')}
                labelId="teacher-label"
                value={selectedTeacher}
                onChange={selectTeacher}
              >
                {teachers &&
                  teachers.length > 0 &&
                  teachers.map((teacher) => (
                    <MenuItem key={teacher.uid} value={teacher.uid}>
                      {teacher.firstName} {teacher.lastName}
                    </MenuItem>
                  ))}
              </Select>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '15px',
                  width: '100%',
                }}
              >
                <Button type="submit">{t('addNewCourse')}</Button>
                <Box>
                  {submissionErrorMessage !== null && (
                    <Typography color={'error'}>
                      {submissionErrorMessage}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Form>
        </Formik>
      </Box>
    </>
  );
};
