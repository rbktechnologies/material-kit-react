"use client";

import React, { useEffect, useRef, useState } from 'react';
import Stack from '@mui/material/Stack';
import { getApiBaseURL } from '@/lib/get-api-base-url';
import { Button, Modal } from '@mui/material';
import { AcadamicYear, Batch, BatchesTable } from '@/components/dashboard/batches/batches-list';
import { AddEditBatchForm } from '@/components/dashboard/batches/add-edit-batches';
import { Course } from '@/components/dashboard/courses/course-list';
import { forkJoin, from, of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { map, catchError } from 'rxjs/operators';
import { Branch } from '@/components/dashboard/branches/branches-details';
import fetchWithAuth from '@/lib/auth/api';
const modalStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900, // Adjust the width as needed
};
export default function Page(): React.JSX.Element {
  const [data, setData] = useState<Batch[]>([]);
  const [allBranches, setAllBranches] = useState<Branch[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [allAcadamicYear, setAllAcadamicYear] = useState<AcadamicYear[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [editBatch, setEditCourse] = useState<Batch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const didMountRef = useRef(false);

  const fetchData = async (page: number, rowsPerPage: number) => {
    try {
      // const response = await fetch(`${getApiBaseURL()}items/batches?fields=*,branch.*,course.*&limit=${rowsPerPage}&offset=${page * rowsPerPage}&meta=total_count&sort=-date_created`);
      const response = await fetchWithAuth(`items/batches?fields=*,branch.*,course.*&limit=${rowsPerPage}&offset=${page * rowsPerPage}&meta=total_count&sort=-date_created`);
      console.log("response",response)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const res = await response.json();
   
      setData(res.data);
      console.log("res.data", res.data);
      setTotalCount(res.meta.total_count);
    } catch {
      setError("Failed to Fetch Res");
    } finally {
      setLoading(false);
    }
  };

  const fetchBranchesAndCourses = () => {
    forkJoin({
      branches: from(fetchWithAuth(`items/branchs`)).pipe(
        map(async (response) => {
          if (!response.ok) throw new Error('Failed to fetch branches');
          return response.json(); // Returns a Promise
        }),
        catchError(err => {
          console.error('Failed to Fetch Branches', err);
          return of({ data: [] }); // Return an empty data object
        })
      ),
      courses: from(fetchWithAuth(`items/courses`)).pipe(
        map(async (response) => {
          if (!response.ok) throw new Error('Failed to fetch courses');
          return response.json(); // Returns a Promise
        }),
        catchError(err => {
          console.error('Failed to Fetch Courses', err);
          return of({ data: [] }); // Return an empty data object
        })
      ),
      acadamicYear: from(fetchWithAuth(`items/academic_year`)).pipe(
        map(async (response) => {
          if (!response.ok) throw new Error('Failed to fetch academic years');
          return response.json(); // Returns a Promise
        }),
        catchError(err => {
          console.error('Failed to Fetch Academic Years', err);
          return of({ data: [] }); // Return an empty data object
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
          console.error('Error occurred while processing response:', err);
        }
      },
      error: (err) => {
        console.error('Error occurred during fetch:', err);
        setLoading(false);
      },
      complete: () => {
        setLoading(false);
        setIsModalOpen(true);
      }
    });
  };

  useEffect(() => {
    fetchData(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleAddBatch = (newBatch: Batch) => {
    setData(prevData => [newBatch, ...prevData]);
    setTotalCount(prevCount => prevCount + 1);
    setPage(0);
    handleModalClose();
  };

  const handleEditBatch = (batch: Batch) => {
    fetchBranchesAndCourses();
    const updatedBatch = {
      ...batch,
      branch: batch.branch.id,
      course: batch.course.id,
    }
    setEditCourse(updatedBatch);
    setIsModalOpen(true);
  };

  const handleSaveBatch = (updatedBatch: Batch) => {
    setData(prevData => prevData.map(batch => (batch.id === updatedBatch.id ? updatedBatch : batch)));
    handleModalClose();
    setEditCourse(null);
  };

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleDeleteBatch = async (courseId: string) => {
    try {
      await fetch(`${getApiBaseURL()}items/courses/${courseId}`, {
        method: 'DELETE',
      });
      setData(prevData => prevData.filter(course => course.id !== courseId));
      setTotalCount(prevCount => prevCount - 1);
    } catch (error) {
      console.error("Failed to delete Course:", error);
    }
  };

  const resetForm = () => {
    setEditCourse(null); // Clear the edit course data
  };

  const handleModalClose = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const handleAddBatchModel= () => {
    fetchBranchesAndCourses();
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
          Add Course
        </Button>
      </div>
      <BatchesTable
        count={totalCount}
        page={page}
        rows={data}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onEdit={handleEditBatch}
        onDelete={handleDeleteBatch}
      />
      <Modal open={isModalOpen} onClose={handleModalClose}>
      <div style={modalStyle}>
          <AddEditBatchForm
            batch={editBatch ?? undefined}
            getAllBranches={allBranches}
            getAllCourses={allCourses}
            getAllAcadamicYear={allAcadamicYear}
            onAddBatch={handleAddBatch}
            onEditBatch={handleSaveBatch}
            onCloseModel={handleModalClose}
          />
        </div>
      </Modal>
    </Stack>
  );
}