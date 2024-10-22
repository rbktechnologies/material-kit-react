"use client";

import React, { useEffect, useRef, useState } from 'react';
import Stack from '@mui/material/Stack';
import { CircularProgress, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Enquiry } from '@/components/dashboard/enquiry/enquiry-list';
import AdmissionForm from '@/components/dashboard/admission/admission-form';
import { FormProvider, useForm } from 'react-hook-form';
import { StudentAdmission } from '@/components/dashboard/admission/admission-list';
import fetchWithAuth from '@/lib/auth/api';

const Page: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editEnquiry, setEditEnquiry] = useState<Enquiry | null>(null);
  const didMountRef = useRef(false);
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [admissionDetails, setAdmissionDetails] = useState<StudentAdmission | null>(null);
  const methods = useForm();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const idParam = searchParams.get('id');
    setId(idParam);

    if (idParam) {
      fetchDetails(idParam as string);
    }
  }, []); // Empty dependency array ensures this runs only once

  const fetchDetails = async (admissionId: string) => {
    try {
      const response = await fetchWithAuth(`items/student_admission/${admissionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch enquiry');
      }
      const res = await response.json();
      setAdmissionDetails(res.data);
    } catch (err) {
      console.error("Error occurred:", err);
      setError('An error occurred while fetching the enquiry.');
    }
  };

  if (loading) {
    return <CircularProgress />; // Show a loading spinner while data is being fetched
  }

  if (error) {
    return <Typography color="error">{error}</Typography>; // Show error message if there's an error
  }

  return (
    <Stack spacing={3}>
      <FormProvider {...methods}>
        <AdmissionForm initialData={admissionDetails} />
      </FormProvider>

    </Stack>
  );
}

export default Page;
