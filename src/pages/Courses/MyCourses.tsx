import { User } from 'firebase/auth';
import {
  CourseWithId,
  LangIsUserWithId,
  getTeachers,
  getUserCourses,
} from '../../firebase/firestore';
import useTranslation from '../../hooks/useTranslation';
import { FC, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from '@mui/material';
import Courses from './Courses';
import { Link, useNavigate } from 'react-router-dom';

interface MyCoursesPageProps {
  user: User;
  userLangIs: LangIsUserWithId;
}

const MyCourses: FC<MyCoursesPageProps> = ({ user, userLangIs }) => {
  const t = useTranslation();
  const [userCourses, setUserCourses] = useState<CourseWithId[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserCourses(userLangIs.uid);
      setUserCourses(data);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Typography sx={{ m: '0.5em' }} variant="h4" align="center">
        {t('myCourses')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {userCourses &&
          userCourses.map((course) => (
            <Card key={course.uid} sx={{ width: '45%', m: '1em' }}>
              <CardContent>
                <Typography>
                  <Link to={course.uid}>{course.name}</Link>
                </Typography>
                <Typography>
                  <Button
                    onClick={() => {
                      navigate(`/my-courses/${course.uid}`);
                    }}
                  >
                    {course.name}
                  </Button>
                </Typography>
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
            </Card>
          ))}
        {userCourses.length === 0 && (
          <Typography>{t('noUserCourses')}</Typography>
        )}
      </Box>
    </Container>
  );
};

export default MyCourses;
