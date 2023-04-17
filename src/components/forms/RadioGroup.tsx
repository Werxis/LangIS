import { useState, ChangeEvent } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  FormHelperText,
  RadioGroup as MuiRadioGroup,
  Radio,
} from '@mui/material';

import { useField } from 'formik';
import useMediaDevice from '../../hooks/useMediaDevice';

export type RadioOption<T> = {
  label: string;
  value: T;
};

type RadioGroupProps<T> = {
  name: string;
  options: RadioOption<T>[];
  direction: 'row' | 'column';
  id: string;
  label?: string;
  helperText?: string;
  size?: 'small' | 'medium';
  color?:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning'
    | 'default';
};

const RadioGroup = <T extends string>(props: RadioGroupProps<T>) => {
  // field contains { name, value, onChange, onBlur } -- value and onChange is rewritten
  // meta contains { value, error, touched, initialValue, initialError, initialTouched }
  // helper contains { setValue, setError, setTouched }
  const [field, meta, helper] = useField<T>(props.name);
  const [radioGroupValue, setRadioGroupValue] = useState<T | ''>(
    meta.initialValue ?? ''
  );
  const { isMobile } = useMediaDevice();

  const isError = meta.touched && meta.error !== undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const value = target.value as T;
    setRadioGroupValue(value);
    helper.setValue(value);
  };

  return (
    <FormControl error={isError}>
      <FormLabel id={props.id}>{props.label}</FormLabel>
      <MuiRadioGroup
        name={field.name}
        value={radioGroupValue}
        onChange={handleChange}
        onBlur={field.onBlur}
        id={props.id}
        row={props.direction === 'row'}
      >
        {props.options.map((option: RadioOption<T>) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            label={option.label}
            control={
              <Radio
                size={isMobile ? 'small' : props.size ?? 'medium'}
                color={isError ? 'error' : props.color ?? 'primary'}
              />
            }
          />
        ))}
      </MuiRadioGroup>
      <FormHelperText>{isError ? meta.error : props.helperText}</FormHelperText>
    </FormControl>
  );
};

export default RadioGroup;
