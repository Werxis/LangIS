import { User } from 'firebase/auth';
import useTranslation from '../../hooks/useTranslation';
import {
  CourseWithId,
  LangIsUserWithId,
  getCourses,
  getCoursesCollectionRef,
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
} from '@mui/material';
import { useFirestoreOnSnapshot } from '../../hooks';

interface CoursesPageProps {
  user: User;
  userLangIs: LangIsUserWithId;
}

const Courses: FC<CoursesPageProps> = ({ user, userLangIs }) => {
  const t = useTranslation();
  const { data: courses, isLoading } = useFirestoreOnSnapshot(
    getCoursesCollectionRef()
  );

  const EnrollUserInCourse = async (course: CourseWithId) => {
    const isCapacityExceeded = course.students.length >= course.capacity;
    const isStudentAlreadyInCourse = course.students.includes(userLangIs.uid);
    if (!isCapacityExceeded && !isStudentAlreadyInCourse) {
      course.students.push(userLangIs.uid);
      const { uid, students } = course;
      await updateCourse(uid, { students });
    }
  };

  const CancelUserEnrollment = async (course: CourseWithId) => {
    course.students = course.students.filter(
      (studentUid) => studentUid !== userLangIs.uid
    );
    const { uid, students } = course;
    await updateCourse(uid, { students });
  };

  return (
    <Container>
      <Typography sx={{ m: '0.5em' }} variant="h4" align="center">
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
            <Card key={course.uid} sx={{ minWidth: '45%', m: '1em' }}>
              <CardContent>
                <Typography>{course.language}</Typography>
                <Typography>
                  {t('languageLevel')}: {course.level}
                </Typography>
                <Typography>
                  {t('capacity')}: {course.students.length}/{course.capacity}
                </Typography>
                <Typography>{course.price} CZK</Typography>
              </CardContent>
              <CardActions>
                {userLangIs.role === 'student' &&
                  (course.students.includes(userLangIs.uid) ? (
                    <Button onClick={() => CancelUserEnrollment(course)}>
                      {t('cancelEnrollment')}
                    </Button>
                  ) : course.students.length < course.capacity ? (
                    <Button onClick={() => EnrollUserInCourse(course)}>
                      {t('enrollInCourse')}
                    </Button>
                  ) : (
                    <Typography>{t('courseFull')}</Typography>
                  ))}
              </CardActions>
            </Card>
          ))}
        {!courses && <Typography>{t('noCoursesAvailable')}</Typography>}
      </Box>
    </Container>
  );
};

export default Courses;
