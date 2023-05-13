import { useDocumentTitle, useMediaDevice } from '../hooks';

import { Box, Button, Container, Typography } from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  useDocumentTitle('LangIS - Not Found');
  const { isMobile } = useMediaDevice();
  const navigate = useNavigate();

  return (
    // 8vh header and 7vh footer - need to fix footer
    <Container
      sx={{
        height: 'calc(100vh - 15vh)',
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            p: 4,
            border: '1px solid #0d47a1',
            borderRadius: '10px',
            position: 'relative',
            bottom: isMobile ? 0 : 150,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#0d47a1',
              gap: 2,
            }}
          >
            <BugReportIcon sx={{ fontSize: '96px' }} />
            <Typography sx={{ fontSize: '76px' }}> 404 </Typography>
          </Box>

          <Box>
            <Typography fontSize={'48px'} fontWeight={'bold'}>
              Page not found!
            </Typography>
          </Box>

          <Box>
            <Typography fontStyle="italic" fontSize={'24px'}>
              The page you are looking for might have been removed, hat its name
              changed or is temporalily unavailable.
            </Typography>
          </Box>

          <Box marginTop={2.5}>
            <Button
              variant="outlined"
              sx={{ color: '#0d47a1', borderColor: '#0d47a1' }}
              onClick={() => navigate('/')}
            >
              Go to Homepage
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound;
