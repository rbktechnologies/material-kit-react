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
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
import { Batch } from './batches-list';
import { useForm, Controller } from 'react-hook-form';
import { getApiBaseURL } from '@/lib/get-api-base-url';
import Box from '@mui/material/Box';
import { CircularProgress, TextField, Typography } from '@mui/material';

const status = [
  { value: "published", label: 'Published' },
  { value: 'draft', label: 'Draft' }
] as const;

interface AddEditBatchFormProps {
  batch?: Batch;
  getAllBranches?: any;
  getAllCourses?: any;
  getAllAcadamicYear?: any;
  onAddBatch: (batch: Batch) => void;
  onEditBatch?: (batch: Batch) => void; // Optional callback for edit mode
  onCloseModel: () => void;
}
export function AddEditBatchForm({ batch, getAllBranches, getAllCourses, getAllAcadamicYear, onAddBatch, onEditBatch, onCloseModel }: AddEditBatchFormProps): React.JSX.Element {
  const { control, register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Batch>();
  const [loading, setLoading] = useState(true); // State to track loading
  const didMountRef = useRef(false);
  useEffect(() => {
    if (batch) {
      console.log("batch",batch);
      setLoading(true);
      reset(batch);
      setLoading(false);
    } 
    // else {
    //   reset({
    //     batch_name: '',
    //     branch: '',
    //     course: '',
    //     academic_year: '',
    //     male_intake: null,
    //     female_intake: null,
    //     start_date: '',
    //     end_date: '',
    //     status: '',
    //     male_roll_no_start_with: '',
    //     male_roll_no_end_with: '',
    //     female_roll_no_start_with: '',
    //     female_roll_no_end_with: '',
    //   });
    // }
    return () => {
      didMountRef.current = false;
      reset(); // Clear form values on unmount
    };
  }, [batch, setValue]);

  const onSubmit = async (data: Batch) => {
    try {
      let response;
      if (batch) {
        // Edit mode: call the edit API
        response = await fetch(`${getApiBaseURL()}items/batches/${batch.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const updatedBatch = await response.json();
        updatedBatch.data.branch = getAllBranches.find((branch: any) => branch.id === updatedBatch.data.branch);
        updatedBatch.data.course = getAllCourses.find((course: any) => course.id === updatedBatch.data.course);
        onEditBatch?.(updatedBatch.data);
      } else {
        // Add mode: call the add API
        response = await fetch(`${getApiBaseURL()}items/batches`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const newBatch = await response.json();
        newBatch.data.branch = getAllBranches.find((branch: any) => branch.id === newBatch.data.branch);
        newBatch.data.course = getAllCourses.find((course: any) => course.id === newBatch.data.course);
        onAddBatch(newBatch.data); // Call the callback to update the parent component
        reset(); // Reset form after successful submission
      }
    } catch (error) {
      console.error('Failed to add/edit branch:', error);
    }
  };
  if (loading) {
    return <CircularProgress />; // Show a loading spinner while data is being fetched
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader subheader="The information can be edited" title={batch ? "Edit Batch" : "Add Batch"} />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Batch Name</InputLabel>
                <OutlinedInput label="Batch Name"   {...register('batch_name', { required: true })} />
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
              <FormControl fullWidth required>
                <Controller
                  name="academic_year"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                    {...field}
                      select
                      label="Acadamic year"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                    >
                      {getAllAcadamicYear.map((ay: any) => (
                        <MenuItem key={ay.id} value={ay.id}>
                          {ay.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Male Intake</InputLabel>
                <OutlinedInput label="Male Intake"   {...register('male_intake', { required: true })} />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Famale Intake</InputLabel>
                <OutlinedInput label="Female Intake"   {...register('female_intake', { required: true })} />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
                <InputLabel shrink>Start Date</InputLabel>
                <Controller
                  name="start_date"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      label="Start Date"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
                <InputLabel shrink>End Date</InputLabel>
                <Controller
                  name="end_date"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      label="End Date"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select  {...register('status', { required: true })} label="Status" variant="outlined">
                  {status.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid container spacing={3}>
              <Grid container spacing={2} md={6} xs={12}>
                <Grid xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Male Roll No:
                  </Typography>
                </Grid>
                <Grid md={6} xs={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Start with</InputLabel>
                    <OutlinedInput label="Start With" {...register('male_roll_no_start_with', { required: true })} />
                  </FormControl>
                </Grid>
                <Grid md={6} xs={6}>
                  <FormControl fullWidth required>
                    <InputLabel>End with</InputLabel>
                    <OutlinedInput label="End With" {...register('male_roll_no_end_with', { required: true })} />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2} md={6} xs={12}>
                <Grid xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Female Roll No:
                  </Typography>
                </Grid>
                <Grid md={6} xs={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Start with</InputLabel>
                    <OutlinedInput label="Start With" {...register('female_roll_no_start_with', { required: true })} />
                  </FormControl>
                </Grid>
                <Grid md={6} xs={6}>
                  <FormControl fullWidth required>
                    <InputLabel>End with</InputLabel>
                    <OutlinedInput label="End With" {...register('female_roll_no_end_with', { required: true })} />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions style={{ padding: '15px' }} sx={{ justifyContent: 'space-between', width: '100%' }}>
          <Box>
            <Button variant="contained" type="button" onClick={() => onCloseModel()}>Close</Button>
          </Box>
          <Box>
            <Button variant="contained" type="submit">{batch ? "Save changes" : "Add Batch"}</Button>
          </Box>
        </CardActions>
      </Card>
    </form>
  );
}

