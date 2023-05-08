import { User } from 'firebase/auth';
import { FC, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  LangIsUserWithId,
  getCourseDocumentRef,
} from '../../firebase/firestore';
import useFirestoreDocumentOnSnapshot from '../../hooks/useFirestoreDocumentOnSnapshot';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
} from '@mui/material';
import { useTranslation } from '../../hooks';

interface MyCoursesDetailPageProps {
  user: User;
  userLangIs: LangIsUserWithId;
}

const MyCourseDetail: FC<MyCoursesDetailPageProps> = ({ user, userLangIs }) => {
  const t = useTranslation();
  const { courseUid } = useParams();
  const [courseRef] = useState(getCourseDocumentRef(courseUid as string));
  const { data: course } = useFirestoreDocumentOnSnapshot(courseRef);

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

export default MyCourseDetail;
