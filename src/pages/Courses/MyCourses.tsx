import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useTranslation,
  useFirestoreQueryOnSnapshot,
  useMediaDevice,
  useDocumentTitle,
} from '../../hooks';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ChatIcon from '@mui/icons-material/Chat';

import { User } from 'firebase/auth';
import {
  LangIsUserWithId,
  getUserCoursesQuery,
  Course,
} from '../../firebase/firestore';

interface MyCoursesPageProps {
  user: User;
  userLangIs: LangIsUserWithId;
}

const MyCourses: FC<MyCoursesPageProps> = ({ userLangIs }) => {
  const { data: userCourses, isLoading } = useFirestoreQueryOnSnapshot<Course>(
    getUserCoursesQuery(userLangIs.uid, userLangIs.role)
  );

  const { deviceType, isMobile } = useMediaDevice();
  const navigate = useNavigate();
  const t = useTranslation();
  useDocumentTitle('LangIS - My Courses');

  if (isLoading) {
    return null;
  }

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
        {t('myCourses')}
      </Typography>

      {/* My Courses */}
      {userCourses.length !== 0 && (
        <Stack direction="column" spacing={2}>
          {userCourses.map((course, index) => (
            <Card key={course.uid} elevation={6}>
              <CardContent>
                <Box>
                  <Typography fontWeight="bold" fontSize={20}>
                    {index + 1}. {course.name}
                  </Typography>
                </Box>

                {/* Details */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    rowGap: '0.5em',
                    marginTop: '0.5em',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: '5px' }}>
                    <Typography fontWeight={'bold'}>
                      {t('courseLanguage')}:
                    </Typography>
                    <Typography>{course.language}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: '5px' }}>
                    <Typography fontWeight={'bold'}>
                      {t('languageLevel')}:
                    </Typography>
                    <Typography>{course.level}</Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      gap: '5px',
                      alignItems: 'center',
                      marginTop: '-0.5em',
                    }}
                  >
                    <Typography fontWeight={'bold'}>{t('teacher')}:</Typography>
                    <Typography>
                      {course.teacher.firstName} {course.teacher.lastName}
                    </Typography>
                    <Avatar
                      src={
                        course.teacher.photoUrl === undefined ||
                        course.teacher.photoUrl === null
                          ? undefined
                          : course.teacher.photoUrl
                      }
                      alt={t('profilePicture')}
                      sx={{
                        width: '2em',
                        height: '2em',
                        marginLeft: '0.5em',
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
              {/* Buttons */}
              <Box
                sx={{
                  marginBottom: 2,
                  paddingX: 2,
                  display: 'flex',
                  gap: 1,
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: isMobile ? 'center' : 'end',
                  alignItems: 'stretch',
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<ChatIcon />}
                  onClick={() => navigate(`/courses/${course.uid}/chat`)}
                >
                  {t('groupChat')}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<InfoIcon />}
                  onClick={() => navigate(`/courses/${course.uid}`)}
                >
                  {t('courseDetail')}
                </Button>
              </Box>
            </Card>
          ))}
        </Stack>
      )}

      {userCourses.length === 0 && (
        <Typography>{t('noUserCourses')}</Typography>
      )}
    </Container>
  );
};

export default MyCourses;
