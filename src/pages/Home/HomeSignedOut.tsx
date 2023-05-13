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
import { User, UserCredential } from 'firebase/auth';
import {
  registerEmailPassword,
  loginEmailPassword,
  loginGoogle,
  loginGithub,
} from '../../firebase/auth';
import { getUser, setUserById } from '../../firebase/firestore';

import bgImage from '../../assets/langis_home_background.jpg';
import googleIcon from '../../assets/icons/icon_google.svg';
import githubIcon from '../../assets/icons/icon_github.png';

import TextInput from '../../components/forms/TextInput';
import Button from '../../components/Button';

// Hooks
import { useMediaDevice, useDialog, useTranslation } from '../../hooks';
import { useIsLoginFormActive } from '../../recoil/atoms';
import { Link } from 'react-router-dom';

const HomeSignedOut = () => {
  const [isLoginFormActive] = useIsLoginFormActive();

  const { deviceType, isMobile } = useMediaDevice();

  return (
    <Box>
      {/* Navbar with height: '8vh' is also included, do not forget! */}

      {/* Background image + Login */}
      <Box
        sx={{
          height: '85vh',
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

      {/* Footer with height: '7vh' is also included, do not forget! */}
    </Box>
  );
};

export default HomeSignedOut;

// - - -

const LoginForm = () => {
  const [submissionErrorMessage, setSubmissionErrorMessage] = useState<
    string | null
  >(null);

  const t = useTranslation();
  const { isMobile } = useMediaDevice();
  const [isLoginFormActive, setIsLoginFormActive] = useIsLoginFormActive();

  return (
    <>
      <Typography variant="h5" component="h2">
        {t('login')}
      </Typography>

      <Box sx={{ marginTop: 2.5 }}>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          onSubmit={async (values) => {
            try {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const userCredential: UserCredential = await loginEmailPassword(
                values.email,
                values.password
              );
            } catch (error) {
              console.error(error);
              if (error instanceof FirebaseError) {
                setSubmissionErrorMessage(error.message);
              } else {
                setSubmissionErrorMessage(t('registration_failure'));
              }
            }
          }}
          validationSchema={Yup.object({
            email: Yup.string().email().required(t('email_field_required')),
            password: Yup.string().required(t('password_field_required')),
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
                label={t('email')}
                helperText={t('enter_your_email')}
                size="small"
                icon={<MailLockOutlined />}
                fullWidth
                required
              />

              <TextInput
                name="password"
                type="password"
                label={t('password')}
                helperText={t('enter_your_password')}
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
                  {t('login')}
                </Button>

                <Typography>
                  {t('no_account_yet')}{' '}
                  <Link
                    to="#"
                    onClick={() => setIsLoginFormActive(!isLoginFormActive)}
                  >
                    {t('register_yourself')}
                  </Link>
                </Typography>

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
              {t('or_uppercase')}
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
  const t = useTranslation();

  const handleLogin = async () => {
    try {
      const userCredential: UserCredential = await loginHandler();
      const user: User = userCredential.user;
      const names = user.displayName?.split(' ');

      const fetchedUser = await getUser(user.uid);
      if (fetchedUser !== undefined) {
        // User already exists, was logged with provider and thus created before!
        return;
      }

      await setUserById(user.uid, {
        firstName: (names && names[0]) ?? '',
        lastName: (names && names[1]) ?? '',
        email: user.email ?? '',
        role: 'student',
        photoUrl: user.photoURL,
        age: null,
        location: null,
        description: null,
      });
    } catch (error) {
      console.error(error);
      if (error instanceof FirebaseError) {
        setSubmissionErrorMessage(error.message);
      } else {
        setSubmissionErrorMessage(t('login_failure'));
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
          {t('sign_in_with')}
          {providerName}
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
  const [isLoginFormActive, setIsLoginFormActive] = useIsLoginFormActive();

  const t = useTranslation();

  return (
    <>
      <Typography variant="h5" component="h2">
        {t('register_for_language_school')}
      </Typography>
      <Typography variant="body2" component="span">
        {t('take_language_skills_to_next_level')}
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
            try {
              // 1.) Register the user into authentization service
              const userCredential: UserCredential =
                await registerEmailPassword(values.email, values.password);

              const uid = userCredential.user.uid;

              // 2.) Register user into Firestore database with additional user fields
              await setUserById(uid, {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                role: 'student',
                photoUrl: null,
                age: null,
                location: null,
                description: null,
              });
              setDialog({
                dialogTitle: t('registration_success_title'),
                dialogData: t('registration_success_msg'),
              });
            } catch (error) {
              console.error(error);
              if (error instanceof FirebaseError) {
                setSubmissionErrorMessage(error.message);
              } else {
                setSubmissionErrorMessage(t('registration_failure'));
              }
            }
          }}
          validationSchema={Yup.object({
            firstName: Yup.string().required(t('first_name_field_required')),
            lastName: Yup.string().required(t('last_name_field_required')),
            email: Yup.string()
              .email(t('invalid_email_format'))
              .required(t('email_field_required')),
            // TODO - maybe custom validation for stronger password!
            password: Yup.string()
              .min(8, t('invalid_length_password'))
              .required(t('password_field_required')),
            confirmPassword: Yup.string()
              .required(t('password_field_required'))
              .oneOf([Yup.ref('password')], t('passwords_must_match')),
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
                  label={t('first_name')}
                  helperText={t('enter_your_first_name')}
                  size="small"
                  icon={<AccountCircleOutlined />}
                  fullWidth
                  required
                />

                <TextInput
                  name="lastName"
                  type="text"
                  label={t('last_name')}
                  helperText={t('enter_your_last_name')}
                  size="small"
                  icon={<AccountCircleOutlined />}
                  fullWidth
                  required
                />

                <TextInput
                  name="email"
                  type="email"
                  label={t('email')}
                  helperText={t('enter_your_email')}
                  size="small"
                  icon={<MailLockOutlined />}
                  fullWidth
                  required
                />

                <TextInput
                  name="password"
                  type="password"
                  label={t('password')}
                  helperText={t('enter_your_password')}
                  size="small"
                  icon={<PasswordOutlined />}
                  fullWidth
                  required
                />

                <TextInput
                  name="confirmPassword"
                  type="password"
                  label={t('confirm_password')}
                  helperText={t('enter_your_confirmation_password')}
                  size="small"
                  icon={<PasswordOutlined />}
                  fullWidth
                  required
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button type="reset" sx={{ width: '45%' }}>
                    {t('reset')}
                  </Button>
                  <Button
                    type="submit"
                    sx={{ width: '45%' }}
                    disabled={formik.isSubmitting}
                  >
                    {formik.isSubmitting ? (
                      <CircularProgress size={25} />
                    ) : (
                      t('registration')
                    )}
                  </Button>
                </Box>

                <Typography>
                  {t('already_have_account')}{' '}
                  <Link
                    to="#"
                    onClick={() => setIsLoginFormActive(!isLoginFormActive)}
                  >
                    {t('login_yourself')}
                  </Link>
                </Typography>

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
