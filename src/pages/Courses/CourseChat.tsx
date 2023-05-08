import { User } from 'firebase/auth';
import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  LangIsUserWithId,
  getCourseDocumentRef,
  getMessagesCollectionRef,
} from '../../firebase/firestore';
import useFirestoreDocumentOnSnapshot from '../../hooks/useFirestoreDocumentOnSnapshot';
import { Box, Typography, Container } from '@mui/material';
import { useTranslation } from '../../hooks';
import useFirestoreCollectionOnSnapshot from '../../hooks/useFirestoreCollectionOnSnapshot';

interface MyCourseChatPageProps {
  user: User;
  userLangIs: LangIsUserWithId;
}

const MyCourseDetail: FC<MyCourseChatPageProps> = ({ user, userLangIs }) => {
  const t = useTranslation();
  const { courseUid } = useParams();
  const [courseRef] = useState(getCourseDocumentRef(courseUid as string));
  const { data: course } = useFirestoreDocumentOnSnapshot(courseRef);

  const [messagesRef] = useState(getMessagesCollectionRef(courseUid as string));
  const { data: messages } = useFirestoreCollectionOnSnapshot(messagesRef);
  // TODO order by ascending timestamp

  return (
    <Container>
      <Typography sx={{ m: '0.5em' }} variant="h4" align="center">
        {course?.name}
      </Typography>
      {messages &&
        messages.map((message) => (
          <Box key={message.uid}>
            <Typography>
              {message.userName}: {message.contents}
            </Typography>
          </Box>
        ))}
    </Container>
  );
};

export default MyCourseDetail;
