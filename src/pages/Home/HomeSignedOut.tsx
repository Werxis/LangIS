import { useState, FC } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import {
  AccountCircleOutlined,
  MailLockOutlined,
  PasswordOutlined,
} from '@mui/icons-material';
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

import TextInput from '../../components/forms/TextInput';
import Button from '../../components/Button';

// Hooks
import { useMediaDevice, useDialog } from '../../hooks';
import { useIsLoginFormActive } from '../../recoil/atoms';

const HomeSignedOut = () => {
  const [isLoginFormActive] = useIsLoginFormActive();

  const { deviceType, isMobile } = useMediaDevice();

  return (
    <Box>
      {/* Navbar with height: '8vh' is also included, do not forget! */}

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
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '15px',
                  width: '100%',
                }}
              >
                <Button type="submit" sx={{ width: isMobile ? '50%' : '40%' }}>
                  Prihlásenie
                </Button>

                <Box>
                  {submissionErrorMessage !== null && (
                    <Typography color={'error'}>
                      {submissionErrorMessage}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Form>
        </Formik>

        {/* Providers Login */}
        <Box sx={{ marginTop: 3 }}>
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
            <SignInProvidersButton
              loginHandler={loginGoogle}
              providerIconSrc={googleIcon}
              providerName="Google"
              setSubmissionErrorMessage={setSubmissionErrorMessage}
            />

            <SignInProvidersButton
              loginHandler={loginGithub}
              providerIconSrc={githubIcon}
              providerName="Github"
              setSubmissionErrorMessage={setSubmissionErrorMessage}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

// - - -

interface SignInProvidersButtonProps {
  providerIconSrc: string;
  providerName: string;
  loginHandler: () => Promise<UserCredential>;
  setSubmissionErrorMessage: React.Dispatch<
    React.SetStateAction<string | null>
  >;
}

const SignInProvidersButton: FC<SignInProvidersButtonProps> = ({
  providerIconSrc,
  providerName,
  loginHandler,
  setSubmissionErrorMessage,
}) => {
  const { isMobile } = useMediaDevice();

  const handleLogin = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userCredential: UserCredential = await loginHandler();
      //const user: User = userCredential.user;
    } catch (error) {
      console.error(error);
      if (error instanceof FirebaseError) {
        setSubmissionErrorMessage(error.message);
      } else {
        setSubmissionErrorMessage('Login has failed!');
      }
    }
  };

  return (
    <Button
      sx={{
        borderColor: 'black',
        color: 'black',
        width: isMobile ? '85%' : '60%',
        display: 'flex',
        justifyContent: 'start',
      }}
      onClick={handleLogin}
    >
      <Box sx={{ width: '15%' }}>
        <img src={providerIconSrc} style={{ width: '26px' }} />
      </Box>
      <Box sx={{ width: '85%' }}>
        <Typography variant="button" sx={{ opacity: '55%' }}>
          Sign in with {providerName}
        </Typography>
      </Box>
    </Button>
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
