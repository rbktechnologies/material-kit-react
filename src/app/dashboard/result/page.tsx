"use client";

import React, { useEffect, useRef, useState } from 'react';
import Stack from '@mui/material/Stack';
import { getApiBaseURL } from '@/lib/get-api-base-url';
import { Attendance, AttendanceTable } from '@/components/dashboard/attendance/attendance-details';
import { ResultTable } from '@/components/dashboard/result/result-list';
import fetchWithAuth from '@/lib/auth/api';
import { Button, Modal } from '@mui/material';
import { CSVUploadForm } from '@/components/dashboard/result/file-upload';
import { SnackbarProvider, useSnackbar } from '@/contexts/snackbar-context';
import { useLoading } from '@/contexts/loading-context';
import FormDataProvider from '@/components/dashboard/admission/form-data-context';
import { FormProvider, useForm } from 'react-hook-form';
import FilterForm from '@/components/dashboard/result/filter';

const modalStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900, // Adjust the width as needed
};

export default function Page(): React.JSX.Element {
  const [data, setData] = useState<Attendance[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalLectures, setTotalLectures] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<any>({});
  const didMountRef = useRef(false);
  const { setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen } = useSnackbar();
  const { setLoading } = useLoading();
  const methods = useForm();

  const getCurrentMonthRange = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  const { startDate, endDate } = getCurrentMonthRange();

  const fetchData = async (page: number, rowsPerPage: number, filters?: any) => {
    setLoading(true);
    console.log("filters",filters)
    try {
      const filterParams = new URLSearchParams();
      if (filters.branch) filterParams.append('branch', filters.branch);
      if (filters.course) filterParams.append('course', filters.course);
      if (filters.batch) filterParams.append('batch', filters.batch);
      // Base API URL
      let apiUrl;

      // If a search term is provided, add it to the filter
      apiUrl = `my-api/result?${filterParams.toString()}`;
      // if(!filterParams.size){
      //   apiUrl = `my-api/result?${filterParams.toString()}`;
      // } else {
      //   apiUrl = `items/result?limit=${rowsPerPage}&offset=${page * rowsPerPage}&meta=total_count&sort=-date_created`;
      // }

      const response = await fetchWithAuth(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const res = await response.json();
      setData(res);
      setTotalCount(res);
      setLoading(false);
    } catch {
      setError("Failed to Fetch Res");
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchData(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleFileUpload = () => {
    fetchData(page, rowsPerPage);
    setSnackbarMessage('Result Uploaded Successfully.');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    setIsModalOpen(false);
  }

  const handleAddBatchModel = () => {
    setIsModalOpen(true);
  };

  const handleSearchChange = (searchTerm: string) => {
    fetchData(page, rowsPerPage, searchTerm); // Fetch data with search term
  };

  const handleFilter = (filters: any) => {
    fetchData(page, rowsPerPage, filters);
    setFilters(filters);
    setPage(0);
  };

  return (
    <Stack spacing={3}>
     
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <Button
          style={{ width: 'auto' }}
          variant="contained"
          color="primary"
          onClick={handleAddBatchModel}
        >
          Upload Result
        </Button>
      </div>
      <FormDataProvider>
        <FormProvider {...methods}>
          <FilterForm onFilter={handleFilter} /> {/* Add the FilterForm component */}
        </FormProvider>
      </FormDataProvider>
      <Modal open={isModalOpen} onClose={handleModalClose}>
        <div style={modalStyle}>
          <CSVUploadForm handleFile={handleFileUpload} onCloseModel={handleModalClose} />
        </div>
      </Modal>
      <ResultTable
        count={totalCount}
        page={page}
        rows={data}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
      />
    </Stack>
  );
}
