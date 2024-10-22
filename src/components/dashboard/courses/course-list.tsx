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

export interface Course {
  id: string;
  branch: Branch;
  course_name: string;
  status: string;
  date_created: Date;
}

interface CourseTableProps {
    count: number;
    page: number;
    rows: Course[];
    rowsPerPage: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onEdit: (course: Course) => void;
    onDelete: (courseId: string) => void;
  }
  
export function CourseTable({
    count,
    page,
    rows,
    rowsPerPage,
    onPageChange,
    onEdit,
    onDelete
  }: CourseTableProps): React.JSX.Element {
  const startId = page * rowsPerPage + 1;
  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              return (
                <TableRow key={row.id}>
                  <TableCell>{startId + index }</TableCell>
                  <TableCell>{row.course_name}</TableCell>
                  <TableCell>{row.branch?.name}</TableCell>
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
