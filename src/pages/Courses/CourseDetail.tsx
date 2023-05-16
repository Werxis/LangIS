import { User } from 'firebase/auth';
import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Course,
  CourseRating,
  LangIsUserWithId,
  Lesson,
  addOrUpdateRating,
  getCourseDocumentRef,
  getLessonsOrderedQuery,
  getRatingDocumentRef,
} from '../../firebase/firestore';
import useFirestoreDocumentOnSnapshot from '../../hooks/useFirestoreDocumentOnSnapshot';
import {
  Box,
  Typography,
  Container,
  Button,
  Stack,
  Card,
  CardContent,
  IconButton,
  Avatar,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import GradeIcon from '@mui/icons-material/Grade';
import {
  useDocumentTitle,
  useFirestoreQueryOnSnapshot,
  useMediaDevice,
  useTranslation,
} from '../../hooks';

interface MyCoursesDetailPageProps {
  user: User;
  userLangIs: LangIsUserWithId;
}

const CourseDetail: FC<MyCoursesDetailPageProps> = ({ userLangIs }) => {
  const t = useTranslation();
  const navigate = useNavigate();
  const { courseUid } = useParams();
  const [courseRef] = useState(getCourseDocumentRef(courseUid as string));
  const { data: course } = useFirestoreDocumentOnSnapshot<Course>(courseRef);

  const [lessonQuery] = useState(getLessonsOrderedQuery(courseUid as string));
  const { data: lessons } = useFirestoreQueryOnSnapshot<Lesson>(lessonQuery);

  const { isMobile } = useMediaDevice();
  useDocumentTitle(`LangIS - Course Detail`);

  const [ratingRef] = useState(
    getRatingDocumentRef(courseUid as string, userLangIs.uid)
  );
  const { data: rating } =
    useFirestoreDocumentOnSnapshot<CourseRating>(ratingRef);
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState<boolean>(false);
  const openRatingDialog = () => setIsRatingDialogOpen(true);
  const closeRatingDialog = () => setIsRatingDialogOpen(false);

  return (
    <Container>
      {course && (
        <Box>
          {/* Title */}
          <Typography
            sx={{ m: '0.5em' }}
            variant="h3"
            component="h2"
            align="center"
          >
            {course.name}
          </Typography>
          {/* Details */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              rowGap: '0.5em',
            }}
          >
            <Box sx={{ display: 'flex', gap: '5px' }}>
              <Typography fontWeight={'bold'}>
                {t('courseLanguage')}:
              </Typography>
              <Typography>{course.language}</Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: '5px' }}>
              <Typography fontWeight={'bold'}>{t('languageLevel')}:</Typography>
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
          {/* Buttons */}
          <Box
            sx={{
              marginY: 2,
              display: 'flex',
              gap: 1,
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: isMobile ? 'center' : 'start',
              alignItems: 'stretch',
            }}
          >
            {userLangIs.role === 'student' && (
              <IconButton
                size="medium"
                onClick={() => openRatingDialog()}
                sx={{
                  alignSelf: isMobile ? 'start' : undefined,
                  border: '1px solid rgba(25, 118, 210, 0.5)',
                  color: 'rgba(25, 118, 210, 0.5)',
                  borderRadius: '10%',
                }}
              >
                {rating?.value === undefined ? (
                  <StarBorderIcon />
                ) : (
                  <GradeIcon />
                )}
              </IconButton>
            )}
            <Button
              variant="outlined"
              startIcon={<ChatIcon />}
              onClick={() => navigate(`/courses/${course.uid}/chat`)}
            >
              {t('groupChat')}
            </Button>
          </Box>
        </Box>
      )}
      {lessons.length === 0 && (
        <Typography variant="button" align="center" component="div">
          {t('noLessonsAvailable')}
        </Typography>
      )}
      {!course && <Typography>404</Typography>}
      {lessons.length !== 0 && (
        <Stack
          direction="column"
          spacing={2}
          // marginBottom because of footer size
          sx={{ width: '100%', marginBottom: '5em' }}
        >
          {lessons.map((lesson, index) => (
            <Card key={lesson.uid} elevation={6}>
              <CardContent>
                <Box
                  sx={{
                    display: 'grid',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    rowGap: '0.25em',
                  }}
                >
                  <Typography fontWeight="bold" fontSize={20}>
                    {t('lesson')} {index + 1}
                  </Typography>
                  <Typography sx={{ fontStyle: 'italic' }}>
                    {lesson.start.toDate().toLocaleDateString('cs', {
                      day: 'numeric',
                      month: 'numeric',
                    })}{' '}
                    {lesson.start.toDate().toLocaleTimeString('cs', {
                      hour: 'numeric',
                      minute: 'numeric',
                    })}{' '}
                    ({lesson.lengthMinutes} {t('minutes')})
                  </Typography>
                  <Typography>
                    {t('lessonContent')}: {lesson.description}
                  </Typography>
                  <Typography>
                    {t('classroom')}: {lesson.classroom}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
      <RatingDialog
        isDialogOpen={isRatingDialogOpen}
        closeDialog={closeRatingDialog}
        courseUid={courseUid as string}
        userUid={userLangIs.uid}
        initialRating={rating?.value ?? 0}
      />
    </Container>
  );
};

export default CourseDetail;

interface RatingDialogProps {
  isDialogOpen: boolean;
  closeDialog: () => void;
  courseUid: string;
  userUid: string;
  initialRating: number;
}

const RatingDialog: FC<RatingDialogProps> = ({
  isDialogOpen,
  closeDialog,
  courseUid,
  userUid,
  initialRating,
}) => {
  const [courseRating, setCourseRating] = useState<number>(initialRating);
  useEffect(() => {
    setCourseRating(initialRating);
  }, [initialRating]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleRatingSubmit = async () => {
    setIsSubmitting(true);
    await addOrUpdateRating(courseUid, userUid, courseRating);
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
            value={courseRating}
            precision={0.5}
            size="large"
            onChange={(e, newValue) =>
              setCourseRating(newValue ?? initialRating)
            }
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
