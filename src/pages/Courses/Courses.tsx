import { User } from 'firebase/auth';
import useTranslation from '../../hooks/useTranslation';
import {
  Course,
  LangIsUserWithId,
  getOneCourse,
} from '../../firebase/firestore';
import { FC, useEffect, useState } from 'react';
import { Box, Card, CardContent, Container, Typography } from '@mui/material';

interface CoursesPageProps {
  user: User;
  userLangIs: LangIsUserWithId;
}

const Courses: FC<CoursesPageProps> = ({ user, userLangIs }) => {
  const t = useTranslation();
  const [course, setCourse] = useState<Course>();
  useEffect(() => {
    const fetchOneCourse = async () => {
      const result = await getOneCourse();
      setCourse(result);
    };
    fetchOneCourse();
  }, []);

  return (
    <Container>
      <Typography variant="h4">{t('courses')}</Typography>
      <Box>
        <Card>
          <CardContent>
            <Typography>{course?.language}</Typography>
            <Typography>{course?.level}</Typography>
            <Typography>{course?.capacity}</Typography>
            <Typography>{course?.price} CZK</Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Courses;
