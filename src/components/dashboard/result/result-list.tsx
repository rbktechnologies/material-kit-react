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
import TextField from '@mui/material/TextField';

export interface ResultTableProps {
  count: number;
  page: number;
  rows: any[];
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
}

export function ResultTable({
  count,
  page,
  rows,
  rowsPerPage,
  onPageChange,
}: ResultTableProps): React.JSX.Element {
  const startId = page * rowsPerPage + 1;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Roll No</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Marks</TableCell>
              <TableCell>Percentage</TableCell>
              <TableCell>Test Rank</TableCell>
              <TableCell>Final Rank</TableCell>
              <TableCell>Group Rank</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{startId + index}</TableCell>
                <TableCell>{row.roll_no}</TableCell>
                <TableCell>{row.student_name}</TableCell>
                <TableCell>{row.total_marks}</TableCell>
                <TableCell>{row.percentage}</TableCell>
                <TableCell>{row.test_rank}</TableCell>
                <TableCell>{row.final_rank}</TableCell>
                <TableCell>{row.group_rank}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      {/* <TablePagination
        rowsPerPageOptions={[5]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
      /> */}
    </Card>
  );
}
