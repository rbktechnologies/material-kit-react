"use client";

import React, { useEffect, useRef, useState } from 'react';
import Stack from '@mui/material/Stack';
import { Branch, BranchesTable } from '@/components/dashboard/branches/branches-details';
import { AddEditBranchForm } from '@/components/dashboard/branches/add-edit-branch';
import { getApiBaseURL } from '@/lib/get-api-base-url';
import { Button, Modal } from '@mui/material';
import fetchWithAuth from '@/lib/auth/api';
import FilterForm from './filter';
const modalStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600, // Adjust the width as needed
};
//export const metadata = { title: `Branches | Dashboard | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
  const [data, setData] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [editBranch, setEditBranch] = useState<Branch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<any>({});
  const didMountRef = useRef(false);

  const fetchData = async (page: number, rowsPerPage: number, filters:any) => {
    try {
      const filterParams = new URLSearchParams();
      if (filters.name) filterParams.append('filter[name][_contains]', filters.name);
      if (filters.status) filterParams.append('filter[status][_eq]', filters.status);

      const response = await fetchWithAuth(`items/branchs?limit=${rowsPerPage}&offset=${page * rowsPerPage}&meta=total_count&sort=-date_created&${filterParams.toString()}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const res = await response.json();
      setData(res.data);
      console.log("res.data", res.data)
      setTotalCount(res.meta.total_count);
      setLoading(false);
    } catch {
      setError("Failed to Fetch Res");
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(page, rowsPerPage, filters);
  }, [page, rowsPerPage]);

  const handleAddBranch = (newBranch: Branch) => {
    setData(prevData => [newBranch, ...prevData]);
    setTotalCount(prevCount => prevCount + 1);
    setPage(0);
    handleModalClose();
  };

  const handleFilter = (filters: any) => {
    fetchData(page, rowsPerPage, filters);
    setFilters(filters);
    setPage(0);
  };

  const handleEditBranch = (branch: Branch) => {
    setEditBranch(branch);
    setIsModalOpen(true);
  };

  const handleSaveBranch = (updatedBranch: Branch) => {
    console.log("updatedBranch",updatedBranch)
    setData(prevData => prevData.map(branch => {
      console.log("branch",branch);
      return (branch.id === updatedBranch.id ? updatedBranch : branch)
    }));
    setEditBranch(null);
    handleModalClose();
  };

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleDeleteBranch = async (branchId: string) => {
    try {
       await fetchWithAuth(`items/branchs/${branchId}`, {
        method: 'DELETE',
      });
      setData(prevData => prevData.filter(branch => branch.id !== branchId));
      setTotalCount(prevCount => prevCount - 1);
      handleModalClose();
    } catch (error) {
      console.error("Failed to delete branch:", error);
    }
  };

  const resetForm = () => {
    setEditBranch(null); // Clear the edit course data
  };

  const handleModalClose = () => {
    resetForm();
    setIsModalOpen(false);
  };

  return (
    <Stack spacing={3}>
       <FilterForm onFilter={handleFilter} /> {/* Add the FilterForm component */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <Button
          style={{ width: 'auto' }}
          variant="contained"
          color="primary"
          onClick={() => setIsModalOpen(true)}
        >
          Add Branch
        </Button>
      </div>
      <BranchesTable
        count={totalCount}
        page={page}
        rows={data}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onEdit={handleEditBranch}
        onDelete={handleDeleteBranch}
      />
      <Modal open={isModalOpen} onClose={handleModalClose}>
      <div style={modalStyle}>
          <AddEditBranchForm
            branch={editBranch ?? undefined}
            onAddBranch={handleAddBranch}
            onEditBranch={handleSaveBranch}
            onCloseModel={handleModalClose}
          />
        </div>
      </Modal>
    </Stack>
  );
}