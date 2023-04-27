import { FC } from 'react';
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
import { retrieveProfilePhotoUrl } from '../utils';
import { useMediaDevice } from '../hooks';

interface ProfilePageProps {
  user: User;
  userLangIs: LangIsUserWithId;
}

const Profile: FC<ProfilePageProps> = ({ user, userLangIs }) => {
  const { isMobile } = useMediaDevice();

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
        <img
          src={profilePhotoUrl}
          alt="profile picture"
          style={{
            width: '192px',
            padding: '16px',
            border: '1px solid gray',
            borderRadius: '10px',
            cursor: 'pointer',
          }}
        />

        <Typography variant="h3" component="h1">
          {user.displayName ?? userLangIs.firstName + ' ' + userLangIs.lastName}
        </Typography>

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
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
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
