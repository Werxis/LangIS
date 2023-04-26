import { Box, CircularProgress } from '@mui/material';

const LoaderWholePage = () => {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress size={100} />
    </Box>
  );
};

export default LoaderWholePage;
