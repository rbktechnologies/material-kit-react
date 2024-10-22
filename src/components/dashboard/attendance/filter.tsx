import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useFormData } from '../admission/form-data-context';
import { useFormContext } from 'react-hook-form';

interface FilterFormProps {
    onFilter: (filters: any) => void;
}

const attendanceType = [
    { value: "Regular", label: 'Regular Batch' },
    { value: "Extra", label: 'Extra Batch' },
    { value: 'Exam', label: 'Exam' }
] as const;

const attendanceStatus = [
    { value: "1", label: 'Prasent' },
    { value: "0", label: 'Absent' }
] as const;

const FilterForm: React.FC<FilterFormProps> = ({ onFilter }) => {
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedAttendanceType, setSelectedAttendanceType] = useState('');
    const [selectedAttendanceStatus, setSelectedAttendanceStatus] = useState('');

    const { allBranches, allCourses, allBatches } = useFormData();
    const { register, handleSubmit, reset } = useFormContext();

    const handleBranchChange = (event: SelectChangeEvent<string>) => {
        setSelectedBranch(event.target.value);
    };

    const handleCourseChange = (event: SelectChangeEvent<string>) => {
        setSelectedCourse(event.target.value);
    };

    const handleBatchChange = (event: SelectChangeEvent<string>) => {
        setSelectedBatch(event.target.value);
    };

    const handleAttendanceTypeChange = (event: SelectChangeEvent<string>) => {
        setSelectedAttendanceType(event.target.value);
    };

    const handleAttendanceStatus = (event: SelectChangeEvent<string>) => {
        setSelectedAttendanceStatus(event.target.value);
    };

    const handleReset = () => {
        setSelectedBranch('');
        setSelectedCourse('');
        setSelectedBatch('');
        setSelectedAttendanceType('');
        setSelectedAttendanceStatus('');
        reset();
        onFilter({ branch: '', course: '', batch: '', attendance_type: '', start_date: '', end_date: '', prasent_absent_status: '' });
    };

    const onSubmit = (data: any) => {
        onFilter({ 
            branch: selectedBranch, 
            course: selectedCourse, 
            batch: selectedBatch, 
            attendance_type: selectedAttendanceType, 
            start_date: data.start_date, 
            end_date: data.end_date,
            prasent_absent_status: Number(selectedAttendanceStatus) 
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="step-admission">
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item md={4} xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Select Branch</InputLabel>
                                <Select
                                    {...register('branch')}
                                    value={selectedBranch}
                                    onChange={handleBranchChange}
                                    label="Branch"
                                    variant="outlined"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {allBranches.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Select Course</InputLabel>
                                <Select
                                    {...register('course')}
                                    value={selectedCourse}
                                    onChange={handleCourseChange}
                                    label="Course"
                                    variant="outlined"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {allCourses.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.course_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Select Batch</InputLabel>
                                <Select
                                    {...register('batch')}
                                    value={selectedBatch}
                                    onChange={handleBatchChange}
                                    label="Batch"
                                    variant="outlined"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {allBatches.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.batch_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12}>
                            <FormControl fullWidth>
                                <InputLabel shrink>
                                    Start Date
                                </InputLabel>
                                <TextField
                                    label="Start Date"
                                    type="date"
                                    {...register('start_date')}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12}>
                            <FormControl fullWidth>
                                <InputLabel shrink>
                                    End Date
                                </InputLabel>
                                <TextField
                                    label="End Date"
                                    type="date"
                                    {...register('end_date')}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Attendance Type</InputLabel>
                                <Select
                                    {...register('attendance_type')}
                                    value={selectedAttendanceType}
                                    onChange={handleAttendanceTypeChange}
                                    label="Attendance Type"
                                    variant="outlined"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {attendanceType.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    {...register('prasent_absent_status')}
                                    value={selectedAttendanceStatus}
                                    onChange={handleAttendanceStatus}
                                    label="Status"
                                    variant="outlined"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {attendanceStatus.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={12} xs={12}>
                            <Button type="submit" variant="contained" color="primary" style={{ marginRight: '20px' }}>
                                Apply
                            </Button>
                            <Button type="button" variant="contained" color="secondary" onClick={handleReset}>
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
