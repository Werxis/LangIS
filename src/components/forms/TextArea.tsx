import { FC } from 'react';
import { useField } from 'formik';
import useMediaDevice from '../../hooks/useMediaDevice';
import { TextField } from '@mui/material';

interface TextAreaProps {
  name: string;
  id?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  rows?: number; // initial rows height, after filling the rows with content.. automatically scrollbar
  minRows?: number; // even when empty, min height in rows, without maxRows.. will expand without scrollbar
  maxRows?: number; // max possible height to which can expand, then scrollbar
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface TextAreaAllProps extends TextAreaProps, Record<string, any> {}

const TextArea: FC<TextAreaAllProps> = (props) => {
  // field contains { name, value, onChange, onBlur }
  // meta contains { value, error, touched, initialValue, initialError, initialTouched }
  // helper contains { setValue, setError, setTouched }
  const [field, meta] = useField<string>(props.name);
  const { isMobile } = useMediaDevice();

  const isError = meta.touched && meta.error !== undefined;

  return (
    <TextField
      {...field}
      {...props}
      multiline
      variant="outlined"
      error={isError}
      helperText={isError ? meta.error : props.helperText}
      size={isMobile ? 'small' : 'medium'}
    />
  );
};

export default TextArea;
