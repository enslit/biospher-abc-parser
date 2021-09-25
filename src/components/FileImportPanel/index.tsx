import React, { FC, useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { Paper, Typography } from '@mui/material';
import { ActionType } from '../../types/state/ActionType';
import { read, WorkBook } from 'xlsx';
import { importWorkBook, setFileDetails } from '../../state/actions';
import { AppDispatchContext, AppStateContext } from '../App/App';
import { TFileDetails } from '../../types/parser/TFIleDetails';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
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

const FileImportPanel: FC = () => {
  const dispatch = useContext(AppDispatchContext);
  const { fileDetails } = useContext(AppStateContext);

  const handlerImportFile = useCallback(
    (files: File[]): void => {
      if (files.length > 0) {
        const fileMeta: TFileDetails = {
          name: files[0].name,
          size: files[0].size,
          type: files[0].type,
          lastModified: files[0].lastModified,
        };

        dispatch(setFileDetails(fileMeta));
        dispatch({ type: ActionType.InProgressOn });

        const fileReader = new FileReader();
        console.time('file reader');
        fileReader.readAsArrayBuffer(files[0]);
        fileReader.onload = (evt) => {
          if (evt.target && evt.target.result) {
            const data = new Uint8Array(evt.target.result as ArrayBuffer);
            const wb: WorkBook = read(data, { type: 'array' });
            console.timeEnd('file reader');
            dispatch(importWorkBook(wb));
          }
        };
      }
    },
    [dispatch]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
    onDropAccepted: handlerImportFile,
    maxFiles: 1,
  });

  return (
    <StyledPaper>
      {fileDetails ? (
        <Typography variant="body2" component="span">
          {fileDetails.name}
        </Typography>
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

export default FileImportPanel;
