import { FC } from 'react';
import { Box, Typography } from '@mui/material';

const Footer: FC = () => {
  const footerHeight = '7vh';

  return (
    <Box sx={{ marginTop: footerHeight }}>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          height: footerHeight,
          width: '100%',
          backgroundColor: 'black',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" component="span">
          Copyright &copy; 2023, LangIS
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
