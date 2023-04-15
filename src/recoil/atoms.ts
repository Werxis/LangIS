import { ReactNode } from 'react';
import { atom } from 'recoil';
import { LanguageKeys } from '../localization';

// - - -

export const languageAtom = atom<LanguageKeys>({
  key: 'languageAtom',
  default: 'cs',
});

// - - -

export type DialogData = ReactNode | string;
export type DialogOptions = {
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'largest';
};
export type Dialog = {
  isDialogOpen: boolean;
  dialogTitle?: string;
  dialogData?: DialogData;
  submitLabel?: string;
  onSubmit?: () => void | Promise<void>;
  onClose?: () => void;
  dialogOptions?: DialogOptions;
};

export const dialogAtom = atom<Dialog>({
  key: 'dialogAtom',
  default: {
    isDialogOpen: false,
  },
});
