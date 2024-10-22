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
import { StudentAttendance } from '@/app/dashboard/attendance/student/page';

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
  rows: StudentAttendance[];
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
}

export function StudentAttendanceTable({
  count,
  page,
  rows,
  rowsPerPage,
  onPageChange,
}: AttendanceTableProps): React.JSX.Element {
  console.log("rows", rows);
  const startId = page * rowsPerPage + 1;
  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              {/* <TableCell>Total Lecture Count</TableCell> */}
              <TableCell>Status</TableCell>
              {/* <TableCell>Absent Count</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No records found for the selected Filters.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow key={row.barcode_id}>
                  <TableCell>{startId + index}</TableCell>
                  <TableCell>{row.student_name}</TableCell>
                  {/* <TableCell>{row.totalLectures}</TableCell> */}
                  <TableCell>
                    {row.presentCount == '1' ? (
                      <span className="present">P</span>
                    ) : (
                      <span className="absent">AB</span>
                    )}
                  </TableCell>
                  {/* <TableCell>{Number(row.totalLectures) - Number(row.presentCount)}</TableCell> */}
                </TableRow>
              ))
            )}
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
