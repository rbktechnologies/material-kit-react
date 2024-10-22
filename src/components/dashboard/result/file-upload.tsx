// src/components/CSVUploadForm.tsx

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Accept, useDropzone } from 'react-dropzone';
import { Button, Box, Typography, Card, CardHeader, Divider, CardContent, CardActions, Snackbar, Alert } from '@mui/material';
import { getApiBaseURL } from '@/lib/get-api-base-url';
import { useSnackbar } from '@/contexts/snackbar-context';

interface IFormInput {
  file: FileList;
}

interface CsvUploadFormProps {
  handleFile: () => void;
  onCloseModel: () => void;
}

export function CSVUploadForm({ handleFile, onCloseModel }: CsvUploadFormProps): React.JSX.Element {
  const { handleSubmit, control, setValue } = useForm<IFormInput>();
  const { setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen } = useSnackbar();

  const onSubmit = async (data: IFormInput) => {
    if (data.file.length > 0) {
      const file = data.file[0];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(`${getApiBaseURL()}utils/import/result`, {
          method: 'POST',
          body: formData,
        }); 
        console.log("response",response);
        if (response.ok) {
          handleFile();
        } else {
          setSnackbarMessage('File upload failed');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setSnackbarMessage('Error uploading file');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } else {
      console.error('No file selected');
    }
  };
  
  const accept: Accept = {
    'text/csv': ['.csv']
  };
  
  const { getRootProps, getInputProps, acceptedFiles, isDragActive } = useDropzone({
    accept,
    onDrop: (acceptedFiles) => {
      const fileList = new DataTransfer();
      acceptedFiles.forEach((file) => {
        fileList.items.add(file);
      });
      setValue('file', fileList.files);
    },
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));

  return (
    <Card component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <CardHeader subheader="Currently we are supporting CSV file only" title="Upload CSV File" />
      <Divider />
      <CardContent>
        <Controller
          name="file"
          control={control}
          render={({ field }) => (
            <div {...getRootProps({ className: 'dropzone' })} style={dropzoneStyle}>
              <input {...getInputProps()} />
              {
                isDragActive ?
                  <Typography>Drop the files here...</Typography> :
                  <Typography>Drag 'n' drop a CSV file here, or click to select one</Typography>
              }
            </div>
          )}
        />
        <aside>
          {/* <Typography variant="subtitle1">Files</Typography> */}
          <ul>{files}</ul>
        </aside>
      </CardContent>
      <Divider />
      <CardActions style={{ padding: '15px' }} sx={{ justifyContent: 'space-between', width: '100%' }}>
        <Box>
          <Button variant="contained" type="button" onClick={() => onCloseModel()}>Close</Button>
        </Box>
        <Box>
          <Button variant="contained" type="submit">Upload</Button>
        </Box>
      </CardActions>
    </Card>
  );
};

const dropzoneStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '200px',
  borderWidth: '2px',
  borderRadius: '2px',
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

export default CSVUploadForm;
