import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useTranslation,
  useFirestoreQueryOnSnapshot,
  useMediaDevice,
  useDocumentTitle,
  useFirestoreDocumentOnSnapshot,
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
  Stack,
  Typography,
  CircularProgress,
  Rating,
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
  CourseRating,
  getRatingDocumentRef,
  addOrUpdateRating,
} from '../../firebase/firestore';

interface MyCoursesPageProps {
  user: User;
  userLangIs: LangIsUserWithId;
}

const MyCourses: FC<MyCoursesPageProps> = ({ userLangIs }) => {
  const { data: userCourses, isLoading } = useFirestoreQueryOnSnapshot<Course>(
    getUserCoursesQuery(userLangIs.uid, userLangIs.role)
  );
  const [selectedCourseUid, setSelectedCourseUid] = useState<string>();

  // TODO rating fetched from BE as course.rating
  // null if course was not rated before, otherwise floating point number from 0 to 5 with precision 0.5
  // TODO redo - at the moment all courses will shares this value
  const courseRating: number | null = null;

  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState<boolean>(false);

  const { deviceType, isMobile } = useMediaDevice();
  const navigate = useNavigate();
  const t = useTranslation();
  useDocumentTitle('LangIS - My Courses');

  const openRatingDialog = (courseUid: string) => {
    setIsRatingDialogOpen(true);
    setSelectedCourseUid(courseUid);
  };
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
                  onClick={() => openRatingDialog(course.uid)}
                  sx={{
                    alignSelf: isMobile ? 'end' : undefined,
                    // marginRight: isMobile ? 0 : 1.0,
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

      <RatingDialog
        isDialogOpen={isRatingDialogOpen}
        closeDialog={closeRatingDialog}
        courseUid={selectedCourseUid as string}
        userUid={userLangIs.uid}
      />
    </Container>
  );
};

export default MyCourses;

// TODO delete this whole thing
// - - -

interface RatingDialogProps {
  isDialogOpen: boolean;
  closeDialog: () => void;
  courseUid: string;
  userUid: string;
}

const RatingDialog: FC<RatingDialogProps> = ({
  isDialogOpen,
  closeDialog,
  courseUid,
  userUid,
}) => {
  const [ratingRef] = useState(getRatingDocumentRef(courseUid, userUid));
  const { data: rating } =
    useFirestoreDocumentOnSnapshot<CourseRating>(ratingRef);

  const [courseRating, setCourseRating] = useState<number | null>(
    rating?.value ?? null
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleRatingSubmit = async () => {
    setIsSubmitting(true);
    console.log('courseRatingToSubmit: ', courseRating);
    console.log('userUid: ', userUid);
    console.log('courseUid: ', courseUid);
    await addOrUpdateRating(courseUid, userUid, courseRating ?? 0);
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
            // TODO value course.avgRating and precision 0.1 and just display it, nothing fancy
            // probably just move it to the course offer, it really has no place to be here - you want to see it when buying the course
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
