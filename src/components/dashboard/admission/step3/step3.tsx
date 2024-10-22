import React, { useEffect, useRef, useState } from 'react';
import { TextField, Grid, FormControl, InputLabel, Box, CardContent, Card } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { getApiBaseURL } from '@/lib/get-api-base-url';

const Step3: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();
  const [loading, setLoading] = useState(true); // State to track loading
  const [photoId, setPhotoId] = useState<string | null>(null);
  const [signatureId, setSignatureId] = useState<string | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { getValues, setValue } = useFormContext();
  const didMountRef = useRef(false);
  useEffect(() => {
    const values = getValues();
    console.log("values",values)
    if (values) {
      setPhotoId(values.upload_photo);
      setPhotoPreview(`${getApiBaseURL()}assets/${values.upload_photo}`);
      setSignatureId(values.upload_signature);
      setSignaturePreview(`${getApiBaseURL()}assets/${values.upload_signature}`);
      setLoading(false);
    } 
    return () => {
      didMountRef.current = false;
    };
  }, [setValue]);
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${getApiBaseURL()}files`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    const result = await response.json();
    return result.data.id;
  };
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPhotoPreview(fileUrl);
      try {
        const fileId = await uploadFile(file);
        setPhotoId(fileId);
        setValue('upload_photo', fileId);
      } catch (error) {
        console.error('Photo upload failed:', error);
      }
    }
  };
  const handleSignatureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setSignaturePreview(fileUrl);
      try {
        const fileId = await uploadFile(file);
        setSignatureId(fileId);
        setValue('upload_signature', fileId);
      } catch (error) {
        console.error('Signature upload failed:', error);
      }
    }
  };
  return (
    <Card className="step-admission">
      <CardContent>
        <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink htmlFor="upload-photo">Upload Photo</InputLabel>
              <TextField
                id="upload-photo"
                type="file"
                label="Upload Photo"
                inputProps={{
                  accept: 'image/*'
                }}
                onChange={handlePhotoUpload}
                InputLabelProps={{ shrink: true }}
              />
              {photoPreview && (
                <Box
                  sx={{
                    marginTop: 2,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <img
                    src={photoPreview}
                    alt="Photo Preview"
                    style={{
                      maxWidth: '80px', // Set the maximum width of the preview image
                      maxHeight: '100px', // Set the maximum height of the preview image
                      objectFit: 'contain'
                    }}
                  />
                </Box>
              )}
            </FormControl>
          </Grid>
          <Grid item md={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel htmlFor="upload-signature" shrink>Upload Signature</InputLabel>
              <TextField
                id="upload-signature"
                label="Upload Signature"
                type="file"
                inputProps={{
                  accept: 'image/*'
                }}
                onChange={handleSignatureUpload}
                InputLabelProps={{ shrink: true }}
              />
              {signaturePreview && (
                <Box
                  sx={{
                    marginTop: 2,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <img
                    src={signaturePreview}
                    alt="Signature Preview"
                    style={{
                      maxWidth: '80px', // Set the maximum width of the preview image
                      maxHeight: '100px', // Set the maximum height of the preview image
                      objectFit: 'contain'
                    }}
                  />
                </Box>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Step3;
