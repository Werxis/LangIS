import { User } from 'firebase/auth';
import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  LangIsUserWithId,
  Message,
  addMessage,
  getCourseDocumentRef,
  getMessagesCollectionRef,
} from '../../firebase/firestore';
import useFirestoreDocumentOnSnapshot from '../../hooks/useFirestoreDocumentOnSnapshot';
import {
  Box,
  Typography,
  Container,
  TextField,
  IconButton,
  InputAdornment,
  Input,
  OutlinedInput,
} from '@mui/material';
import { useTranslation } from '../../hooks';
import useFirestoreCollectionOnSnapshot from '../../hooks/useFirestoreCollectionOnSnapshot';
import Button from '../../components/Button';
import { Timestamp, serverTimestamp } from 'firebase/firestore';
import { Send } from '@mui/icons-material';

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

  const [messageContent, setMessageContent] = useState('');

  const handleSendMessage = async () => {
    if (messageContent.trim() === '') return;

    const message: Message = {
      contents: messageContent,
      timestamp: Timestamp.now(),
      userName: `${userLangIs.firstName} ${userLangIs.lastName}`,
      userPhotoUrl: userLangIs.photoUrl,
      userUid: userLangIs.uid,
    };
    await addMessage(message, courseUid as string);
    setMessageContent('');
  };

  return (
    <Container>
      <Box sx={{ height: '75vh' }}>
        <Typography sx={{ m: '0.5em' }} variant="h4" align="center">
          {course?.name}
        </Typography>
        {messages &&
          messages.map((message) => (
            <Box
              key={message.uid}
              sx={{
                color: message.userUid === userLangIs.uid ? 'red' : 'blue',
              }}
            >
              <Typography>
                {message.userName}: {message.contents}
              </Typography>
            </Box>
          ))}
      </Box>
      <Box>
        <OutlinedInput
          placeholder="Aa"
          fullWidth
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleSendMessage} edge="end">
                <Send />
              </IconButton>
            </InputAdornment>
          }
        />
      </Box>
    </Container>
  );
};

export default MyCourseDetail;
