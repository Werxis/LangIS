import { User } from 'firebase/auth';
import useTranslation from '../../hooks/useTranslation';
import {
  CourseWithId,
  LangIsUserWithId,
  getCourses,
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
  Typography,
  colors,
} from '@mui/material';

interface CoursesPageProps {
  user: User;
  userLangIs: LangIsUserWithId;
}

const Courses: FC<CoursesPageProps> = ({ user, userLangIs }) => {
  const t = useTranslation();
  // TODO replace with useFirestoreOnSnapshot
  const [courses, setCourses] = useState<CourseWithId[]>();

  // TODO useFetch hook (arg = callback fn)
  useEffect(() => {
    const fetchCourses = async () => {
      const result = await getCourses();
      setCourses(result);
    };
    fetchCourses();
  }, []);

  const signUpUserForCourse = async (course: CourseWithId) => {
    const isCapacityExceeded = course.students.length >= course.capacity;
    const isStudentAlreadyInCourse = course.students.includes(userLangIs.uid);
    if (!isCapacityExceeded && !isStudentAlreadyInCourse) {
      course.students.push(userLangIs.uid);
      const { uid, students } = course;
      await updateCourse(uid, { students });
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center">
        {t('courses')}
      </Typography>
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
            <Card key={course.uid} sx={{ minWidth: '90%', m: '1em' }}>
              <CardContent>
                <Typography>{course.language}</Typography>
                <Typography>{course.level}</Typography>
                <Typography>{course.capacity}</Typography>
                <Typography>{course.price} CZK</Typography>
              </CardContent>
              <CardActions>
                {userLangIs.role === 'student' ? (
                  <Button onClick={() => signUpUserForCourse(course)}>
                    {t('signUpToCourse')}
                  </Button>
                ) : (
                  <></>
                )}
              </CardActions>
            </Card>
          ))}
        {!courses && <Typography>{t('noCoursesAvailable')}</Typography>}
      </Box>
    </Container>
  );
};

export default Courses;
