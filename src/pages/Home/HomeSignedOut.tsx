import { useState, MouseEvent, FC } from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  CircularProgress,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import {
  AccountCircleOutlined,
  MailLockOutlined,
  PasswordOutlined,
} from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// Firebase
import { FirebaseError } from 'firebase/app';
import { UserCredential } from 'firebase/auth';
import {
  registerEmailPassword,
  loginEmailPassword,
  loginGoogle,
  loginGithub,
} from '../../firebase/auth';
import { setUserById } from '../../firebase/firestore';

import bgImage from '../../assets/langis_home_background.jpg';
import googleIcon from '../../assets/icons/icon_google.svg';
import githubIcon from '../../assets/icons/icon_github.png';

import LanguageSelect from '../../components/LanguageSelect';
import TextInput from '../../components/forms/TextInput';
import Button from '../../components/Button';

// Hooks
import { useMediaDevice, useDialog } from '../../hooks';

const HomeSignedOut = () => {
  const [isLoginFormActive, setIsLoginFormActive] = useState<boolean>(true);

  const { deviceType, isMobile } = useMediaDevice();

  return (
    <Box>
      {/* Navbar */}
      <NavBarSignOut
        isLoginFormActive={isLoginFormActive}
        setIsLoginFormActive={setIsLoginFormActive}
      />

      {/* Background image + Login */}
      <Box
        sx={{
          height: '85vh', // HERE
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: 'black',
          position: 'relative',
        }}
      >
        <img
          src={bgImage}
          alt="home_background_image"
          style={{ width: '99%', height: '100%' }}
        />

        {/* Login */}
        <Box
          sx={{
            position: 'absolute',
            top: isMobile ? '2.5%' : '15%',
            bottom: isMobile ? '2.5%' : undefined,
            overflowY: 'auto',
            width:
              deviceType === 'desktop'
                ? '500px'
                : deviceType === 'tablet'
                ? '70%'
                : '90%',
            margin: deviceType === 'desktop' ? '0% 0% 0% 50%' : 'auto 0px',
            backgroundColor: 'white',
            border: '1.5px solid white',
            borderRadius: '1%',
            padding: 3.0,
          }}
        >
          {isLoginFormActive ? <LoginForm /> : <RegisterForm />}
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          height: '7vh', // HERE
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

export default HomeSignedOut;

// - - -

interface NavBarSignOutProps {
  isLoginFormActive: boolean;
  setIsLoginFormActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavBarSignOut: FC<NavBarSignOutProps> = ({
  isLoginFormActive,
  setIsLoginFormActive,
}) => {
  const [anchorElNav, setAnchorElNav] = useState<HTMLElement | null>(null);
  const { isMobile } = useMediaDevice();

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <Box
      component="nav"
      sx={{
        height: '8vh', // HERE
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: blue[900],
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          component="h1"
          sx={{ color: 'white', marginLeft: 2.5, cursor: 'pointer' }}
        >
          LangIS
        </Typography>

        {!isMobile && <Button>O aplikaci</Button>}
      </Box>

      {!isMobile && (
        <Box
          sx={{
            marginRight: 3.5,
            display: 'flex',
            alignItems: 'center',
            gap: '25px',
          }}
        >
          <Button onClick={() => setIsLoginFormActive(!isLoginFormActive)}>
            {isLoginFormActive ? 'Registrácia' : 'Prihlásenie'}
          </Button>

          <LanguageSelect />
        </Box>
      )}

      {isMobile && (
        <Box
          sx={{
            marginRight: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
          }}
        >
          <LanguageSelect />
          <Box>
            <IconButton
              size="large"
              sx={{ color: 'white' }}
              onClick={handleOpenNavMenu}
            >
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={!!anchorElNav}
              onClose={handleCloseNavMenu}
            >
              <MenuItem
                onClick={() => {
                  setIsLoginFormActive(!isLoginFormActive);
                  handleCloseNavMenu();
                }}
              >
                <Typography>
                  {isLoginFormActive ? 'Registrácia' : 'Prihlásenie'}
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Typography>O aplikaci</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      )}
    </Box>
  );
};

// - - -

const LoginForm = () => {
  const [submissionErrorMessage, setSubmissionErrorMessage] = useState<
    string | null
  >(null);

  const { isMobile } = useMediaDevice();

  return (
    <>
      <Typography variant="h5" component="h2">
        Prihlásenie
      </Typography>

      <Box sx={{ marginTop: 2.5 }}>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          onSubmit={async (values) => {
            try {
              const userCredential: UserCredential = await loginEmailPassword(
                values.email,
                values.password
              );
              console.log('userCredential: ', userCredential);
            } catch (error) {
              console.error(error);
              if (error instanceof FirebaseError) {
                setSubmissionErrorMessage(error.message);
              } else {
                setSubmissionErrorMessage('Registration has failed!');
              }
            }
          }}
          validationSchema={Yup.object({
            email: Yup.string().email().required('Email field is required'),
            password: Yup.string().required('Password field is required!'),
          })}
        >
          <Form>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
              }}
            >
              <TextInput
                name="email"
                type="email"
                label="Email"
                helperText="Enter your email..."
                size="small"
                icon={<MailLockOutlined />}
                fullWidth
                required
              />

              <TextInput
                name="password"
                type="password"
                label="Password"
                helperText="Enter your password..."
                size="small"
                icon={<PasswordOutlined />}
                fullWidth
                required
              />

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column-reverse' : 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '15px',
                  width: '100%',
                }}
              >
                <Box sx={{ width: '60%' }}>
                  {submissionErrorMessage !== null && (
                    <Typography color={'error'}>
                      {submissionErrorMessage}
                    </Typography>
                  )}
                </Box>

                <Button type="submit" sx={{ width: '40%' }}>
                  Prihlásenie
                </Button>
              </Box>
            </Box>
          </Form>
        </Formik>

        {/* Providers Login */}
        <Box sx={{ marginTop: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Box
              sx={{
                width: '40%',
                height: 2.5,
                backgroundColor: 'black',
                opacity: '25%',
              }}
            ></Box>
            <Typography
              sx={{ width: '10%', display: 'flex', justifyContent: 'center' }}
            >
              OR
            </Typography>
            <Box
              sx={{
                width: '40%',
                height: 2.5,
                backgroundColor: 'black',
                opacity: '25%',
              }}
            ></Box>
          </Box>

          <Box
            sx={{
              marginTop: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '15px',
            }}
          >
            <Button
              sx={{
                borderColor: 'black',
                color: 'black',
                width: isMobile ? '85%' : '60%',
                display: 'flex',
                justifyContent: 'start',
              }}
              onClick={loginGoogle}
            >
              <Box sx={{ width: '15%' }}>
                <img src={googleIcon} style={{ width: '26px' }} />
              </Box>
              <Box sx={{ width: '85%' }}>
                <Typography variant="button" sx={{ opacity: '55%' }}>
                  Sign in with Google
                </Typography>
              </Box>
            </Button>

            <Button
              sx={{
                borderColor: 'black',
                color: 'black',
                width: isMobile ? '85%' : '60%',
                display: 'flex',
                justifyContent: 'start',
              }}
              onClick={loginGithub}
            >
              <Box sx={{ width: '15%' }}>
                <img src={githubIcon} style={{ width: '26px' }} />
              </Box>
              <Box sx={{ width: '85%' }}>
                <Typography variant="button" sx={{ opacity: '55%' }}>
                  Sign in with GitHub
                </Typography>
              </Box>
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

// - - - -

const RegisterForm = () => {
  const [submissionErrorMessage, setSubmissionErrorMessage] = useState<
    string | null
  >(null);
  const { setDialog } = useDialog();

  return (
    <>
      <Typography variant="h5" component="h2">
        Zaregistrujte sa do jazykovej školy!
      </Typography>
      <Typography variant="body2" component="span">
        A posuňte svoje jazykové znalosti na novú úroveň!
      </Typography>

      <Box sx={{ marginTop: 2.5 }}>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          onSubmit={async (values) => {
            console.log('values: ', values);
            try {
              // 1.) Register the user into authentization service
              const userCredential: UserCredential =
                await registerEmailPassword(values.email, values.password);
              console.log('userCredential: ', userCredential);
              const uid = userCredential.user.uid;

              // 2.) Register user into Firestore database with additional user fields
              await setUserById(uid, {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
              });
              setDialog({
                dialogTitle: 'Úspešná registrácia',
                dialogData: 'Registrácia prebehla úspešne!',
              });
              console.log('DONE!');
            } catch (error) {
              console.error(error);
              if (error instanceof FirebaseError) {
                setSubmissionErrorMessage(error.message);
              } else {
                setSubmissionErrorMessage('Registration has failed!');
              }
            }
          }}
          validationSchema={Yup.object({
            firstName: Yup.string().required('First name field is required!'),
            lastName: Yup.string().required('Last name field is required!'),
            email: Yup.string()
              .email('Invalid format of email!')
              .required('Email field is required!'),
            // TODO - maybe custom validation for stronger password!
            password: Yup.string()
              .min(8, 'Password must be at least 8 characters long!')
              .required('Password field is required!'),
            confirmPassword: Yup.string()
              .required('Password is required!')
              .oneOf([Yup.ref('password')], 'Passwords must match!'),
          })}
        >
          {(formik) => (
            <Form>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px',
                }}
              >
                <TextInput
                  name="firstName"
                  type="text"
                  label="First Name"
                  helperText="Enter your first name..."
                  size="small"
                  icon={<AccountCircleOutlined />}
                  fullWidth
                  required
                />

                <TextInput
                  name="lastName"
                  type="text"
                  label="Last name"
                  helperText="Enter your last name..."
                  size="small"
                  icon={<AccountCircleOutlined />}
                  fullWidth
                  required
                />

                <TextInput
                  name="email"
                  type="email"
                  label="Email"
                  helperText="Enter your email..."
                  size="small"
                  icon={<MailLockOutlined />}
                  fullWidth
                  required
                />

                <TextInput
                  name="password"
                  type="password"
                  label="Password"
                  helperText="Enter your password..."
                  size="small"
                  icon={<PasswordOutlined />}
                  fullWidth
                  required
                />

                <TextInput
                  name="confirmPassword"
                  type="password"
                  label="Confirmation of password"
                  helperText="Enter your password again..."
                  size="small"
                  icon={<PasswordOutlined />}
                  fullWidth
                  required
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button type="reset" sx={{ width: '45%' }}>
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    sx={{ width: '45%' }}
                    disabled={formik.isSubmitting}
                  >
                    {formik.isSubmitting ? (
                      <CircularProgress size={25} />
                    ) : (
                      'Registrácia'
                    )}
                  </Button>
                </Box>

                {submissionErrorMessage !== null && (
                  <Typography color={'error'}>
                    {submissionErrorMessage}
                  </Typography>
                )}
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};
