import { User } from 'firebase/auth';
import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Course,
  LangIsUserWithId,
  Message,
  addMessage,
  getCourseDocumentRef,
  getMessagesOrderedQuery,
} from '../../firebase/firestore';
import useFirestoreDocumentOnSnapshot from '../../hooks/useFirestoreDocumentOnSnapshot';
import {
  Box,
  Typography,
  Container,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Avatar,
} from '@mui/material';
import { useDocumentTitle, useTranslation } from '../../hooks';
import { Timestamp } from 'firebase/firestore';
import { Send } from '@mui/icons-material';
import useFirestoreQueryOnSnapshot from '../../hooks/useFirestoreQueryOnSnapshot';

interface MyCourseChatPageProps {
  user: User;
  userLangIs: LangIsUserWithId;
}

const MyCourseDetail: FC<MyCourseChatPageProps> = ({ userLangIs }) => {
  const t = useTranslation();
  const { courseUid } = useParams();
  const [courseRef] = useState(getCourseDocumentRef(courseUid as string));
  const { data: course } = useFirestoreDocumentOnSnapshot<Course>(courseRef);
  useDocumentTitle(`LangIS - Course chat`);

  const [messagesQuery] = useState(
    getMessagesOrderedQuery(courseUid as string)
  );
  const { data: messages } = useFirestoreQueryOnSnapshot(messagesQuery);

  const [messageContent, setMessageContent] = useState('');

  const handleSendMessage = async () => {
    if (messageContent.trim() === '') return;
    setMessageContent('');

    const message: Message = {
      contents: messageContent,
      timestamp: Timestamp.now(),
      userName: `${userLangIs.firstName} ${userLangIs.lastName}`,
      userPhotoUrl: userLangIs.photoUrl,
      userUid: userLangIs.uid,
    };
    await addMessage(message, courseUid as string);
  };

  return (
    <Container>
      <Box sx={{ height: '75vh', overflow: 'auto' }}>
        <Typography sx={{ m: '0.5em' }} variant="h4" align="center">
          {course?.name}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {messages &&
            messages.map((message) => (
              <Box
                key={message.uid}
                sx={{
                  alignSelf:
                    message.userUid === userLangIs.uid ? 'end' : 'start',
                  display: 'grid',
                  m: '0.2em 0',
                  p: '0.5em 0.8em',
                }}
              >
                <Avatar
                  src={
                    message.userPhotoUrl === undefined ||
                    message.userPhotoUrl === null
                      ? undefined
                      : message.userPhotoUrl
                  }
                  alt={t('profilePicture')}
                  sx={{
                    width: '3em',
                    height: '3em',
                    p: 0,
                    marginRight: '0.3em',
                    gridColumn: '1',
                    gridRow: 'span 2',
                    display:
                      message.userUid === userLangIs.uid ? 'none' : 'block',
                  }}
                />
                <Box
                  sx={{
                    gridColumn: '2',
                    gridRow: '1',
                    backgroundColor:
                      message.userUid === userLangIs.uid
                        ? '#1877F2'
                        : '#d5deeb',
                    color:
                      message.userUid === userLangIs.uid ? 'white' : 'black',
                    borderRadius:
                      message.userUid === userLangIs.uid
                        ? '20px 1px 20px 20px'
                        : '1px 20px 20px 20px',
                    p: '0.5em 0.8em',
                  }}
                >
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {message.userName}
                  </Typography>
                  <Typography>{message.contents}</Typography>
                </Box>
              </Box>
            ))}
        </Box>
      </Box>
      <Box>
        <OutlinedInput
          sx={{ backgroundColor: 'white' }}
          placeholder="Aa"
          value={messageContent}
          fullWidth
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
