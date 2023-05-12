import { User } from 'firebase/auth';
import { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Course,
  LangIsUserWithId,
  getCourseDocumentRef,
} from '../../firebase/firestore';
import useFirestoreDocumentOnSnapshot from '../../hooks/useFirestoreDocumentOnSnapshot';
import { Box, Typography, Container, Button } from '@mui/material';
import { useDocumentTitle, useTranslation } from '../../hooks';

interface MyCoursesDetailPageProps {
  user: User;
  userLangIs: LangIsUserWithId;
}

const CourseDetail: FC<MyCoursesDetailPageProps> = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const { courseUid } = useParams();
  const [courseRef] = useState(getCourseDocumentRef(courseUid as string));
  const { data: course } = useFirestoreDocumentOnSnapshot<Course>(courseRef);
  useDocumentTitle(`LangIS - Course Detail`);

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}
    >
      {course && (
        <Box>
          <Typography sx={{ m: '0.5em' }} variant="h4" align="center">
            {course.name}
          </Typography>
          <Button
            onClick={() => {
              navigate(`/my-courses/${course.uid}/chat`);
            }}
          >
            {t('groupChat')}
          </Button>
          <Typography>{course.description}</Typography>
          <Typography>{course.language}</Typography>
          <Typography>
            {t('languageLevel')}: {course.level}
          </Typography>
          <Typography>
            {t('teacher')}: {course.teacher.firstName} {course.teacher.lastName}
          </Typography>
        </Box>
      )}
      {!course && <Typography>404</Typography>}
    </Container>
  );
};

export default CourseDetail;
