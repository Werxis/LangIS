import { Checkbox as MuiCheckbox, FormControlLabel, Icon } from '@mui/material';
import { useField } from 'formik';
import { FC, ReactNode } from 'react';
import { useMediaDevice } from '../../hooks';

interface CheckboxProps {
  name: string;
  id?: string;
  label?: string;
  disabled?: boolean;
  size?: 'small' | 'medium';
  color?:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning'
    | 'default';
  icon?: ReactNode | string;
  checkedIcon?: ReactNode | string;
}

const Checkbox: FC<CheckboxProps> = (props) => {
  const [field] = useField({ name: props.name, type: 'checkbox' });
  const { isMobile } = useMediaDevice();

  const iconComponent =
    props.icon && typeof props.icon === 'string' ? (
      <Icon>{props.icon}</Icon>
    ) : (
      props.icon
    );

  const checkedIconComponent =
    props.checkedIcon && typeof props.checkedIcon === 'string' ? (
      <Icon>{props.checkedIcon}</Icon>
    ) : (
      props.checkedIcon
    );

  // Possibility to wrap FormControlLabel with FormGroup!
  return props.label !== undefined ? (
    <FormControlLabel
      control={
        <MuiCheckbox
          {...field}
          {...props}
          size={isMobile ? 'small' : props.size ?? 'medium'}
          icon={iconComponent}
          checkedIcon={checkedIconComponent}
        />
      }
      label={props.label}
    />
  ) : (
    <MuiCheckbox
      {...field}
      {...props}
      size={isMobile ? 'small' : props.size ?? 'medium'}
      icon={iconComponent}
      checkedIcon={checkedIconComponent}
    />
  );
};

export default Checkbox;
