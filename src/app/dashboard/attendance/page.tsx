"use client";

import React, { useEffect, useRef, useState } from 'react';
import Stack from '@mui/material/Stack';
import { Attendance, AttendanceTable } from '@/components/dashboard/attendance/attendance-details';
import fetchWithAuth from '@/lib/auth/api';
import { useLoading } from '@/contexts/loading-context';
import FilterForm from '@/components/dashboard/attendance/filter';
import FormDataProvider from '@/components/dashboard/admission/form-data-context';

//export const metadata = { title: `Branches | Dashboard | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
  const [data, setData] = useState<Attendance[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalLectures, setTotalLectures] = useState<number>(0);
  const [filters, setFilters] = useState<any>({});
  const didMountRef = useRef(false);
  const { setLoading } = useLoading();

  const getCurrentMonthRange = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth()-1;
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };
  const { startDate, endDate } = getCurrentMonthRange();

  const fetchData = async (page: number, rowsPerPage: number, filters: any) => {
    setLoading(true);
    try {
      const filterParams = new URLSearchParams();
      //[create_date_time][_between]=${startDate},${endDate}
      if (filters.name) filterParams.append('filter[student_name][_contains]', filters.name);
      if (filters.status) filterParams.append('filter[status][_eq]', filters.status);
      const response = await fetchWithAuth(`items/student_attendance?filter&aggregate[count]=*&groupBy[]=barcode_id&groupBy[]=attendance_type&groupBy[]=student_name&groupBy[]=admission&fields[]=create_date_time&limit=${rowsPerPage}&offset=${page * rowsPerPage}&meta=total_count&sort=-date_created&${filterParams.toString()}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const res = await response.json();
      const resData = res.data.map((item: any) => {
        if (item.student_name) {
          item.student_name = item.student_name
          .replace(/\bnull\b/gi, '') // Remove literal "null" words
          .split(' ')                // Split by space
          .filter(Boolean)           // Filter out any empty strings
          .join(' ');   
        }
        return item;
      });
      setData(resData);
      setTotalCount(res.meta.total_count);
      setLoading(false);
    } catch {
      setError("Failed to Fetch Res");
      setLoading(false)
    }
  }

  const fetchAttendanceRecords = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`items/student_attendance?filter[create_date_time][_between]=${startDate},${endDate}&fields[]=create_date_time`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const res = await response.json();
      console.log(res);
      const uniqueDates = new Set(
        res.data.map((item: any) => {
          const date = new Date(item.create_date_time);
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        })
      );
      console.log("uniqueDates", uniqueDates)
      setTotalLectures(uniqueDates.size);
      setLoading(false);
    } catch {
      setError("Failed to Fetch Res");
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(page, rowsPerPage, filters);
    fetchAttendanceRecords();
  }, [page, rowsPerPage]);

  const handleFilter = (filters: any) => {
    fetchData(page, rowsPerPage, filters);
    setFilters(filters);
    setPage(0);
  };
  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  return (
    <Stack spacing={3}>
      {/* <FormDataProvider>
        <FilterForm onFilter={handleFilter} /> 
      </FormDataProvider> */}
      <AttendanceTable
        count={totalCount}
        page={page}
        rows={data}
        rowsPerPage={rowsPerPage}
        totalLectures={totalLectures}
        onPageChange={handlePageChange}
      />
    </Stack>
  );
}