import { FC, PropsWithChildren } from 'react';
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from '@mui/material';

const Button: FC<PropsWithChildren<MuiButtonProps>> = (props) => {
  // TODO - design of submit, reset and classic button!
  const variant =
    props.type === 'submit'
      ? 'contained'
      : props.type === 'reset'
      ? 'outlined'
      : props.variant ?? 'outlined';

  const color =
    props.type === 'submit'
      ? 'success'
      : props.type === 'reset'
      ? 'warning'
      : props.color ?? 'primary';

  return (
    <MuiButton
      {...props}
      variant={variant}
      size={props.size ?? 'medium'}
      color={color}
      sx={
        props.type === 'submit' || props.type === 'reset'
          ? props.sx
          : {
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: 'black',
              },
              ...props.sx,
            }
      }
    >
      {props.children}
    </MuiButton>
  );
};

export default Button;
