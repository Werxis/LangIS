import { useState, FC, MouseEvent } from 'react';
import { User } from 'firebase/auth';

import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { blue } from '@mui/material/colors';

import LanguageSelect from './LanguageSelect';
import Button from './Button';

import { useDialog, useMediaDevice, useTranslation } from '../hooks';
import { useIsLoginFormActive } from '../recoil/atoms';
import { useNavigate } from 'react-router-dom';

import { logout } from '../firebase/auth';
import { LangIsUserWithId } from '../firebase/firestore';
import { retrieveProfilePhotoUrl } from '../utils';

// - - -

interface NavBarProps {
  user: User | null; // user === null means that NotSigned.. otherwise SignedIn
  userLangIs: LangIsUserWithId | null;
}

const NavBar: FC<NavBarProps> = ({ user, userLangIs }) => {
  if (user === null) {
    return <NavBarSignOut />;
  }

  return <NavBarSignIn user={user} userLangIs={userLangIs} />;
};

export default NavBar;

// - - -

interface NavBarSignInProps {
  user: User;
  userLangIs: LangIsUserWithId | null;
}

const NavBarSignIn: FC<NavBarSignInProps> = ({ user, userLangIs }) => {
  const { isMobile, deviceType } = useMediaDevice();
  const navigate = useNavigate();
  const avatarPhotoUrl = retrieveProfilePhotoUrl(user, userLangIs);
  const t = useTranslation();

  const menuOptions: MenuOption[] = [
    {
      label: t('profile'),
      onClick: () => navigate('/profile'),
      isDesktopOption: true,
    },
    {
      label: t('courses'),
      onClick: () => navigate('/courses'),
      isDesktopOption: false,
    },
    {
      label: t('myCourses'),
      onClick: () => navigate('my-courses'),
      isDesktopOption: false,
    },
    {
      label: t('logout'),
      onClick: () => logout(),
      isDesktopOption: true,
    },
  ];

  return (
    <Box
      component="nav"
      sx={{
        minHeight: '75px',
        backgroundColor: blue[900],
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {/* Left side with logo and buttons */}
      <Box
        sx={{
          marginLeft: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: '25px',
        }}
      >
        <Box onClick={() => navigate('/')}>
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            component="h1"
            sx={{ color: 'white', cursor: 'pointer' }}
          >
            LangIS
          </Typography>
        </Box>

        {deviceType === 'desktop' && (
          <>
            <Button onClick={() => navigate('/courses')}>{t('courses')}</Button>
            <Button onClick={() => navigate('/my-courses')}>
              {t('myCourses')}
            </Button>
          </>
        )}
      </Box>

      {/* Right side with profile, logout, language selections! */}
      <Box
        sx={{
          marginRight: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: '25px',
        }}
      >
        <LanguageSelect />
        <AvatarButton avatarSrc={avatarPhotoUrl} menuOptions={menuOptions} />
      </Box>
    </Box>
  );
};

// - - -

interface MenuOption {
  label: string;
  onClick: () => void;
  isDesktopOption: boolean;
}

interface AvatarButtonProps {
  avatarSrc: string;
  menuOptions: MenuOption[];
}

const AvatarButton: FC<AvatarButtonProps> = (props) => {
  const { deviceType } = useMediaDevice();
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const filteredMenuOptions = props.menuOptions.filter((menuOption) => {
    if (deviceType == 'desktop' && !menuOption.isDesktopOption) {
      return false;
    }
    return true;
  });

  return (
    <Box>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar
            src={props.avatarSrc}
            alt="profile picture"
            sx={{ width: '40px' }}
          />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        anchorEl={anchorElUser}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={!!anchorElUser}
        onClose={handleCloseUserMenu}
      >
        {filteredMenuOptions.map((menuOption) => (
          <MenuItem
            key={menuOption.label}
            onClick={() => {
              menuOption.onClick();
              handleCloseUserMenu();
            }}
          >
            <Typography>{menuOption.label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

// - - -

const NavBarSignOut = () => {
  const [isLoginFormActive, setIsLoginFormActive] = useIsLoginFormActive();
  const [anchorElNav, setAnchorElNav] = useState<HTMLElement | null>(null);
  const { isMobile } = useMediaDevice();
  const t = useTranslation();
  const navigate = useNavigate();
  const { setDialog } = useDialog();

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenAboutDialog = () => {
    setDialog({
      dialogTitle: t('about'),
      dialogData: <AboutDialogData />,
      dialogOptions: { size: 'medium' },
    });
  };

  return (
    <Box
      component="nav"
      sx={{
        height: '8vh',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: blue[900],
      }}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: '25px' }}
        onClick={() => navigate('/')}
      >
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          component="h1"
          sx={{ color: 'white', marginLeft: 2.5, cursor: 'pointer' }}
        >
          LangIS
        </Typography>

        {!isMobile && (
          <Button onClick={handleOpenAboutDialog}>{t('about')}</Button>
        )}
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
            {isLoginFormActive ? t('registration') : t('login')}
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
                  {isLoginFormActive ? t('registration') : t('login')}
                </Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleOpenAboutDialog();
                  handleCloseNavMenu();
                }}
              >
                <Typography>{t('about')}</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      )}
    </Box>
  );
};

// - - - -

const AboutDialogData = () => {
  return (
    <Box sx={{ fontStyle: 'italic' }}>
      <Typography>
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. In dapibus
        augue non sapien. Mauris tincidunt sem sed arcu. Aliquam id dolor. Morbi
        imperdiet, mauris ac auctor dictum, nisl ligula egestas nulla, et
        sollicitudin sem purus in lacus. Fusce tellus. Nullam sit amet magna in
        magna gravida vehicula.
      </Typography>

      <Typography marginTop={4}>
        Integer vulputate sem a nibh rutrum consequat. Integer in sapien.
        Curabitur sagittis hendrerit ante. Praesent dapibus. Duis bibendum,
        lectus ut viverra rhoncus, dolor nunc faucibus libero, eget facilisis
        enim ipsum id lacus. Donec quis nibh at felis congue commodo. Nunc
        dapibus tortor vel mi dapibus sollicitudin. Aenean id metus id velit
        ullamcorper pulvinar. Nullam sapien sem, ornare ac, nonummy non,
        lobortis a enim. Mauris tincidunt sem sed arcu. Mauris elementum mauris
        vitae tortor. Cum sociis natoque penatibus et magnis dis parturient
        montes, nascetur ridiculus mus. Nullam at arcu a est sollicitudin
        euismod.
      </Typography>

      <Typography marginTop={4}>
        In laoreet, magna id viverra tincidunt, sem odio bibendum justo, vel
        imperdiet sapien wisi sed libero. Integer tempor. Suspendisse nisl.
        Mauris suscipit, ligula sit amet pharetra semper, nibh ante cursus
        purus, vel sagittis velit mauris vel metus.
      </Typography>
    </Box>
  );
};
