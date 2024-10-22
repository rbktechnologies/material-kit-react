'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import dayjs from 'dayjs';
import { PencilLine as PencilLineIcon, Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr';
import { Branch } from '../branches/branches-details';
import { Course } from '../courses/course-list';

export interface Batch {
  academic_year: string;
  batch_name: string;
  branch: any;
  course: any;
  date_created: string; // ISO 8601 date string
  date_updated: string | null;
  end_date: string; // ISO 8601 date string
  female_intake: number | null;
  id: string;
  male_intake: number | null;
  male_roll_no_start_with: string;
  male_roll_no_end_with: string;
  female_roll_no_start_with: string;
  female_roll_no_end_with: string;
  sort: number;
  start_date: string; // ISO 8601 date string
  status: string;
  user_created: string;
  user_updated: string | null;
}

export interface AcadamicYear {
  name: string;
  status: string;
}

interface BatchTableProps {
    count: number;
    page: number;
    rows: Batch[];
    rowsPerPage: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onEdit: (batch: Batch) => void;
    onDelete: (batchId: string) => void;
  }
  
export function BatchesTable({
    count,
    page,
    rows,
    rowsPerPage,
    onPageChange,
    onEdit,
    onDelete
  }: BatchTableProps): React.JSX.Element {
  const startId = page * rowsPerPage + 1;
  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Batch</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Intake</TableCell>
              <TableCell>Roll Range</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              return (
                <TableRow key={row.id}>
                  <TableCell>{startId + index }</TableCell>
                  <TableCell>{row.batch_name}</TableCell>
                  <TableCell>{row.branch?.name}</TableCell>
                  <TableCell>{row.course?.course_name}</TableCell>
                  <TableCell>Male: {row.male_intake} Female:{row.female_intake}</TableCell>
                  <TableCell>Male: {row.male_roll_no_start_with}-{row.male_roll_no_end_with} Female:{row.female_roll_no_start_with}-{row.female_roll_no_end_with}</TableCell>
                  <TableCell>{row.start_date}</TableCell>
                  <TableCell>{row.end_date}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{dayjs(row.date_created).format('MMM D, YYYY')}</TableCell>
                  <TableCell>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <PencilLineIcon size={20} onClick={() => onEdit(row)} />
                    <TrashIcon size={20} onClick={() => onDelete(row.id)} />
                  </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
            rowsPerPageOptions={[5]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onPageChange}
        />
    </Card>
  );
}
