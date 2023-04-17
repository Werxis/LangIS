import { useField } from 'formik';
import useMediaDevice from '../../hooks/useMediaDevice';

import { TextField, MenuItem } from '@mui/material';

export type SelectOption<T> = {
  label: string;
  value: T;
  decoration?: 'italic' | 'bold';
};

export type SelectOptions<T> = SelectOption<T>[];

type SelectInputProps<T> = {
  name: string;
  options: SelectOption<T>[];
  id: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
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
      size={isMobile ? 'small' : props.size ?? 'medium'}
    >
      {props.options.map((option: SelectOption<T>) => (
        <MenuItem key={option.value} value={option.value}>
          {option.decoration === 'italic' ? (
            <em>{option.label}</em>
          ) : option.decoration === 'bold' ? (
            <strong>{option.label}</strong>
          ) : (
            <>{option.label}</>
          )}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SingleSelect;
