import {
  Box,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';

import { useLanguage } from '../hooks';

import Flag from 'react-flagkit';
import { LanguageKeys, languageKeys } from '../localization';

// https://github.com/madebybowtie/FlagKit/blob/master/Assets/Flags.md
const resolveLanguageKeyToFlagKey = (languageKey: LanguageKeys) => {
  switch (languageKey) {
    case 'cs':
      return 'CZ';
    case 'sk':
      return 'SK';
    case 'en':
      return 'GB';
    default:
      return 'GB';
  }
};

const LanguageSelect = () => {
  const [language, setLanguage] = useLanguage();

  const onLanguageChange = (event: SelectChangeEvent) => {
    const newLanguageValue = event.target.value as LanguageKeys;
    setLanguage(newLanguageValue);
  };

  return (
    <FormControl size="small">
      <Select
        variant="outlined"
        id="select-language"
        value={language}
        onChange={onLanguageChange}
        autoWidth
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
          },
          '& .MuiSelect-select': {
            py: 0.8,
          },
          '& .MuiSelect-iconOutlined': {
            color: 'white',
          },
        }}
      >
        {languageKeys.map((languageKey: LanguageKeys) => (
          <MenuItem key={languageKey} value={languageKey}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'center',
                mr: 1,
              }}
            >
              <Flag
                country={resolveLanguageKeyToFlagKey(languageKey)}
                size={25}
              />
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelect;
