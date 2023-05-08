import { User } from 'firebase/auth';
import useTranslation from '../../hooks/useTranslation';
import {
  Course,
  CourseTeacher,
  CourseWithId,
  LangIsUserWithId,
  addCourse,
  deleteCourse,
  getCoursesCollectionRef,
  getTeachers,
  updateCourse,
} from '../../firebase/firestore';
import { FC, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { useFirestoreOnSnapshot, useMediaDevice } from '../../hooks';
import { TextInput } from '../../components/forms';
import * as Yup from 'yup';
import { Close, Delete, Edit } from '@mui/icons-material';
import { Formik, Form } from 'formik';

interface CoursesPageProps {
  user: User;
  userLangIs: LangIsUserWithId;
}

const Courses: FC<CoursesPageProps> = ({ user, userLangIs }) => {
  const t = useTranslation();
  const { data: courses } = useFirestoreOnSnapshot(getCoursesCollectionRef());
  const [isAddCourseFormActive, setIsAddCourseFormActive] = useState(false);
  const { deviceType } = useMediaDevice();

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
      uid: '1UDKVTO7h8TMpgkFgxcD',
      firstName: 'test',
      lastName: 'děda',
      photoUrl: null,
    };
    const testCourse: Course = {
      name: 'Kurz špatnělštiny test',
      description: 'Tohle je velmi krátký popisek',
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
    <Container>
      <Typography sx={{ m: '0.5em' }} variant="h4" align="center">
        {t('courses')}
      </Typography>
      {/* TODO delete test button */}
      <Button onClick={addCourseTest}>Add course (TEST)</Button>
      {/* TODO change to admin */}
      {userLangIs.role === 'student' && isAddCourseFormActive ? (
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
      ) : (
        <Button onClick={() => setIsAddCourseFormActive(true)}>
          {t('addNewCourse')}
        </Button>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {courses &&
          courses.map((course) => (
            <Card
              key={course.uid}
              sx={{
                width:
                  deviceType === 'mobile'
                    ? '100%'
                    : deviceType === 'tablet'
                    ? '40%'
                    : '30%',
                m: '1em',
              }}
            >
              <CardContent>
                <Typography>{course.name}</Typography>
                <Typography>{course.description}</Typography>
                <Typography>{course.language}</Typography>
                <Typography>
                  {t('languageLevel')}: {course.level}
                </Typography>
                <Typography>
                  {t('teacher')}: {course.teacher.firstName}{' '}
                  {course.teacher.lastName}
                </Typography>
                <Typography>
                  {t('capacity')}: {course.students.length}/{course.capacity}
                </Typography>
                <Typography>
                  {t('price')}: {course.price} CZK
                </Typography>
              </CardContent>
              <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                {userLangIs.role === 'student' &&
                  (course.students.includes(userLangIs.uid) ? (
                    <Button onClick={() => cancelUserEnrollment(course)}>
                      {t('cancelEnrollment')}
                    </Button>
                  ) : course.students.length < course.capacity ? (
                    <Button onClick={() => enrollUserInCourse(course)}>
                      {t('enrollInCourse')}
                    </Button>
                  ) : (
                    <Typography>{t('courseFull')}</Typography>
                  ))}
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
              </CardActions>
            </Card>
          ))}
        {!courses && <Typography>{t('noCoursesAvailable')}</Typography>}
      </Box>
    </Container>
  );
};

export default Courses;

const AddCourseForm = () => {
  const t = useTranslation();
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [teachers, setTeachers] = useState<LangIsUserWithId[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTeachers();
      setTeachers(data);
    };
    fetchData();
  }, []);

  const [submissionErrorMessage, setSubmissionErrorMessage] = useState<
    string | null
  >(null);

  const selectTeacher = (e: SelectChangeEvent) => {
    setSelectedTeacher(e.target.value);
    console.log(selectedTeacher);
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
          {(formik) => (
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
          )}
        </Formik>
      </Box>
    </>
  );
};
