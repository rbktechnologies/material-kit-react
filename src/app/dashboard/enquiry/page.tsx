"use client";

import React, { useEffect, useRef, useState } from 'react';
import Stack from '@mui/material/Stack';
import { getApiBaseURL } from '@/lib/get-api-base-url';
import { Button } from '@mui/material';
import { AcadamicYear, Batch, BatchesTable } from '@/components/dashboard/batches/batches-list';
import { Course } from '@/components/dashboard/courses/course-list';
import { forkJoin, of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { map, catchError } from 'rxjs/operators';
import { Branch } from '@/components/dashboard/branches/branches-details';
import { Enquiry, EnquiryTable } from '@/components/dashboard/enquiry/enquiry-list';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import fetchWithAuth from '@/lib/auth/api';
import { useLoading } from '@/contexts/loading-context';

const Page: React.FC = () => {
  const [data, setData] = useState<Enquiry[]>([]);
  const [allBranches, setAllBranches] = useState<Branch[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [allAcadamicYear, setAllAcadamicYear] = useState<AcadamicYear[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [editEnquiry, setEditEnquiry] = useState<Enquiry | null>(null);
  const didMountRef = useRef(false);
  const router = useRouter();
  const { setLoading } = useLoading();

  const fetchData = async (page: number, rowsPerPage: number) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`items/student_enquiry?fields=*,branch.*,course.*,image.url,image.cdn_url&limit=${rowsPerPage}&offset=${page * rowsPerPage}&meta=total_count&sort=-date_created`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const res = await response.json();
      setData(res.data);
      setTotalCount(res.meta.total_count);
    } catch {
      setError("Failed to Fetch Res");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleEditEnquiry = (enquiry: Enquiry) => {
    setEditEnquiry(enquiry);
    router.replace(`${paths.dashboard.addUpdateEnquiry}?id=${enquiry.id}`);
  };

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleDeleteEnquiry = async (enquiryId: string) => {
    try {
      await fetchWithAuth(`items/student_enquiry/${enquiryId}`, {
        method: 'DELETE',
      });
      setData(prevData => prevData.filter(enq => enq.id !== enquiryId));
      setTotalCount(prevCount => prevCount - 1);
    } catch (error) {
      console.error("Failed to delete Course:", error);
    }
  };

  const handleAddEnquiry = () => {
    router.replace(paths.dashboard.addUpdateEnquiry);
  };

  return (
    <Stack spacing={3}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <Button
          style={{ width: 'auto' }}
          variant="contained"
          color="primary"
          onClick={handleAddEnquiry}
        >
          Add Student Enquiry
        </Button>
      </div>
      <EnquiryTable
        count={totalCount}
        page={page}
        rows={data}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onEdit={handleEditEnquiry}
        onDelete={handleDeleteEnquiry}
      />
    </Stack>
  );
}

export default Page;
