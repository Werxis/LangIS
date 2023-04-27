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

import { useMediaDevice } from '../hooks';
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

  const menuOptions: MenuOption[] = [
    {
      label: 'Profile',
      onClick: () => navigate('/profile'),
      isDesktopOption: true,
    },
    {
      label: 'Button 1',
      onClick: () => console.log('Button 1'),
      isDesktopOption: false,
    },
    {
      label: 'Button 2',
      onClick: () => console.log('Button 2'),
      isDesktopOption: false,
    },
    {
      label: 'Button 3',
      onClick: () => console.log('Button 3'),
      isDesktopOption: false,
    },
    {
      label: 'Logout',
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
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          component="h1"
          sx={{ color: 'white', cursor: 'pointer' }}
        >
          LangIS
        </Typography>

        {deviceType === 'desktop' && (
          <>
            <Button>Button 1</Button>
            <Button>Button 2</Button>
            <Button>Button 3</Button>
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
