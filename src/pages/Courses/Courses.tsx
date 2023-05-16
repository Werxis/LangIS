import { FC, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

import {
  useDialog,
  useFirestoreOnSnapshot,
  useMediaDevice,
  useTranslation,
  useFirestoreQueryOnSnapshot,
  useDocumentTitle,
} from '../../hooks';

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { Close, Delete, Edit } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';

import { SingleSelect, TextInput } from '../../components/forms';

import { User } from 'firebase/auth';
import {
  Course,
  CourseLanguage,
  CourseTeacher,
  CourseWithId,
  LangIsUserWithId,
  LanguageLevel,
  addCourse,
  deleteCourse,
  getCoursesCollectionRef,
  getTeachersQuery,
  updateCourse,
} from '../../firebase/firestore';
import { SelectOptions } from '../../components/forms/SingleSelect';
import { FirebaseError } from 'firebase/app';

interface CoursesPageProps {
  user: User;
  userLangIs: LangIsUserWithId;
}

const Courses: FC<CoursesPageProps> = ({ userLangIs }) => {
  const t = useTranslation();
  const { data: courses, isLoading } = useFirestoreOnSnapshot<Course>(
    getCoursesCollectionRef()
  );
  const [isAddCourseFormActive, setIsAddCourseFormActive] = useState(false);
  const { deviceType } = useMediaDevice();
  const { setDialog } = useDialog();
  const navigate = useNavigate();
  useDocumentTitle('LangIS - Courses');

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

  if (isLoading) {
    return null;
  }

  return (
    <Container
      sx={{
        marginBottom: deviceType === 'mobile' ? '75px' : '100px',
      }}
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
      {!(userLangIs.role === 'admin') ? (
        <></>
      ) : !isAddCourseFormActive ? (
        <Button
          variant="outlined"
          color="success"
          startIcon={<AddIcon />}
          sx={{ marginBottom: '1em' }}
          onClick={() => setIsAddCourseFormActive(true)}
        >
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
      {courses.length !== 0 && (
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

                <Box
                  sx={{
                    marginBottom: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  {userLangIs.role === 'student' &&
                    (course.students.includes(userLangIs.uid) ? (
                      <>
                        <Button
                          variant="outlined"
                          color="info"
                          startIcon={<InfoIcon />}
                          sx={{ width: '80%' }}
                          onClick={() => navigate(`/courses/${course.uid}`)}
                        >
                          {t('courseDetail')}
                        </Button>
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
                      </>
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
                      {/* TODO pridat funkcionalitu edit course */}
                      {/* <Button
                        variant="outlined"
                        color="warning"
                        startIcon={<Edit />}
                        sx={{ width: '80%' }}
                        onClick={() => console.log('edit course')}
                      >
                        {t('edit')}
                      </Button> */}
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        sx={{ width: '80%' }}
                        onClick={() => {
                          deleteCourse(course.uid);
                        }}
                      >
                        {t('delete')}
                      </Button>
                    </>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {courses.length === 0 && (
        <Typography>{t('noCoursesAvailable')}</Typography>
      )}
    </Container>
  );
};

export default Courses;

const AddCourseForm = () => {
  const t = useTranslation();
  const { data: teachers } = useFirestoreQueryOnSnapshot(getTeachersQuery());
  const { setDialog } = useDialog();

  const [submissionErrorMessage, setSubmissionErrorMessage] = useState<
    string | null
  >(null);

  const [languageLevelOptions] = useState<SelectOptions<LanguageLevel>>([
    {
      value: 'A1',
      label: `A1 - ${t('beginner')}`,
    },
    {
      value: 'A2',
      label: `A2 - ${t('elemenatary')}`,
    },
    {
      value: 'B1',
      label: `B1 - ${t('preIntermediate')}`,
    },
    {
      value: 'B2',
      label: `B2 - ${t('intermediate')}`,
    },
    {
      value: 'C1',
      label: `C1 - ${t('upperIntermediate')}`,
    },
    {
      value: 'C2',
      label: `C2 - ${t('advanced')}`,
    },
  ]);

  const [courseLanguageOptions] = useState<SelectOptions<CourseLanguage>>([
    {
      value: 'English',
      label: t('english'),
    },
    {
      value: 'español',
      label: t('spanish'),
    },
    {
      value: 'italiano',
      label: t('italian'),
    },
    {
      value: 'Deutsch',
      label: t('german'),
    },
    {
      value: 'français',
      label: t('french'),
    },
  ]);

  return (
    <>
      <Typography variant="h5" component="h2">
        {t('addNewCourse')}
      </Typography>

      <Box sx={{ marginTop: 2.5 }}>
        <Formik
          initialValues={{
            name: 'Kurz španělštiny pro začátečníky',
            description:
              'Už jste se naučili základy a chcete procvičovat dál? Pak je přesně tento kurz pro vás! Zkušený lektor vás naučí vše, co byste mohli potřebovat pro běžné situace v cizí zemi - přes objednání v restuaci po rezervaci v hotelu.',
            language: 'español',
            level: 'A2',
            capacity: 8,
            price: 4399,
            teacher: '',
          }}
          onSubmit={async (values) => {
            try {
              const courseTeacher = teachers.find(
                (t) => t.uid === values.teacher
              );
              await addCourse({
                ...values,
                students: [],
                teacher: courseTeacher as CourseTeacher,
                averageRating: null,
              });
              setDialog({
                dialogTitle: t('courseAddedSuccessfullyTitle'),
                dialogData: t('courseAddedSuccessfullyMsg'),
              });
            } catch (error) {
              console.error(error);
              if (error instanceof FirebaseError) {
                setSubmissionErrorMessage(error.message);
              } else {
                setSubmissionErrorMessage(t('courseAddedFailed'));
              }
            }
          }}
          validationSchema={Yup.object({
            name: Yup.string().required('Name is required!'),
            description: Yup.string().required('Description is required!'),
            language: Yup.mixed().required('Language is required!'),
            level: Yup.mixed().required('Level is required!'),
            capacity: Yup.string().required('Capacity is required!'),
            price: Yup.number().required('Price is required!'),
            teacher: Yup.mixed().required('Teacher is required!'),
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

              <SingleSelect
                name="language"
                id="language"
                options={courseLanguageOptions}
                label={t('courseLanguage')}
              />

              <SingleSelect
                name="level"
                id="level"
                options={languageLevelOptions}
                label={t('languageLevel')}
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

              <SingleSelect
                name="teacher"
                id="teacher"
                options={teachers?.map((teacher) => ({
                  label: `${teacher.firstName} ${teacher.lastName}`,
                  value: teacher.uid,
                }))}
                label={t('teacher')}
              />

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
