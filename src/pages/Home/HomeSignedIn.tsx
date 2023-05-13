import { Container, Box, Typography } from '@mui/material';
import { useMediaDevice, useTranslation } from '../../hooks';

const HomeSignedIn = () => {
  const { isMobile } = useMediaDevice();
  const t = useTranslation();

  return (
    <Container>
      <Box marginTop={isMobile ? 4 : 16} textAlign="center">
        <Typography variant="h3">{t('welcome_home_screen')}</Typography>
        <Typography variant="h6" marginTop={2}>
          {t('home_screen_msg')}
        </Typography>
      </Box>
    </Container>
  );
};

export default HomeSignedIn;
