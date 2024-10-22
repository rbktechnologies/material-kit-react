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

export interface Attendance {
  barcode_id: string;
  attendance_type: string;
  student_name: string;
  admission: string;
  count: string;
}

interface AttendanceTableProps {
    count: number;
    page: number;
    rows: Attendance[];
    rowsPerPage: number;
    totalLectures: any;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  }
  
export function AttendanceTable({
    count,
    page,
    rows,
    rowsPerPage,
    totalLectures,
    onPageChange,
  }: AttendanceTableProps): React.JSX.Element {
  const startId = page * rowsPerPage + 1;
  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Total Lecture Count</TableCell>
              <TableCell>Prasent Count</TableCell>
              <TableCell>Absent Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              return (
                <TableRow key={row.barcode_id}>
                  <TableCell>{startId + index }</TableCell>
                  <TableCell>{row.student_name}</TableCell>
                  <TableCell>{totalLectures}</TableCell>
                  <TableCell>{row.count}</TableCell>
                  <TableCell>{Number(totalLectures - Number(row.count))}</TableCell>
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
