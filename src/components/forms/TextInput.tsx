import { useState, ReactNode, FC } from 'react';
import { useField } from 'formik';
import { useMediaDevice } from '../../hooks';

import { TextField, Icon, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface TextInputProps {
  name: string;
  type: 'text' | 'email' | 'password';
  id?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  icon?: string | ReactNode;
  size?: 'small' | 'medium';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface TextInputAllProps extends TextInputProps, Record<string, any> {}

const TextInput: FC<TextInputAllProps> = (props) => {
  // field contains { name, value, onChange, onBlur }
  // meta contains { value, error, touched, initialValue, initialError, initialTouched }
  // helper contains { setValue, setError, setTouched }
  const [field, meta] = useField<string>(props.name);
  const { isMobile } = useMediaDevice();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const isError = meta.touched && meta.error !== undefined;
  const icon = props.icon;
  const fieldType =
    props.type === 'password' && showPassword ? 'text' : props.type;

  return (
    <TextField
      {...field}
      {...props}
      variant="outlined"
      type={fieldType}
      error={isError}
      helperText={isError ? meta.error : props.helperText}
      size={isMobile ? 'small' : props.size ?? 'medium'}
      InputProps={{
        startAdornment:
          icon === undefined ? undefined : typeof icon === 'string' ? (
            <Icon>{icon}</Icon>
          ) : (
            icon
          ),
        style: { display: 'flex', gap: 8 },
        endAdornment:
          props.type === 'password' ? (
            <IconButton onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ) : undefined,
      }}
    />
  );
};

export default TextInput;
