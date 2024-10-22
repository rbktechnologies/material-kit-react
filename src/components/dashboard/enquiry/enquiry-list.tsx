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
import { getApiBaseURL } from '@/lib/get-api-base-url';

export interface Enquiry {
  id: string;
  branch: string;
  course: string;
  status: string;
  date_created: Date;
  student_email: string;
  date: string;
  student_mobile: string;
  gender: string;
  father_mobile: string;
  tenth_school_name: string;
  tenth_without_sport_mark: string;
  location: string;
  city: string;
  remark: string;
  next_follow_up_date: string;
  validity_date: string;
  referred_details: string;
  referred_mobile: string;
  enquiry_type: string;
  upload_photo: string | null;
  upload_signature: string | null;
  first_name: string;
  college_name: string;
}

interface EnquiryTableProps {
  count: number;
  page: number;
  rows: any;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onEdit: (enquiry: Enquiry) => void;
  onDelete: (enquiryId: string) => void;
}

export function EnquiryTable({
  count,
  page,
  rows,
  rowsPerPage,
  onPageChange,
  onEdit,
  onDelete
}: EnquiryTableProps): React.JSX.Element {
  const startId = page * rowsPerPage + 1;
  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '1000px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Action</TableCell>
              <TableCell>Id</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Student Mobile</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Next Follow-up Date</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Parent Mobile</TableCell>
              <TableCell>School Name</TableCell>
              <TableCell>10th School Percentage</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Remark</TableCell>
              <TableCell>Validity Date</TableCell>
              <TableCell>Referred Details</TableCell>
              <TableCell>Referred Mobile</TableCell>
              <TableCell>Upload Photo</TableCell>
              <TableCell>Upload Signature</TableCell>
              <TableCell>College Name</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any, index: number) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <PencilLineIcon size={20} onClick={() => onEdit(row)} />
                    <TrashIcon size={20} onClick={() => onDelete(row.id)} />
                  </Box>
                </TableCell>
                <TableCell>{startId + index}</TableCell>
                <TableCell>{row.first_name}</TableCell>
                <TableCell>{row.student_mobile}</TableCell>
                <TableCell>{row.course?.course_name}</TableCell>
                <TableCell>{row.branch?.name}</TableCell>
                <TableCell>{dayjs(row.next_follow_up_date).format('MMM D, YYYY')}</TableCell>
                <TableCell>{dayjs(row.date_created).format('MMM D, YYYY')}</TableCell>
                <TableCell>{row.student_email}</TableCell>
                <TableCell>{row.gender}</TableCell>
                <TableCell>{row.father_mobile}</TableCell>
                <TableCell>{row.tenth_school_name}</TableCell>
                <TableCell>{row.tenth_without_sport_mark}</TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell>{row.city}</TableCell>
                <TableCell>{row.remark}</TableCell>
                <TableCell>{dayjs(row.validity_date).format('MMM D, YYYY')}</TableCell>
                <TableCell>{row.referred_details}</TableCell>
                <TableCell>{row.referred_mobile}</TableCell>
                <TableCell>
                  {row.upload_photo && <img src={`${getApiBaseURL()}assets/${row.upload_photo}`} width={40} />}
                </TableCell>
                <TableCell>
                  {row.upload_signature && <img src={`${getApiBaseURL()}assets/${row.upload_signature}`} alt="Uploaded Signature" width={40} />}
                </TableCell>
                <TableCell>{row.college_name}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
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
