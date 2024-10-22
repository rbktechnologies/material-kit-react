import React, { useState } from 'react';
import { TextField, Grid, FormControl, InputLabel, Box, CardContent, Card, MenuItem, Select, OutlinedInput, ListItemText, Checkbox } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
const student_class = [
  { value: "11", label: '11th' },
  { value: '12', label: '12th' },
  { value: 'repeater', label: 'Repeater' }
] as const;

const categories = [
  { value: "open", label: 'Open' },
  { value: 'obc', label: 'OBC' },
  { value: 'sc', label: 'SC' },
  { value: 'vj', label: 'VJ' },
  { value: 'nt', label: 'NT' },
  { value: 'sbc', label: 'SBC' },
  { value: 'st', label: 'ST' }
] as const;

const groups = [
  { value: "board", label: 'Board' },
  { value: 'jee', label: 'JEE' },
  { value: 'neet', label: 'NEET' },
  { value: 'mhcetbio', label: 'MHT-CET(Bio)' },
  { value: 'mhcetmath', label: 'MHT-CET(Math)' },
] as const;

const Step2: React.FC = () => {
  const { register, control, formState: { errors } } = useFormContext();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { setValue } = useFormContext();
  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setValue('group', value);
    setSelectedItems(typeof value === 'string' ? value.split(',') : value);

  };

  return (
    <Card className="step-admission">
      <CardContent>
        <Grid container spacing={3}>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>College Name</InputLabel>
              <TextField
                label="College Name"
                placeholder="College Name"
                {...register('college_name')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth>
              <Controller
                name="class"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Class"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  >
                    {student_class?.map((option: any) => (
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
                name="category"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Category"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  >
                    {categories?.map((option: any) => (
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
            <FormControl sx={{ width: 300 }}>
              <InputLabel id="multi-checkbox-label">Select Group</InputLabel>
              <Controller
                name="group"
                control={control}
                render={({ field }) => (
                  <Select
                    labelId="multi-checkbox-label"
                    id="multi-checkbox"
                    multiple
                    value={field.value || []}
                    onChange={field.onChange}
                    input={<OutlinedInput label="Select Group" />}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {groups.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Checkbox checked={field.value?.indexOf(option.value) > -1} />
                        <ListItemText primary={option.label} />
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>10th School Name</InputLabel>
              <TextField
                label="10th School Name"
                placeholder="10th School Name"
                {...register('tenth_school_name')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>10th % (without sport mark)</InputLabel>
              <TextField
                label="10th % (without sport mark)e"
                placeholder="10th % (without sport mark)"
                {...register('tenth_without_sport_mark')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid item md={2} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>Math</InputLabel>
              <TextField
                label="Math"
                placeholder="Math"
                {...register('math')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid item md={2} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>Science</InputLabel>
              <TextField
                label="Science"
                placeholder="Science"
                {...register('science')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid item md={2} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>English</InputLabel>
              <TextField
                label="English"
                placeholder="English"
                {...register('english')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>NEET / MHT-CET Total</InputLabel>
              <TextField
                label="NEET / MHT-CET Total"
                placeholder="NEET / MHT-CET Total"
                {...register('neet_mhtce_total')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>12th %</InputLabel>
              <TextField
                label="12th %"
                placeholder="12th %"
                {...register('twelfth_percentage')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>NEET All India Rank</InputLabel>
              <TextField
                label="NEET All India Rank"
                placeholder="NEET All India Rank"
                {...register('neet_all_india_rank')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>NEET Category Rank</InputLabel>
              <TextField
                label="NEET Category Rank"
                placeholder="NEET Category Rankk"
                {...register('neet_cat_rank')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>Physics</InputLabel>
              <TextField
                label="Physics"
                placeholder="Physics"
                {...register('physics')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>Chemistry</InputLabel>
              <TextField
                label="Chemistry"
                placeholder="Chemistry"
                {...register('chemistry')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>Biology</InputLabel>
              <TextField
                label="Biology"
                placeholder="Biology"
                {...register('biology')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>Math</InputLabel>
              <TextField
                label="Math"
                placeholder="Math"
                {...register('math_neet')}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Step2;
