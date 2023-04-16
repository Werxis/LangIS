import { useField } from 'formik';
import useMediaDevice from '../../hooks/useMediaDevice';

import { TextField, MenuItem } from '@mui/material';

type Option<T> = {
  label: string;
  value: T;
  decoration?: 'italic' | 'bold';
};

type SelectInputProps<T> = {
  name: string;
  options: Option<T>[];
  id: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  fullWidth?: boolean;
};

const SingleSelect = <T extends string>(props: SelectInputProps<T>) => {
  // field contains { name, value, onChange, onBlur }
  // meta contains { value, error, touched, initialValue, initialError, initialTouched }
  // helper contains { setValue, setError, setTouched }
  const [field, meta] = useField<T>(props.name);
  const { isMobile } = useMediaDevice();

  const isError = meta.touched && meta.error !== undefined;

  return (
    <TextField
      {...field}
      {...props}
      variant="outlined"
      select
      error={isError}
      helperText={isError ? meta.error : props.helperText}
      size={isMobile ? 'small' : 'medium'}
    >
      {props.options.map((option: Option<T>) => (
        <MenuItem key={option.value} value={option.value}>
          {option.decoration === 'italic' ? (
            <em>{option.label}</em>
          ) : option.decoration === 'bold' ? (
            <strong>{option.label}</strong>
          ) : (
            <>{option.label}</>
          )}
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SingleSelect;
