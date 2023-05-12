import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useTranslation,
  useFirestoreQueryOnSnapshot,
  useMediaDevice,
} from '../../hooks';

import {
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

                {/* TODO Lessons */}
                <Box marginTop={2}>
                  <Box>
                    <Typography
                      fontStyle={'italic'}
                      fontSize={18}
                      sx={{ textDecoration: 'underline' }}
                    >
                      Previous lesson:
                    </Typography>
                    <Typography marginLeft={2} marginTop={1}>
                      {'4.) Podstatné mená'}
                    </Typography>
                  </Box>

                  <Box marginTop={2}>
                    <Typography
                      fontStyle={'italic'}
                      fontSize={18}
                      sx={{ textDecoration: 'underline' }}
                    >
                      Next lesson:
                    </Typography>
                    <Typography marginLeft={2} marginTop={1}>
                      {'5.) Pridávné mená'}
                    </Typography>
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
                  Course Group chat
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<InfoIcon />}
                  onClick={() => navigate(`/courses/${course.uid}`)}
                >
                  See more course details
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
