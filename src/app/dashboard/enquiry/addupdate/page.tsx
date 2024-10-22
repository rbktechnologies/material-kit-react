"use client";

import React, { useEffect, useRef, useState } from 'react';
import Stack from '@mui/material/Stack';
import { getApiBaseURL } from '@/lib/get-api-base-url';
import { Button, CircularProgress, Typography } from '@mui/material';
import { forkJoin, of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { map, catchError } from 'rxjs/operators';
import { AddEditEnquiryForm } from '@/components/dashboard/enquiry/add-edit-enquiry';
import { useRouter } from 'next/navigation';
import { Enquiry } from '@/components/dashboard/enquiry/enquiry-list';
import { AcadamicYear } from '@/components/dashboard/batches/batches-list';
import { Branch } from '@/components/dashboard/branches/branches-details';
import { Course } from '@/components/dashboard/courses/course-list';
import fetchWithAuth from '@/lib/auth/api';

const Page: React.FC = () => {
  const [allBranches, setAllBranches] = useState<Branch[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [allAcadamicYear, setAllAcadamicYear] = useState<AcadamicYear[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editEnquiry, setEditEnquiry] = useState<Enquiry | null>(null);
  const didMountRef = useRef(false);
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);

  const fetchBranchesAndCourses = () => {
    forkJoin({
      branches: fromFetch(`${getApiBaseURL()}items/branchs`).pipe(
        map(async (response) => {
          if (!response.ok) throw new Error('Failed to fetch branches');
          return response.json();
        }),
        catchError(err => {
          console.error("Failed to Fetch Branches", err);
          return of({ data: [] });
        })
      ),
      courses: fromFetch(`${getApiBaseURL()}items/courses`).pipe(
        map(async (response) => {
          if (!response.ok) throw new Error('Failed to fetch courses');
          return response.json();
        }),
        catchError(err => {
          console.error("Failed to Fetch Courses", err);
          return of({ data: [] });
        })
      ),
      acadamicYear: fromFetch(`${getApiBaseURL()}items/academic_year`).pipe(
        map(async (response) => {
          if (!response.ok) throw new Error('Failed to fetch academic year');
          return response.json();
        }),
        catchError(err => {
          console.error("Failed to Fetch Academic Year", err);
          return of({ data: [] });
        })
      )
    }).subscribe({
      next: async (response) => {
        try {
          const branches = await response.branches;
          const courses = await response.courses;
          const acadamicYear = await response.acadamicYear;
          setAllBranches(branches.data);
          setAllCourses(courses.data);
          setAllAcadamicYear(acadamicYear.data);
        } catch (err) {
          console.error("Error occurred:", err);
          setError('An error occurred while fetching data.');
        }
      },
      error: (err) => {
        console.error("Error occurred:", err);
        setError('An error occurred while fetching data.');
        setLoading(false);
      },
      complete: () => {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const idParam = searchParams.get('id');
    setId(idParam);
    fetchBranchesAndCourses();
    if (idParam) {
      fetchEnquiry(idParam as string);
    }
  }, []); // Empty dependency array ensures this runs only once

  const fetchEnquiry = async (enquiryId: string) => {
    try {
      const response = await fetchWithAuth(`items/student_enquiry/${enquiryId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch enquiry');
      }
      const res = await response.json();
      setEnquiry(res.data);
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
      <div>
        <AddEditEnquiryForm
          enquiry={enquiry}
          getAllBranches={allBranches}
          getAllCourses={allCourses}
        />
      </div>
    </Stack>
  );
}

export default Page;
