"use client";

import React, { useEffect, useRef, useState } from 'react';
import Stack from '@mui/material/Stack';
import { Attendance } from '@/components/dashboard/attendance/attendance-details';
import fetchWithAuth from '@/lib/auth/api';
import { useLoading } from '@/contexts/loading-context';
import FilterForm from '@/components/dashboard/attendance/filter';
import FormDataProvider from '@/components/dashboard/admission/form-data-context';
import { StudentAttendanceTable } from '@/components/dashboard/attendance/student-attendance';
import { FormProvider, useForm } from 'react-hook-form';

export interface StudentAttendance {
  barcode_id: string;
  totalLectures: string;
  attendance_type: string;
  student_name: string;
  presentCount: string;
  absentCount: string
}
//export const metadata = { title: `Branches | Dashboard | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
  const [data, setData] = useState<StudentAttendance[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalLectures, setTotalLectures] = useState<number>(0);
  const [filters, setFilters] = useState<any>({});
  const didMountRef = useRef(false);
  const { setLoading } = useLoading();
  const methods = useForm();


  const getCurrentMonthRange = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() - 1;
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
      console.log("`${filters.start_date}, ${filters.end_date}`", `${filters.start_date}T00:00:00, ${filters.end_date}T23:59:59`)
      const filterParams = new URLSearchParams();
      //[create_date_time][_between]=${startDate},${endDate}
      const fields = 'id,date_created,date_updated,barcode_type,attendance_type,exam_name,create_date_time,barcode_id,admission.id,admission.first_name,admission.last_name,admission.branch,admission.course,admission.batch';
      filterParams.append('fields', fields);
      if (filters.branch) filterParams.append('filter[admission][branch][_eq]', filters.branch);
      if (filters.course) filterParams.append('filter[admission][course][_eq]', filters.course);
      if (filters.batch) filterParams.append('filter[admission][batch][_eq]', filters.batch);
      if (filters.start_date) filterParams.append('filter[create_date_time][_between]', `${filters.start_date}T00:00:00, ${filters.end_date}T23:59:59`);
      if (filters.attendance_type) filterParams.append('filter[attendance_type][_eq]', filters.attendance_type);

      
      //limit=${rowsPerPage}&offset=${page * rowsPerPage}&meta=total_count&sort=-date_created&
      //console.log("url", `items/student_attendance?${filterParams.toString()}`)
      const response = await fetchWithAuth(`items/student_attendance?${filterParams.toString()}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const studentFilterParams = new URLSearchParams();
      if (filters.branch) studentFilterParams.append('filter[branch][_eq]', filters.branch);
      if (filters.course) studentFilterParams.append('filter[course][_eq]', filters.course);
      if (filters.batch) studentFilterParams.append('filter[batch][_eq]', filters.batch);

      const getAllStudents = await fetchWithAuth(`items/student_admission?${studentFilterParams.toString()}&limit=1000`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const res = await response.json();
      const allStudents = await getAllStudents.json();
      setData(await generateOutput(res.data, allStudents.data, filters.attendance_type, filters.prasent_absent_status));
      setTotalCount(res.meta.total_count);
      setLoading(false);
    } catch {
      setError("Failed to Fetch Res");
      setLoading(false)
    }
  }

  const generateOutput = async (data: any, allStudents: any, filterAttendanceType: any = 'Regular', filterAttendanceStatus: any) => {
    
    const studentMap = new Map<string, any>();
    const uniqueDates = new Set(
      data.map((item: any) => {
        const date = new Date(item.create_date_time);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      })
    );
      console.log("uniqueDates",uniqueDates)
    // Initialize studentMap with all students
    if(uniqueDates.size){

      allStudents.forEach((student: any) => {
        //const studentKey = `${student.first_name} ${student?.last_name}`;
        const studentKey = [student.first_name, student.last_name]
        .filter(Boolean)  // Remove any falsy values (null, undefined, empty string)
        .join(' '); 
        if (!studentMap.has(studentKey)) {
          studentMap.set(studentKey, {
            presentCount: 0,
            student_name: studentKey,
            barcode_id: student.barcode_id,
            attendance_type: filterAttendanceType, // Assuming all students have the same default attendance type
            uniqueDates: uniqueDates.size,
            barcodeIdSet: new Set()
          });
        }
      });
      console.log("data",data)
      // Process the data to count attendance
      data.forEach((item: any) => {
        const studentKey = [item.admission.first_name, item.admission.last_name]
        .filter(Boolean)  // Remove any falsy values (null, undefined, empty string)
        .join(' '); 
        const studentInfo = studentMap.get(studentKey);
  
        if (studentInfo) {
          studentInfo.barcodeIdSet.add(item.barcode_id);
  
          if (item.attendance_type === filterAttendanceType) {
            studentInfo.presentCount++;
          }
        }
      });
      console.log("studentMap",studentMap)
      // Prepare the final result
      const result: any[] = [];
  
      studentMap.forEach(student => {
        console.log("student",student)
        console.log("filterAttendanceStatus",filterAttendanceStatus)
        if(student.barcodeIdSet.size == filterAttendanceStatus){
          result.push({
            totalLectures: student.uniqueDates,
            student_name: student.student_name,
            barcode_id: student.barcode_id,
            attendance_type: student.attendance_type,
            presentCount: student.barcodeIdSet.size // Count distinct barcode_id
          });
        }
      });
    
      return result;
    } else {
      return [];
    }

  }

  useEffect(() => {
    fetchData(page, rowsPerPage, filters);
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
      <FormDataProvider>
        <FormProvider {...methods}>
          <FilterForm onFilter={handleFilter} /> {/* Add the FilterForm component */}
        </FormProvider>
      </FormDataProvider>
      <StudentAttendanceTable
        count={totalCount}
        page={page}
        rows={data}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
      />
    </Stack>
  );
}