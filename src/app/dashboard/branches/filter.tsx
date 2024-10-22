import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface FilterFormProps {
    onFilter: (filters: any) => void;
}

const FilterForm: React.FC<FilterFormProps> = ({ onFilter }) => {
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');

    const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setter(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onFilter({ name, status });
    };

    const handleReset = () => {
        setName('');
        setStatus('');
        onFilter({ name: '', status: '' });
      };

    return (
        <form onSubmit={handleSubmit}>
            <Card className="step-admission">
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item md={4} xs={12}>
                            <FormControl fullWidth required>
                                <TextField
                                    label="Name"
                                    value={name}
                                    onChange={handleFilterChange(setName)}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Status"
                                    value={status}
                                    onChange={handleFilterChange(setStatus)}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="branch-label">Branch</InputLabel>
                            <Select
                            labelId="branch-label"
 
                            >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                           
                            </Select>
                        </FormControl>
                        </Grid>
                        <Grid item md={12} xs={12}>
                            <Button type="submit" variant="contained" color="primary" style={{ marginRight: '20px' }}
>
                                Apply
                            </Button>
                            <Button type="submit" variant="contained" color="secondary" onClick={handleReset}>
                                Reset
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </form>
    );
};

export default FilterForm;
