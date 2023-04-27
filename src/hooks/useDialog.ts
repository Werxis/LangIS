import { useRecoilState } from 'recoil';
import { DialogData, DialogOptions, dialogAtom } from '../recoil/atoms';

interface SetDialogArgs {
  dialogTitle: string;
  dialogData: DialogData;
  submitLabel?: string;
  onSubmit?: () => void | Promise<void>;
  onClose?: () => void;
  dialogOptions?: DialogOptions;
}

const useDialog = () => {
  const [dialog, setDialogAtom] = useRecoilState(dialogAtom);

  const setDialog = (args: SetDialogArgs) => {
    setDialogAtom({
      isDialogOpen: true,
      dialogTitle: args.dialogTitle,
      dialogData: args.dialogData,
      submitLabel: args.submitLabel,
      onSubmit: args.onSubmit,
      onClose: args.onClose,
      dialogOptions: args.dialogOptions,
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
