'use client';

import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Unstable_Grid2';
import { Controller, useForm, useFormContext, useWatch } from 'react-hook-form';
import { Checkbox, FormControlLabel, FormHelperText, MenuItem, Radio, RadioGroup, TextField, TextareaAutosize } from '@mui/material';
import { useFormData } from '../form-data-context';

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

const Step1: React.FC = () => {
  const { register, watch, setValue, control, formState: { errors } } = useFormContext();
  const residentialAddress = useWatch({ name: 'residential_address', control });
  const [isSameAddress, setIsSameAddress] = useState(false);
  useEffect(() => {
    if (isSameAddress) {
      setValue('permanent_address', residentialAddress);
    }
  }, [isSameAddress, residentialAddress, setValue]);
  const permanantAddress = watch('permanent_address');
  return (
    <Card className="step-admission">
      <CardContent>
        <Grid container spacing={3}>
          <Grid md={4} xs={12}>
            <FormControl fullWidth required>
              <InputLabel shrink>Student First Name</InputLabel>
              <TextField
                label="Student First Name"
                placeholder="Student First Name"
                defaultValue=''
                {...register('first_name', { required: 'Student First Name is required' })}
                error={!!errors.first_name}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid md={4} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>Student Middle Name</InputLabel>
              <TextField
                label="Student Middle Name"
                placeholder="Student Middle Name"
                {...register('middl_name')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid md={4} xs={12} >
            <FormControl fullWidth required>
              <InputLabel shrink>Student Last Name</InputLabel>
              <TextField
                label="Student Last Name"
                placeholder="Student Last Name"
                {...register('last_name', { required: 'Student Last Name is required' })}
                error={!!errors.last_name}
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
                    value={field.value || ''}
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
            </FormControl>
          </Grid>
          <Grid md={4} xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="date" shrink>
                Date Of Birth
              </InputLabel>
              <TextField
                id="date"
                label="Date Of Birth"
                type="date"
                {...register('dob')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid md={4} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>Student Email</InputLabel>
              <Controller
                name="student_email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Student Email"
                    placeholder="Student Email"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid md={4} xs={12}>
            <FormControl fullWidth required error={!!errors.student_mobile}>
              <InputLabel shrink>Mobile Number</InputLabel>
              <Controller
                name="student_mobile"
                control={control}
                rules={{
                  required: 'Mobile number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Invalid mobile number'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Mobile Number"
                    placeholder="Mobile Number"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
              <FormHelperText>
                {(errors.student_mobile?.message as string) || ''}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid md={4} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>State</InputLabel>
              <TextField
                label="State"
                placeholder="State"
                {...register('state')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid md={4} xs={12}>
            <FormControl fullWidth>
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
              <InputLabel shrink>Father First Name</InputLabel>
              <TextField
                label="Father First Name"
                placeholder="Father First Name"
                {...register('father_first_name')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid md={4} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>Father Middle Name</InputLabel>
              <TextField
                label="Father Middle Name"
                placeholder="Father Middle Name"
                {...register('father_middle_Name')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid md={4} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>Father Last Name</InputLabel>
              <TextField
                label="Father Last Name"
                placeholder="Father Last Name"
                {...register('mother_last_name')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid md={4} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>Mother First Name</InputLabel>
              <TextField
                label="Mother First Name"
                placeholder="Mother First Name"
                {...register('mother_first_name')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid md={4} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>Mother Middle Name</InputLabel>
              <TextField
                label="Mother Middle Name"
                placeholder="Mother Middle Name"
                {...register('mother_middle_Name')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid md={4} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>Mother Last Name</InputLabel>
              <TextField
                label="Mother Last Name"
                placeholder="Mother Last Name"
                {...register('mother_last_name')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid md={4} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>Guardian First Name</InputLabel>
              <TextField
                label="Guardian First Name"
                placeholder="Guardian First Name"
                {...register('guardian_first_name')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid md={4} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>Guardian Middle Name</InputLabel>
              <TextField
                label="Guardian Middle Name"
                placeholder="Guardian Middle Name"
                {...register('guardian_middle_Name')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid md={4} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>Guardian Last Name</InputLabel>
              <TextField
                label="Guardian Last Name"
                placeholder="Guardian Last Name"
                {...register('guardian_last_name')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid md={4} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>Father Mobile</InputLabel>
              <TextField
                label="Father Mobile"
                placeholder="Father Mobile"
                {...register('father_mobile')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid md={4} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>Mother Mobile</InputLabel>
              <TextField
                label="Mother Mobile"
                placeholder="Mother Mobile"
                {...register('mother_mobile')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid md={4} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>Guardian Mobile</InputLabel>
              <TextField
                label="Guardian Mobile"
                placeholder="Guardian Mobile"
                {...register('guardian_mobile')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid md={4} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>Father Email</InputLabel>
              <TextField
                label="Father Email"
                placeholder="Father Email"
                {...register('father_email')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid md={4} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>Mother Email</InputLabel>
              <TextField
                label="Mother Email"
                placeholder="Mother Email"
                {...register('mother_email')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid md={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel
                shrink={!!residentialAddress}
                className={`textarea-outlined-label ${!!residentialAddress ? 'shrink' : ''}`}
              >
                Residential Address
              </InputLabel>
              <TextareaAutosize
                minRows={6}
                className="textarea-outlined"
                {...register('residential_address')}
              />
            </FormControl>
          </Grid>
          <Grid md={6} xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isSameAddress}
                  onChange={(e) => setIsSameAddress(e.target.checked)}
                />
              }
              label="Same as Residential Address"
            />
            <FormControl fullWidth>
              <InputLabel shrink={!!useWatch({ name: 'permanent_address', control })} className={`textarea-outlined-label ${!!useWatch({ name: 'permanent_address', control }) ? 'shrink' : ''}`}>
                Permanent Address
              </InputLabel>
              <TextareaAutosize
                minRows={3}
                className="textarea-outlined"
                {...register('permanent_address')}
              />
            </FormControl>
          </Grid>
          <Grid md={4} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink htmlFor="telephone_no">Telephone No</InputLabel>
              <TextField
                id="telephone_no"
                label="Telephone No"
                placeholder="Telephone No"
                {...register('telephone_no')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid md={4} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink htmlFor="aadhar_card_No">Aadhar Card No</InputLabel>
              <TextField
                id="aadhar_card_No"
                label="Aadhar Card No"
                placeholder="Aadhar Card No"
                {...register('aadhar_card_No')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Step1;
