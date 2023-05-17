import * as Yup from 'yup';
import { User } from 'firebase/auth';
import { FC, useEffect, useState } from 'react';
import { Form, useNavigate, useParams } from 'react-router-dom';
import {
  Course,
  CourseRating,
  LangIsUserWithId,
  Lesson,
  LessonWithId,
  addLesson,
  addOrUpdateRating,
  deleteLesson,
  getCourseDocumentRef,
  getLessonsOrderedQuery,
  getRatingDocumentRef,
  updateLesson,
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
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import GradeIcon from '@mui/icons-material/Grade';
import {
  useDialog,
  useDocumentTitle,
  useFirestoreQueryOnSnapshot,
  useMediaDevice,
  useTranslation,
} from '../../hooks';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';
import { Edit, Delete, AttachFile } from '@mui/icons-material';
import { FileInput } from '../../components/forms';
import { Formik, Form as FormikForm } from 'formik';
import LanguageSelect from '../../components/LanguageSelect';
import { FileInputValueWithoutNull } from '../../components/forms/FileInput';
import { uploadLessonFile } from '../../firebase/storage';
import { StorageError } from 'firebase/storage';

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

  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState<boolean>(false);
  const openLessonDialog = (lesson: LessonWithId | null) => {
    setSelectedLesson(lesson);
    setIsLessonDialogOpen(true);
  };
  const closeLessonDialog = () => setIsLessonDialogOpen(false);
  const [selectedLesson, setSelectedLesson] = useState<LessonWithId | null>(
    null
  );

  const [isFileDialogOpen, setIsFileDialogOpen] = useState<boolean>(false);
  const openFileDialog = (lessonUid: string) => {
    setSelectedLessonUid(lessonUid);
    setIsFileDialogOpen(true);
  };
  const closeFileDialog = () => setIsFileDialogOpen(false);
  const [selectedLessonUid, setSelectedLessonUid] = useState<string>('');

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
            {userLangIs.role === 'teacher' && (
              <Button
                variant="outlined"
                color="success"
                startIcon={<AddIcon />}
                onClick={() => openLessonDialog(null)}
              >
                {t('addNewLesson')}
              </Button>
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
                    rowGap: '0.25em',
                  }}
                >
                  {userLangIs.uid === course?.teacher.uid && (
                    <Box
                      sx={{
                        gridRow: '1/3',
                        gridColumn: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5em',
                        // justifyContent: 'space-between',
                        // alignItems: 'end',
                        // justifyItems: 'start',
                      }}
                    >
                      <Button
                        sx={{ width: '100%' }}
                        variant="outlined"
                        color="warning"
                        startIcon={<Edit />}
                        onClick={() => openLessonDialog(lesson)}
                      >
                        {t('edit')}
                      </Button>
                      <Button
                        sx={{ width: '100%' }}
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => {
                          deleteLesson(course.uid, lesson.uid);
                        }}
                      >
                        {t('delete')}
                      </Button>
                      <Button
                        sx={{ width: '100%' }}
                        variant="outlined"
                        color="info"
                        startIcon={<AttachFile />}
                        onClick={() => {
                          openFileDialog(lesson.uid);
                        }}
                      >
                        TODO attach file
                      </Button>
                    </Box>
                  )}
                  <Typography fontWeight="bold" fontSize={20}>
                    {t('lesson')} {index + 1}
                  </Typography>
                  <Box sx={{ gridColumn: 1 }}>
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

      <LessonDialog
        isDialogOpen={isLessonDialogOpen}
        closeDialog={closeLessonDialog}
        selectedLesson={selectedLesson}
        courseUid={course?.uid as string}
      />

      <FileDialog
        isDialogOpen={isFileDialogOpen}
        closeDialog={closeFileDialog}
        lessonUid={selectedLessonUid}
        courseUid={course?.uid as string}
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
  const t = useTranslation();

  const handleRatingSubmit = async () => {
    setIsSubmitting(true);
    await addOrUpdateRating(courseUid, userUid, courseRating);
    setIsSubmitting(false);
    closeDialog();
  };

  return (
    <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth={'xs'} fullWidth>
      <DialogTitle>{t('rateThisCourse')}</DialogTitle>
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
          {t('cancel')}
        </Button>
        <Button
          variant={isSubmitting ? 'text' : 'contained'}
          sx={{ minWidth: 100 }}
          onClick={handleRatingSubmit}
        >
          {isSubmitting ? <CircularProgress size={25} /> : t('rate')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface LessonDialogProps {
  isDialogOpen: boolean;
  closeDialog: () => void;
  selectedLesson: LessonWithId | null;
  courseUid: string;
}

const LessonDialog: FC<LessonDialogProps> = ({
  isDialogOpen,
  closeDialog,
  selectedLesson,
  courseUid,
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const t = useTranslation();
  const initialData = {
    start: dayjs(),
    lengthMinutes: 60,
    classroom: '12C',
    description: 'Použití průběhových časů',
  };

  const [lessonData, setLessonData] = useState(initialData);

  useEffect(() => {
    if (selectedLesson) {
      setLessonData((prevData) => ({
        ...prevData,
        start: dayjs(selectedLesson.start.toMillis()),
        lengthMinutes: selectedLesson.lengthMinutes,
        classroom: selectedLesson.classroom,
        description: selectedLesson.description,
      }));
    } else {
      setLessonData(initialData);
    }
  }, [selectedLesson]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLessonData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setLessonData((prevData) => ({
      ...prevData,
      start: date ? dayjs(date.toDate()) : dayjs(),
    }));
  };

  const handleLessonSubmit = async () => {
    setIsSubmitting(true);
    const lesson: Lesson = {
      start: Timestamp.fromDate(lessonData.start.toDate()),
      lengthMinutes: lessonData.lengthMinutes,
      classroom: lessonData.classroom,
      description: lessonData.description,
      fileUrl: null,
    };
    if (selectedLesson === null) {
      addLesson(lesson, courseUid);
    } else {
      updateLesson(courseUid, selectedLesson.uid, lesson);
    }

    setIsSubmitting(false);
    closeDialog();
  };

  return (
    <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth={'xs'} fullWidth>
      <DialogTitle>{t('addNewLesson')}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            rowGap: '1em',
            marginY: '1em',
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              sx={{ width: '100%' }}
              label={t('lessonDateAndTime')}
              value={lessonData.start}
              onChange={(newValue) => handleDateChange(newValue)}
            />
          </LocalizationProvider>
          <TextField
            name="lengthMinutes"
            label={t('lessonLengthInMinutes')}
            type="number"
            value={lessonData.lengthMinutes}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="classroom"
            label={t('classroom')}
            value={lessonData.classroom}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="description"
            label={t('lessonContent')}
            multiline
            rows={4}
            value={lessonData.description}
            onChange={handleChange}
            required
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} sx={{ minWidth: 100 }}>
          {t('cancel')}
        </Button>
        <Button
          variant={isSubmitting ? 'text' : 'contained'}
          sx={{ minWidth: 100 }}
          onClick={handleLessonSubmit}
        >
          {isSubmitting ? <CircularProgress size={25} /> : t('addNewLesson')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface FileDialogProps {
  isDialogOpen: boolean;
  closeDialog: () => void;
  courseUid: string;
  lessonUid: string;
}

const FileDialog: FC<FileDialogProps> = ({
  isDialogOpen,
  closeDialog,
  courseUid,
  lessonUid,
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const t = useTranslation();
  const [file, setFile] = useState<File>();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    console.log('not formik handleSubmit');
  };

  return (
    <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth={'xs'} fullWidth>
      <DialogTitle>TODO file upload</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Formik
            initialValues={{
              file: new File([], ''),
            }}
            onSubmit={async (values: { file: File }) => {
              console.log('values: ', values);
              // TODO Marian help pls
              try {
                // const files = values.file;
                // const selectedFile: File | null = files ? files[0] : null;
                const fileUrl = await uploadLessonFile(lessonUid, values.file);
                await updateLesson(courseUid, lessonUid, { fileUrl: fileUrl });
                alert('TODO file success');
              } catch (error) {
                if (error instanceof StorageError) {
                  alert(error.message);
                }
                alert('TODO it failed');
              }
              setIsSubmitting(false);
              closeDialog();
            }}
            validationSchema={Yup.object({
              file: Yup.mixed<FileInputValueWithoutNull>().required(
                'TODO file is required!'
              ),
            })}
          >
            <FormikForm id="file-form">
              <FileInput name="file" fileType="single" fullWidth />
            </FormikForm>
          </Formik>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} sx={{ minWidth: 100 }}>
          {t('cancel')}
        </Button>
        <Button
          variant={isSubmitting ? 'text' : 'contained'}
          sx={{ minWidth: 100 }}
          type="submit"
          form="file-form"
        >
          {isSubmitting ? <CircularProgress size={25} /> : t('rate')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
