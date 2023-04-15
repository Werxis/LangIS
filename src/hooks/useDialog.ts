import { useRecoilState } from 'recoil';
import { DialogData, DialogOptions, dialogAtom } from '../recoil/atoms';

const useDialog = () => {
  const [dialog, setDialogAtom] = useRecoilState(dialogAtom);

  const setDialog = (
    dialogTitle: string,
    dialogData: DialogData,
    submitLabel?: string,
    onSubmit?: () => Promise<void>,
    onClose?: () => void,
    dialogOptions?: DialogOptions
  ) => {
    setDialogAtom({
      isDialogOpen: true,
      dialogTitle: dialogTitle,
      dialogData: dialogData,
      submitLabel: submitLabel,
      onSubmit: onSubmit,
      onClose: onClose,
      dialogOptions: dialogOptions,
    });
  };

  const closeDialog = () => {
    setDialogAtom((prevDialog) => ({
      ...prevDialog,
      isDialogOpen: false,
    }));
  };

  return { dialog, setDialog, closeDialog };
};

export default useDialog;
