import { useState, useTransition } from 'react';
import {
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

import { useDialog, useTranslation } from '../../hooks';
import { DialogOptions } from '../../recoil/atoms';

const resolveDialogSize = (dialogSize: DialogOptions['size']) => {
  if (!dialogSize || dialogSize === 'tiny') {
    return 'xs';
  } else if (dialogSize === 'small') {
    return 'sm';
  } else if (dialogSize === 'medium') {
    return 'md';
  } else if (dialogSize === 'large') {
    return 'lg';
  } else if (dialogSize === 'largest') {
    return 'xl';
  } else {
    return '' as never;
  }
};

const DialogWrapper = () => {
  const t = useTranslation();
  const { dialog, closeDialog } = useDialog();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const dialogSize = dialog.dialogOptions?.size;

  const onCloseHandler = () => {
    if (dialog.onClose) {
      dialog.onClose();
    }
    closeDialog();
  };

  const onSubmitHandler = async () => {
    if (dialog.onSubmit) {
      setIsSubmitting(true);
      await dialog.onSubmit();
      setIsSubmitting(false);
    }
    closeDialog();
  };

  return (
    <Dialog
      open={dialog.isDialogOpen}
      onClose={onCloseHandler}
      maxWidth={resolveDialogSize(dialogSize)}
      fullWidth
    >
      <DialogTitle>{dialog.dialogTitle}</DialogTitle>
      <DialogContent>
        {dialog.dialogData && typeof dialog.dialogData === 'string' ? (
          <DialogContentText>{dialog.dialogData}</DialogContentText>
        ) : (
          <>{dialog.dialogData}</>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseHandler} sx={{ minWidth: 100 }}>
          {t('cancel')}
        </Button>
        {dialog.onSubmit && (
          <Button
            onClick={onSubmitHandler}
            variant={isSubmitting ? 'text' : 'contained'}
            sx={{ minWidth: 100 }}
          >
            {isSubmitting ? (
              <CircularProgress size={25} />
            ) : (
              dialog.submitLabel ?? 'Submit'
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DialogWrapper;
