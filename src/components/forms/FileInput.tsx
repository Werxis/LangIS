import { FC, useState, ChangeEvent } from 'react';
import { useField } from 'formik';

import { Box, TextField, TextFieldProps, Typography } from '@mui/material';
import { useMediaDevice } from '../../hooks';

export type FileInputValue = File | FileList | File[] | null;
export type FileInputValueWithoutNull = File | FileList | File[];

interface FileInputProps {
  name: string;
  fileType: 'single' | 'multiple' | 'oneByOne';
  printFilesInfo?: boolean;
  id?: string;
  //label?: string;
  accept?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: TextFieldProps['size'];
  color?: TextFieldProps['color'];
  variant?: TextFieldProps['variant'];
  helperText?: string;
  sx?: TextFieldProps['sx'];
}

const FileInput: FC<FileInputProps> = (props) => {
  // field contains { name, value, onChange, onBlur }
  // meta contains { value, error, touched, initialValue, initialError, initialTouched }
  // helper contains { setValue, setError, setTouched }
  const [field, meta, helper] = useField<FileInputValue>(props.name);

  const { isMobile } = useMediaDevice();

  const [uploadedSingleFile, setUploadedSingleFile] = useState<File | null>(
    null
  );

  const [uploadedMultipleFiles, setUploadedMultipleFiles] =
    useState<FileList | null>(null);
  const [uploadedFilesOneByOne, setUploadedFilesOneByOne] = useState<File[]>(
    []
  );

  const onChangeSingleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList: FileList | null = e.currentTarget.files;
    const fileValue: File | null = fileList ? fileList[0] : null;
    setUploadedSingleFile(fileValue);
    helper.setValue(fileValue);
  };

  const onChangeMultipleFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList: FileList | null = e.currentTarget.files;
    setUploadedMultipleFiles(fileList ? fileList : null);
    helper.setValue(fileList ? fileList : null);
  };

  const onChangeOneByOne = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList: FileList | null = e.currentTarget.files;
    const newFile: File | null = fileList ? fileList[0] : null;
    if (newFile === null || newFile === undefined) {
      setUploadedFilesOneByOne([]);
      helper.setValue([]);
      return;
    }
    const newArr: File[] = [...uploadedFilesOneByOne, newFile];
    setUploadedFilesOneByOne(newArr);
    helper.setValue(newArr);
  };

  const isError = meta.touched && meta.error !== undefined;

  const getFilesToPrint = (): File[] | null => {
    if (props.fileType === 'single' && uploadedSingleFile) {
      const arr = [uploadedSingleFile];
      return arr;
    }
    if (props.fileType === 'multiple' && uploadedMultipleFiles) {
      const arr: File[] = [];
      for (let i = 0; i < uploadedMultipleFiles.length; i++) {
        const currItem = uploadedMultipleFiles.item(i);
        if (currItem) {
          arr.push(currItem);
        }
      }
      return arr;
    }
    if (props.fileType === 'oneByOne') {
      return uploadedFilesOneByOne;
    }
    return null;
  };

  const filesToPrint = props.printFilesInfo ? getFilesToPrint() : null;

  return (
    <Box sx={{ display: props.printFilesInfo ? 'block' : 'inline-flex' }}>
      <TextField
        // ...field for setting the name and onBlur, the value and onChange is custom!
        name={field.name}
        onBlur={field.onBlur}
        id={props.id}
        required={props.required}
        disabled={props.disabled}
        fullWidth={props.fullWidth}
        size={isMobile ? 'small' : props.size ?? 'medium'}
        color={props.color}
        variant={props.variant}
        sx={props.sx}
        // Main logic!!
        type="file"
        inputProps={{
          multiple: props.fileType === 'multiple',
          accept: props.accept,
        }}
        // value should not be null, consider using empty string!
        // value is automatically programatically set by the html input itself!
        // value={
        //   props.fileType === 'single'
        //     ? uploadedSingleFile
        //     : props.fileType === 'multiple'
        //     ? uploadedMultipleFiles
        //     : uploadedFilesOneByOne
        // }
        onChange={(e) => {
          if (props.fileType === 'single') {
            onChangeSingleFile(e as ChangeEvent<HTMLInputElement>);
          }
          if (props.fileType === 'multiple') {
            onChangeMultipleFiles(e as ChangeEvent<HTMLInputElement>);
          }
          if (props.fileType === 'oneByOne') {
            onChangeOneByOne(e as ChangeEvent<HTMLInputElement>);
          }
        }}
        // Error logic
        error={isError}
        helperText={isError ? meta.error : props.helperText}
      />

      {props.printFilesInfo && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: 2,
            marginTop: 0.5,
          }}
        >
          {filesToPrint &&
            filesToPrint.length > 0 &&
            filesToPrint.map((file: File) => (
              <Typography key={file.name} variant="body2" component="span">
                {file.name}
              </Typography>
            ))}
        </Box>
      )}
    </Box>
  );
};

export default FileInput;
