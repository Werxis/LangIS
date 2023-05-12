import { Container, Box, Typography } from '@mui/material';
import { useMediaDevice } from '../../hooks';

const HomeSignedIn = () => {
  const { isMobile } = useMediaDevice();

  return (
    <Container>
      <Box marginTop={isMobile ? 4 : 16} textAlign="center">
        <Typography variant="h3">
          Vitajte na domovskej stránke aplikácie LangIS!
        </Typography>
        <Typography variant="h6" marginTop={2}>
          Z ponuky vyššie si vyberte aktuálnu ponuku kurzov alebo si
          prehliadnite vaše aktuálne zaregistrované kurzy.
        </Typography>
      </Box>
    </Container>
  );
};

export default HomeSignedIn;
