'use client';

import React, { useEffect } from 'react';
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
import { Course } from './course-list';
import { useForm, Controller } from 'react-hook-form';
import { getApiBaseURL } from '@/lib/get-api-base-url';
import Box from '@mui/material/Box';

const status = [
  { value: "published", label: 'Published' },
  { value: 'draft', label: 'Draft' }
] as const;

interface AddEditCourseFormProps {
  course?: Course; 
  getAllBranches?: any;
  onAddCourse: (course: Course) => void;
  onEditCourse?: (course: Course) => void; // Optional callback for edit mode
  onCloseModel: () => void; 
}
export function AddEditCourseForm({ course, getAllBranches, onAddCourse, onEditCourse, onCloseModel }: AddEditCourseFormProps): React.JSX.Element {
  const { control, register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Course>();
  useEffect(() => {
    if (course) {
      setValue('course_name', course?.course_name);
      setValue('branch', course?.branch);
      setValue('status', course.status);
    }
  }, [course, setValue]);

  const onSubmit = async (data: Course) => {
    try {
      let response;
      if (course) {
        // Edit mode: call the edit API
        response = await fetch(`${getApiBaseURL()}items/courses/${course.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const updatedCourse = await response.json();
        updatedCourse.data.branch  = getAllBranches.find((branch:any) => branch.id === updatedCourse.data.branch);
        onEditCourse?.(updatedCourse.data);
      } else {
        // Add mode: call the add API
        response = await fetch(`${getApiBaseURL()}items/courses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const newCourse = await response.json();
        console
        newCourse.data.branch  = getAllBranches.find((branch:any) => branch.id === newCourse.data.branch);
        onAddCourse(newCourse.data); // Call the callback to update the parent component
        reset(); // Reset form after successful submission
      }
    } catch (error) {
      console.error('Failed to add/edit branch:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader subheader="The information can be edited" title={course ? "Edit Course" : "Add Course"} />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Course Name</InputLabel>
                <OutlinedInput label="Course Name"   {...register('course_name', { required: true })} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Select Branch</InputLabel>
                <Controller
                  name="branch"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      label="Select Branch"
                      {...field}
                    >
                      {getAllBranches.map((branch:any) => (
                        <MenuItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
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
          </Grid>
        </CardContent>
        <Divider />
        <CardActions style={{padding:'15px'}} sx={{ justifyContent: 'space-between', width: '100%' }}>
          <Box>
            <Button variant="contained" type="button" onClick={() => onCloseModel()}>Close</Button>
          </Box>
          <Box>
            <Button variant="contained" type="submit">{course ? "Save changes" : "Add Branch"}</Button>
          </Box>
        </CardActions>
      </Card>
    </form>
  );
}

