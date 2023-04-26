import { ReactNode } from 'react';
import { atom, useRecoilState } from 'recoil';
import { LanguageKeys } from '../localization';
import { recoilPersist } from 'recoil-persist';

// - - -

const { persistAtom: persistLanguageAtom } = recoilPersist({
  key: 'language',
  storage: localStorage,
});

export const languageAtom = atom<LanguageKeys>({
  key: 'languageAtom',
  default: 'cs',
  effects_UNSTABLE: [persistLanguageAtom],
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

// - - -

const loginFormActiveAtom = atom<boolean>({
  key: 'loginFormActiveAtom',
  default: true,
});

export const useIsLoginFormActive = () => {
  // [boolean, SetterOrUpdater<boolean>]
  return useRecoilState(loginFormActiveAtom);
};
