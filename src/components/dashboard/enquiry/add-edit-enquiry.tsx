'use client';

import React, { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { getApiBaseURL } from '@/lib/get-api-base-url';
import Box from '@mui/material/Box';
import { Enquiry } from './enquiry-list';
import { CircularProgress, FormControlLabel, FormHelperText, Radio, RadioGroup, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';

const status = [
  { value: "published", label: 'Published' },
  { value: 'draft', label: 'Draft' }
] as const;

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
];

interface AddEditenquiryFormProps {
  enquiry?: Enquiry | null;
  getAllBranches?: any;
  getAllCourses?: any;
}
export function AddEditEnquiryForm({ enquiry, getAllBranches, getAllCourses }: AddEditenquiryFormProps): React.JSX.Element {
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<Enquiry>();
  const [loading, setLoading] = useState(true); // State to track loading
  const [photoId, setPhotoId] = useState<string | null>(null);
  const [signatureId, setSignatureId] = useState<string | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const didMountRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (enquiry) {
      console.log("enquiry",enquiry)
      setLoading(true);
      reset(enquiry);
      setPhotoId(enquiry.upload_photo);
      setPhotoPreview(`${getApiBaseURL()}assets/${enquiry.upload_photo}`);
      setSignatureId(enquiry.upload_signature);
      setSignaturePreview(`${getApiBaseURL()}assets/${enquiry.upload_signature}`);
      setLoading(false);
    } else {
      reset({
        first_name: '',
        date: '',
        student_email: '',
        student_mobile: '',
        gender: '',
        father_mobile: '',
        tenth_school_name: '',
        tenth_without_sport_mark: '',
        college_name: '',
        branch: '',
        course: '',
        location: '',
        city: '',
        remark: '',
        next_follow_up_date: '',
        validity_date: '',
        referred_details: '',
        referred_mobile: '',
        enquiry_type: '',
        status: '',
      });
      setLoading(false);
    }
    return () => {
      didMountRef.current = false;
      reset(); // Clear form values on unmount
    };
  }, [enquiry, setValue]);


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
      } catch (error) {
        console.error('Signature upload failed:', error);
      }
    }
  };
  const onSubmit = async (data: Enquiry) => {
    try {
      let response;
      const formData = {
        ...data,
        upload_photo: photoId,
        upload_signature: signatureId
      };
      if (enquiry) {
        // Edit mode: call the edit API

        response = await fetch(`${getApiBaseURL()}items/student_enquiry/${enquiry.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const updatedEnquiry = await response.json();
        router.replace(paths.dashboard.enquiry);
      } else {
        // Add mode: call the add API
        response = await fetch(`${getApiBaseURL()}items/student_enquiry`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const newEnquiry = await response.json();
        reset();
        router.replace(paths.dashboard.enquiry);
      }
    } catch (error) {
      console.error('Failed to add/edit course:', error);
    }
  };
  if (loading) {
    return <CircularProgress />; // Show a loading spinner while data is being fetched
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader subheader="The information can be edited" title={enquiry ? "Edit Enquiry" : "Add Enquiry"} />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
                <InputLabel shrink>Student Name</InputLabel>
                <TextField
                  label="Student Name"
                  placeholder="Student Name"
                  {...register('first_name', { required: 'Student Name is required' })}
                  error={!!errors.first_name} // Applies error styling
                  helperText={errors.first_name?.message} // Displays error message
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="date" shrink>
                  Date
                </InputLabel>
                <TextField
                  id="date"
                  label="Date"
                  type="date"
                  {...register('date')}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel shrink>Email</InputLabel>
                <TextField
                  label="Email"
                  placeholder="Student Email"
                  {...register('student_email')}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
                <InputLabel shrink>Student Mobile</InputLabel>
                <TextField
                  label="Student Mobile"
                  placeholder="Student Mobile"
                  {...register('student_mobile', { required: 'Student Mobile is required' })}
                  error={!!errors.student_mobile} // Applies error styling
                  helperText={errors.student_mobile?.message} // Displays error message
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth required error={!!errors.gender}>
                <InputLabel shrink>Gender</InputLabel>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: 'Gender is required' }}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      aria-label="gender"
                      name="gender"
                      row // This ensures the radio buttons are displayed in a row
                    >
                      {genderOptions.map(option => (
                        <FormControlLabel
                          key={option.value}
                          value={option.value}
                          control={<Radio />}
                          label={option.label}
                          sx={{ marginRight: 2 }} // Optional: adds spacing between radio buttons
                        />
                      ))}
                    </RadioGroup>
                  )}
                />
                {errors.gender && (
                  <FormHelperText>{errors.gender.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel shrink>Parent Mobile</InputLabel>
                <TextField
                  label="Parent Mobile"
                  placeholder="Parent Mobile"
                  {...register('father_mobile')}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel shrink>School Name</InputLabel>
                <TextField
                  label="School Name"
                  placeholder="School Name"
                  {...register('tenth_school_name')}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel shrink>10th School Percentage</InputLabel>
                <TextField
                  label="10th School Percentage"
                  placeholder="10th School Percentage"
                  {...register('tenth_without_sport_mark')}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel shrink htmlFor="college_name">College Name</InputLabel>
                <TextField
                  id="college_name"
                  placeholder="College Namee"
                  label="College Name"
                  {...register('college_name')}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
                <Controller
                  name="branch"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Branch"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                    >
                      {getAllBranches?.map((branch: any) => (
                        <MenuItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
                <Controller
                  name="course"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Course"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                    >
                      {getAllCourses?.map((course: any) => (
                        <MenuItem key={course.id} value={course.id}>
                          {course.course_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel shrink>Location</InputLabel>
                <TextField
                  label="Location"
                  placeholder="Location"
                  {...register('location')}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth >
                <InputLabel shrink>City</InputLabel>
                <TextField
                  label="City"
                  placeholder="City"
                  {...register('city')}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel shrink>Remark</InputLabel>
                <TextField
                  label="Remark"
                  placeholder="Remark"
                  {...register('remark')}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel shrink htmlFor="date">
                  Next Follow-Up Date
                </InputLabel>
                <TextField
                  id="date"
                  placeholder="Next Follow-Up Date"
                  label="Next Follow-Up Date"
                  type="date"
                  {...register('next_follow_up_date')}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel shrink>Validity Date</InputLabel>
                <TextField

                  label="Validity Date"
                  placeholder="Validity Date"
                  type="date"
                  {...register('validity_date')}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel shrink>Referred Details</InputLabel>
                <TextField
                  label="Referred Details"
                  placeholder="Referred Details"
                  {...register('referred_details')}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel shrink>Referred Mobile</InputLabel>
                <TextField
                  label="Referred Mobile"
                  placeholder="Referred Mobile"
                  {...register('referred_mobile')}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel shrink>Enquiry Type</InputLabel>
                <TextField
                  label="Enquiry Type"
                  placeholder="Enquiry Type"
                  {...register('enquiry_type')}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Status"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                    >
                      {status?.map((option: any) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
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
            <Grid md={6} xs={12}>
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
        <Divider />
        <CardActions style={{ padding: '15px' }} sx={{ justifyContent: 'space-between', width: '100%' }}>
          {/* <Box>
            <Button variant="contained" type="button" onClick={onCloseModel}>Close</Button>
          </Box> */}
          <Box>
            <Button variant="contained" type="submit">{enquiry ? "Save changes" : "Add Enquiry"}</Button>
          </Box>
        </CardActions>
      </Card>
    </form>
  );
}

