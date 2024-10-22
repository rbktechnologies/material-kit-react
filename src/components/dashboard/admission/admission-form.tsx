import React, { useEffect, useRef, useState } from 'react';
import { Stepper, Step, StepLabel, Button, Box, Snackbar, Alert } from '@mui/material';
import './admission.css';
import Step1 from './step1/step1';
import Step2 from './step2/step2';
import Step3 from './step3/step3';
import Step4 from './step4/step4';
import { useFormContext } from 'react-hook-form';
import FormDataProvider from './form-data-context';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import { getApiBaseURL } from '@/lib/get-api-base-url';

const steps = ['Personal Information', 'Educational Details', 'Photo/Signature/Document', 'Office Use'];

const AdmissionForm: React.FC<{ initialData?: any }> = ({ initialData = {} }) => {
  const [activeStep, setActiveStep] = useState(0);
  const { handleSubmit, reset, trigger, formState: { isSubmitting } } = useFormContext();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('error');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false); // New state to manage button disable
  const didMountRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      reset(initialData); // Reset form with initial data
    }
  }, [initialData, reset]);

  const handleNext = async () => {
    const isStepValid = await trigger();
    if (isStepValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setSnackbarMessage('Please fill in all required fields.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleStep = (step: number) => async () => {
    const isStepValid = await trigger();
    if (isStepValid) {
      setActiveStep(step);
    } else {
      setSnackbarMessage('Please fill in all required fields.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const getStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return <Step1 />;
      case 1:
        return <Step2 />;
      case 2:
        return <Step3 />;
      case 3:
        return <Step4 />;
      default:
        return 'Unknown stepIndex';
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const onSubmitForm = async (data: any) => {
    data.dob = data.date_field || null;
    data.admission_date = data.admission_date || null;
    data.installment_date = data.installment_date || null;
    data.valid_till = data.valid_till || null;
    setIsSubmitDisabled(true);
    try {
      // API URL for adding or updating the student admission
      let response;
      if (initialData && initialData.id) {
        response = await fetch(`${getApiBaseURL()}items/student_admission/${initialData.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
      } else {
        response = await fetch(`${getApiBaseURL()}items/student_admission`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const admissionResult = await response.json();

        const userData = {
          role: "08d563b0-5d0a-4eaa-be38-3af3e79a47b4",
          email: data.student_email,
          first_name: data.first_name, 
          last_name: data.last_name, 
          mobile: data.student_mobile, 
          username: data.username, 
          theme: "auto",
          password: data.username+'@2024', 
          admission_id: admissionResult.data.id
        };
  
        const userResponse = await fetch(`${getApiBaseURL()}users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
        if (!userResponse.ok) {
          throw new Error('Network response for user API was not ok');
        }
        setSnackbarMessage('Admission Success');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }
      router.replace(paths.dashboard.admission);
    } catch (error) {
      console.error('Failed to add/edit course or add user:', error);
      setSnackbarMessage('An error occurred. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setIsSubmitDisabled(false); 
    }
  };
  

  const handleSubmitFinal = async () => {
    const isStepValid = await trigger();
    console.log("isStepValid",isStepValid)
    if (isStepValid) {
      handleSubmit(onSubmitForm)(); // Manually call the form submission
    } else {
      setSnackbarMessage('Please fill in all required fields.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <FormDataProvider>
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label} onClick={handleStep(index)}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div>
          {activeStep === steps.length ? (
            <div>
              <p>All steps completed - you're finished</p>
              <Button onClick={handleReset}>Reset</Button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (activeStep === steps.length - 1) handleSubmitFinal(); }}>
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSubmitFinal()}
                    disabled={isSubmitting || isSubmitDisabled}
                  >
                    Submit
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </form>
          )}
        </div>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%', bgcolor: snackbarSeverity === 'success' ? '#95f0df' : '#f5bbb6' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </FormDataProvider>
  );
};

export default AdmissionForm;
