"use client";

import React, { useEffect, useRef, useState } from 'react';
import Stack from '@mui/material/Stack';
import { getApiBaseURL } from '@/lib/get-api-base-url';
import { Button, Modal } from '@mui/material';
import { Course, CourseTable } from '@/components/dashboard/courses/course-list';
import { AddEditCourseForm } from '@/components/dashboard/courses/add-edit-courses';
import fetchWithAuth from '@/lib/auth/api';
const modalStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600, // Adjust the width as needed
  height: '50vh', // Adjust the height as needed
};
export default function Page(): React.JSX.Element {
  const [data, setData] = useState<Course[]>([]);
  const [allBranches, setAllBranches] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const didMountRef = useRef(false);

  const fetchData = async (page: number, rowsPerPage: number) => {
    try {
      const response = await fetchWithAuth(`items/courses?fields=*,branch.*&limit=${rowsPerPage}&offset=${page * rowsPerPage}&meta=total_count&sort=-date_created`);
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

  const fetchAllBranches = async () => {
    try {
      const response = await fetchWithAuth(`items/branchs`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const res = await response.json();
      setAllBranches(res.data);
    } catch {
      setError("Failed to Fetch Res");
    }
  };

  useEffect(() => {
     fetchData(page, rowsPerPage);
     fetchAllBranches();
  }, [page, rowsPerPage]);

  const handleAddCourse = (newCourse: Course) => {
    setData(prevData => [newCourse, ...prevData]);
    setTotalCount(prevCount => prevCount + 1);
    setPage(0);
    handleModalClose();
  };

  const handleEditCourse = (course: any) => {
    setEditCourse(course);
    setIsModalOpen(true);
  };

  const handleSaveCourse = (updatedCourse: Course) => {
    setData(prevData => prevData.map(course => (course.id === updatedCourse.id ? updatedCourse : course)));
    handleModalClose();
    setEditCourse(null);
  };

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const response = await fetchWithAuth(`items/courses/${courseId}`, {
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

  return (
    <Stack spacing={3}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <Button
          style={{ width: 'auto' }}
          variant="contained"
          color="primary"
          onClick={() => setIsModalOpen(true)}
        >
          Add Course
        </Button>
      </div>
      <CourseTable
        count={totalCount}
        page={page}
        rows={data}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onEdit={handleEditCourse}
        onDelete={handleDeleteCourse}
      />
      <Modal open={isModalOpen} onClose={handleModalClose}>
      <div style={modalStyle}>
          <AddEditCourseForm
            course={editCourse ?? undefined}
            getAllBranches={allBranches}
            onAddCourse={handleAddCourse}
            onEditCourse={handleSaveCourse}
            onCloseModel={handleModalClose}
          />
        </div>
      </Modal>
    </Stack>
  );
}