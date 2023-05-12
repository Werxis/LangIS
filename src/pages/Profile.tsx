import { FC, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { LangIsUserWithId } from '../firebase/firestore';

import {
  Box,
  Container,
  TableContainer,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { retrieveProfilePhotoUrl } from '../utils';
import { useDialog, useDocumentTitle, useMediaDevice } from '../hooks';

import { uploadProfilePicture } from '../firebase/storage';
import { updateUser } from '../firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { StorageError } from 'firebase/storage';

interface ProfilePageProps {
  user: User;
  userLangIs: LangIsUserWithId;
}

const Profile: FC<ProfilePageProps> = ({ user, userLangIs }) => {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isProfileImageHovered, setIsProfileImageHovered] =
    useState<boolean>(false);

  const { isMobile } = useMediaDevice();
  const { setDialog } = useDialog();
  const navigate = useNavigate();
  useDocumentTitle('LangIS - Profile');

  useEffect(() => {
    if (!profileImage) {
      return;
    }
    setDialog({
      dialogTitle: 'Are you sure',
      dialogData:
        'Opravdu chcete zmeniť vašu profilovú fotku za vybranú fotku?',
      submitLabel: 'Potvrdiť',
      onSubmit: async () => {
        try {
          const urlOfImage = await uploadProfilePicture(user, profileImage);
          await updateUser(userLangIs.uid, { photoUrl: urlOfImage });
          setProfileImage(null);
          navigate(0);
          // TODO - some nicer feedback than basic alert
          alert(
            'Profilová fotka bola úspešne zmenena! Pre zobrazenie zmien je nutné refreshnúť stránku!'
          );
        } catch (error) {
          if (error instanceof StorageError) {
            alert(error.message);
          }
          alert('Uploading of your profile picture has failed!');
        }
      },
      onClose: () => setProfileImage(null),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileImage]);

  const profilePhotoUrl = retrieveProfilePhotoUrl(user, userLangIs);

  const createRow = (
    rowName: string,
    user: LangIsUserWithId,
    key: keyof LangIsUserWithId
  ) => {
    const field = user[key];
    return { rowName, field };
  };

  const rows = [
    createRow('Email: ', userLangIs, 'email'),
    createRow('Role: ', userLangIs, 'role'),
    createRow('Age: ', userLangIs, 'age'),
    createRow('Location: ', userLangIs, 'location'),
  ];

  return (
    <Container>
      <Box
        sx={{
          marginTop: 6,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        {/* Profile Image Container */}
        <Box
          style={{
            position: 'relative',
            padding: '16px',
            border: '1px solid gray',
            borderRadius: '10px',
            cursor: 'pointer',
          }}
          onMouseEnter={() => setIsProfileImageHovered(true)}
          onMouseLeave={() => setIsProfileImageHovered(false)}
          onClick={() => {
            const element = document.querySelector('#prof_pic_uploader');
            const imgElement = element as HTMLImageElement;
            imgElement.click();
          }}
        >
          <img
            src={profilePhotoUrl}
            alt="profile picture"
            style={{
              width: '192px',
              opacity: isProfileImageHovered ? 0.3 : 1.0,
            }}
          />

          {isProfileImageHovered && (
            <Box
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <EditIcon
                sx={{
                  fontSize: '84px',
                  backgroundColor: 'lightgray',
                  padding: 1,
                  borderRadius: '20%',
                  border: '2px solid black',
                }}
              />
            </Box>
          )}
        </Box>

        {/* Helper input, not even displayed, programatically clicked */}
        <input
          type="file"
          accept="image/*"
          id="prof_pic_uploader"
          style={{ display: 'none' }}
          onChange={(e) => {
            const files = e.currentTarget.files;
            const selectedFile: File | null = files ? files[0] : null;
            setProfileImage(selectedFile);
          }}
        />

        {/* User name */}
        <Typography variant="h3" component="h1" textAlign="center">
          {user.displayName ?? userLangIs.firstName + ' ' + userLangIs.lastName}
        </Typography>

        {/* User description */}
        <Typography
          variant="subtitle1"
          component="span"
          sx={{ width: isMobile ? '95%' : '75%' }}
        >
          {userLangIs.description ??
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}
        </Typography>

        <Box sx={{ width: isMobile ? '95%' : '75%', marginTop: 2 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{ fontWeight: 'bold', textDecoration: 'underline' }}
          >
            Informácie:{' '}
          </Typography>
        </Box>

        {/* User table information + container */}
        <TableContainer
          component={Paper}
          sx={{
            marginTop: 0,
            width: isMobile ? '95%' : '75%',
            marginBottom: 4,
          }}
        >
          <Table>
            <TableHead></TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.rowName}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  <TableCell
                    align="left"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: isMobile ? '14px' : '16px',
                    }}
                  >
                    {row.rowName}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontSize: isMobile ? '14px' : '16px' }}
                  >
                    {row.field ?? (
                      <Typography
                        sx={{
                          color: 'gray',
                          fontStyle: 'italic',
                        }}
                      >
                        Neuvedeno
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default Profile;
