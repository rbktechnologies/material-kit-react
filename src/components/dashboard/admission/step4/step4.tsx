import React, { useEffect, useState } from 'react';
import { TextField, Grid, FormControl, InputLabel, Box, CardContent, Card, MenuItem, TextareaAutosize, FormHelperText } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { useFormData } from '../form-data-context';
import { getApiBaseURL } from '@/lib/get-api-base-url';
const feesStatus = [
  { value: "full_paid", label: 'Full Paid' },
  { value: 'installment', label: 'Installment' },
  { value: 'unpaid', label: 'Unpaid' },
] as const;
const installmentTypes = [
  { value: "two", label: 'Two' },
  { value: 'three', label: 'Three' },
  { value: 'four', label: 'Four' },
] as const;
const status = [
  { value: "published", label: 'Published' },
  { value: 'draft', label: 'Draft' }
] as const;
const Step4: React.FC = () => {
  const { register, setValue, watch, control, formState: { errors } } = useFormContext();
  const { allBranches, allCourses, allBatches, allAcadamicYear } = useFormData();
  const remarkVal = watch('remark');
  const { getValues } = useFormContext();
  const handleBatchChange = async (event: any) => {
    const gender = getValues('gender'); // Replace 'step1FieldName' with the actual name of the field from Step 1
    const selectedBatchId = event.target.value;
    const selectedBatch = allBatches.find(batch => batch.id === selectedBatchId);
    let rollNo:any;
    try {
      const response = await fetch(`${getApiBaseURL()}items/student_admission?filter[batch][_eq]=${selectedBatchId}&sort=-date_created,-id&limit=1&fields=roll_no&filter[gender][_eq]=${gender}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const res = await response.json();
      if(res.data.length > 0){
        rollNo = Number(res.data[0].roll_no) + 1;
      } else {
        rollNo = gender === 'male' 
        ? Number(selectedBatch?.male_roll_no_start_with) 
        : Number(selectedBatch?.female_roll_no_start_with);
      }
      setValue('roll_no', rollNo);
      setValue('username', `PPC_${rollNo}`);
      setValue('barcode_id', rollNo);
    } catch {
      alert("Failed to Fetch Res");
    } finally {
      console.log("final")
    }
  };
  return (
    <Card className="step-admission">
      <CardContent>
        <Grid container spacing={3}>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth disabled>
              <InputLabel shrink>Enquiry ID</InputLabel>
              <TextField
                label="Enquiry ID"
                placeholder="Enquiry ID"
                {...register('enquiry_id')}
                disabled={true}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>
                Admission Date
              </InputLabel>
              <TextField
                label="Admission Date"
                type="date"
                {...register('admission_date')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth required>
              <Controller
                name="academic_year"
                control={control}
                defaultValue=''
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Academic Year*"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!errors.academic_year}
                    {...register('academic_year', { required: 'Academic is required' })}
                  >
                    {allAcadamicYear?.map((ay: any) => (
                      <MenuItem key={ay.id} value={ay.id}>
                        {ay.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth required error={!!errors.batch}>
              <Controller
                name="branch"
                control={control}
                defaultValue=''
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Branch"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!errors.branch}
                    {...register('branch', { required: 'Branch is required' })}
                  >
                    {allBranches?.map((branch: any) => (
                      <MenuItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth required error={!!errors.batch}>
              <Controller
                name="course"
                defaultValue=''
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
                    error={!!errors.batch}
                    {...register('course', { required: 'Course is required' })}
                  >
                    {allCourses?.map((course: any) => (
                      <MenuItem key={course.id} value={course.id}>
                        {course.course_name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth required error={!!errors.batch}>
              <Controller
                name="batch"
                control={control}
                defaultValue=''
                rules={{ required: 'Batch is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Batch"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!errors.batch}
                    {...register('batch', { required: 'Batch is required' })}
                    onChange={(event) => {
                      field.onChange(event); // Update react-hook-form state
                      handleBatchChange(event); // Call your custom change handler
                    }}
                  >
                    {allBatches?.map((batch: any) => (
                      <MenuItem key={batch.id} value={batch.id}>
                        {batch.batch_name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth disabled>
              <InputLabel shrink>Roll No</InputLabel>
              <TextField
                label="Roll No"
                placeholder="Roll No"
                {...register('roll_no')}
                disabled={true}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth>
              <Controller
                name="fees_status"
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Fees Status"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  >
                    {feesStatus?.map((option: any) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth>
              <Controller
                name="installment_type"
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Installment Type"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  >
                    {installmentTypes?.map((option: any) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>
                Installment Date
              </InputLabel>
              <TextField
                label="Installment Date"
                type="date"
                {...register('installment_date')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth disabled>
              <InputLabel shrink>Student Fee</InputLabel>
              <TextField
                label="Student Fee"
                placeholder="Student Fee"
                {...register('student_fee')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth disabled>
              <InputLabel shrink>First Payment</InputLabel>
              <TextField
                label="First Payment"
                placeholder="First Payment"
                {...register('first_payment')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>
                Valid Till
              </InputLabel>
              <TextField
                label="Valid Till"
                type="date"
                {...register('valid_till')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth disabled>
              <InputLabel shrink>Username</InputLabel>
              <TextField
                label="Username"
                placeholder="Username"
                disabled={true}
                {...register('username')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth disabled>
              <InputLabel shrink>Barcode Id</InputLabel>
              <TextField
                label="Barcode Id"
                placeholder="Barcode Id"
                disabled={true}
                {...register('barcode_id')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
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
                    fullWidth
                    margin="normal"
                    error={!!errors.status}
                    {...register('status', { required: 'Status is required' })}
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
          <Grid item md={8} xs={12}>
            <FormControl fullWidth>
              <InputLabel
                shrink={!!remarkVal}
                className={`textarea-outlined-label ${!!remarkVal ? 'shrink' : ''}`}
              >
                Remark
              </InputLabel>
              <TextareaAutosize
                minRows={4}
                className="textarea-outlined"
                {...register('remark')}
              />
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Step4;
