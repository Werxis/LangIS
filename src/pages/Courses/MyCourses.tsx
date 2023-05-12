import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useTranslation,
  useFirestoreQueryOnSnapshot,
  useMediaDevice,
  useDocumentTitle,
} from '../../hooks';

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Rating,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ChatIcon from '@mui/icons-material/Chat';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import GradeIcon from '@mui/icons-material/Grade';

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

  // TODO rating fetched from BE as course.rating
  // null if course was not rated before, otherwise floating point number from 0 to 5 with precision 0.5
  const courseRating: number | null = null;

  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState<boolean>(false);

  const { deviceType, isMobile } = useMediaDevice();
  const navigate = useNavigate();
  const t = useTranslation();
  useDocumentTitle('LangIS - My Courses');

  const openRatingDialog = () => setIsRatingDialogOpen(true);
  const closeRatingDialog = () => setIsRatingDialogOpen(false);

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
                <IconButton
                  size="medium"
                  onClick={openRatingDialog}
                  sx={{
                    alignSelf: isMobile ? 'end' : undefined,
                    marginRight: isMobile ? 1.0 : 0,
                    border: '1px solid rgba(25, 118, 210, 0.5)',
                    color: 'rgba(25, 118, 210, 0.5)',
                    borderRadius: '10%',
                  }}
                >
                  {courseRating === null ? <StarBorderIcon /> : <GradeIcon />}
                </IconButton>
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

      <RatingDialog
        isDialogOpen={isRatingDialogOpen}
        closeDialog={closeRatingDialog}
      />
    </Container>
  );
};

export default MyCourses;

// - - -

interface RatingDialogProps {
  isDialogOpen: boolean;
  closeDialog: () => void;
}

const RatingDialog: FC<RatingDialogProps> = ({ isDialogOpen, closeDialog }) => {
  const [courseRating, setCourseRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleRatingSubmit = async () => {
    setIsSubmitting(true);
    // TODO remove test PROMISE and Submit current rating value to the FIRESTORE DB
    console.log('courseRatingToSubmit: ', courseRating);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    closeDialog();
  };

  return (
    <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth={'xs'} fullWidth>
      <DialogTitle>Rate this course!</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Rating
            name="course-rating"
            value={courseRating ?? 1}
            precision={0.5}
            size="large"
            onChange={(e, newValue) => setCourseRating(newValue ?? 0)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} sx={{ minWidth: 100 }}>
          Cancel
        </Button>
        <Button
          variant={isSubmitting ? 'text' : 'contained'}
          sx={{ minWidth: 100 }}
          onClick={handleRatingSubmit}
        >
          {isSubmitting ? <CircularProgress size={25} /> : 'Rate!'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
