'use client';

import React, { useEffect, useState } from 'react';
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
import { Branch } from './branches-details';
import { useForm, Controller } from 'react-hook-form';
import { getApiBaseURL } from '@/lib/get-api-base-url';
import Box from '@mui/material/Box';

const status = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' }
] as const;

interface AddEditBranchFormProps {
  branch?: Branch; // Optional branch prop for edit mode
  onAddBranch: (branch: Branch) => void;
  onEditBranch?: (branch: Branch) => void; // Optional callback for edit mode
  onCloseModel:  () => void; 
}
export function AddEditBranchForm({ branch, onAddBranch, onEditBranch, onCloseModel }: AddEditBranchFormProps): React.JSX.Element {
  const { register, handleSubmit, reset, setValue } = useForm<Branch>();

  useEffect(() => {
    if (branch) {
      setValue('name', branch.name);
      setValue('address1', branch.address1);
      setValue('address2', branch.address2);
      setValue('contact_number', branch.contact_number);
      setValue('status', branch.status);
    }
  }, [branch, setValue]);
  
  const onSubmit = async (data: Branch) => {
    try {
      let response;
      if (branch) {
        // Edit mode: call the edit API
        response = await fetch(`${getApiBaseURL()}items/branchs/${branch.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const updatedBranch = await response.json();
        onEditBranch?.(updatedBranch.data);
      } else {
        // Add mode: call the add API
        response = await fetch(`${getApiBaseURL()}items/branchs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const newBranch = await response.json();
        onAddBranch(newBranch.data); // Call the callback to update the parent component
        reset(); // Reset form after successful submission
      }
    } catch (error) {
      console.error('Failed to add/edit branch:', error);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader subheader="The information can be edited" title={branch ? "Edit Branch" : "Add Branch"} />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Branch Name</InputLabel>
                <OutlinedInput label="Branch Name"   {...register('name', { required: true })}/>
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Address 1</InputLabel>
                <OutlinedInput label="Address 1" {...register('address1', { required: true })} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Address 2</InputLabel>
                <OutlinedInput label="Address 2"  {...register('address2', { required: true })} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Contact number</InputLabel>
                <OutlinedInput label="Contact number" type="tel"  {...register('contact_number', { required: true })}/>
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
        <CardActions style={{padding:'10px'}} sx={{ justifyContent: 'space-between', width: '100%' }}>
          <Box>
            <Button variant="contained" type="button" onClick={() => onCloseModel()}>Close</Button>
          </Box>
          <Box>
            <Button variant="contained" type="submit">{branch ? "Save changes" : "Add Branch"}</Button>
          </Box>
        </CardActions>

      </Card>
    </form>
  );
}

