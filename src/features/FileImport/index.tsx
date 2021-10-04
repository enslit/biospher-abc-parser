import React, { useCallback, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { Paper, Typography } from '@mui/material';
import { read, WorkBook } from 'xlsx';
import { styled } from '@mui/material/styles';
import Loader from '../../components/Loader';
import { useAppDispatch } from '../../app/hooks';
import { setError } from '../../app/appReducer';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
}));

const DropZoneWrapper = styled('div')(({ theme }) => ({
  border: '2px dashed ' + theme.palette.grey.A700,
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(5),
  textAlign: 'center',
  cursor: 'pointer',
  transition: `all 200ms ease-in-out`,

  '&:hover': {
    borderColor: theme.palette.common.white,
  },
}));

interface Props {
  onLoad: (workBook: WorkBook) => void;
}

const FileImport = (props: Props): JSX.Element => {
  const [inProgress, setInProgress] = useState(false);
  const appDispatch = useAppDispatch();

  const handlerImportFile = useCallback(
    (files: File[]): void => {
      if (files.length > 0) {
        setInProgress(true);

        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(files[0]);
        fileReader.onload = (evt) => {
          if (evt.target && evt.target.result) {
            const data = new Uint8Array(evt.target.result as ArrayBuffer);
            const wb: WorkBook = read(data, { type: 'array' });

            setInProgress(false);
            props.onLoad(wb);
          }
        };
      }
    },
    [props]
  );

  const handlerRejectedFile = useCallback(
    (fileRejections: FileRejection[]): void => {
      if (fileRejections.length > 0) {
        appDispatch(setError(fileRejections[0].errors[0].message));
      }
    },
    [appDispatch]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
    onDropAccepted: handlerImportFile,
    onDropRejected: handlerRejectedFile,
    maxFiles: 1,
  });

  return (
    <StyledPaper>
      {inProgress ? (
        <Loader />
      ) : (
        <DropZoneWrapper {...getRootProps()}>
          <input {...getInputProps()} />
          <Typography variant="body1" component="div">
            Перетащите файлы в эту зону или кликните для выбора файла
          </Typography>
          <Typography variant="caption" component="em">
            (Поддерживается загрузка из файлов с расширением .xslx и .xls
            (EXCEL))
          </Typography>
        </DropZoneWrapper>
      )}
    </StyledPaper>
  );
};

export default FileImport;
