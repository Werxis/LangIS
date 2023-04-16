import { useMediaQuery, useTheme } from '@mui/material';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * `Mobile width: <0px, 600px>`
 *
 * `Tablet width: <600px, 1200px>`
 *
 * `Desktop width: <1200px, inf>`
 */
const useMediaDevice = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const deviceType: DeviceType = isMobile
    ? 'mobile'
    : isTablet
    ? 'tablet'
    : isDesktop
    ? 'desktop'
    : (undefined as never);

  return { deviceType, isMobile };
};

export default useMediaDevice;
