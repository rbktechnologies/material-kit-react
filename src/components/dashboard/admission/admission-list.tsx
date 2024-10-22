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
import Checkbox from '@mui/material/Checkbox';
import dayjs from 'dayjs';
import { PencilLine as PencilLineIcon, Trash as TrashIcon, Barcode as BARCODE } from '@phosphor-icons/react/dist/ssr';
import { getApiBaseURL } from '@/lib/get-api-base-url';
import { Button } from '@mui/material';

export interface StudentAdmission {
  id?: string;
  tenth_school_name: string;
  tenth_without_sport_mark: string;
  twelfth_percentage: string;
  aadhar_card_No: string;
  academic_year: string;
  admission_date: string | null;
  batch: string;
  Biology: string;
  branch: string;
  category: string;
  chemistry: string;
  city: string;
  class: string;
  college_name: string;
  course: string;
  dob: string | null;
  English: number;
  enquiry_id: string;
  father_first_name: string;
  father_last_name: string;
  father_middle_Name: string;
  father_mobile: number;
  fees_status: string;
  first_name: string;
  gender: string;
  group: string[];
  username: string;
  barcode_id: string;
  guardian_first_name: string;
  guardian_last_name: string;
  guardian_middle_Name: string;
  guardian_mobile: number;
  installment_Date: string | null;
  installment_type: string;
  last_name: string;
  math: number;
  math_neet: string;
  middl_name: string;
  mother_first_name: string;
  mother_last_name: string;
  mother_middle_Name: string;
  mother_mobile: number;
  neet_all_india_rank: string;
  neet_cat_rank: string;
  neet_mhtce_total: number;
  permanent_address: string;
  physics: string;
  remark: string;
  residential_address: string;
  roll_no: string;
  science: string;
  state: string;
  status: string;
  student_email: string;
  student_fee: string;
  student_mobile: string;
  telephone_no: number;
  upload_photo: string;
  upload_signature: string;
  enquiry_user: number;
  valid_till: string | null;
}

interface AdmissionTableProps {
  count: number;
  page: number;
  rows: StudentAdmission[];
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onEdit: (enquiry: StudentAdmission) => void;
  onDelete: (enquiryId: string) => void;
  downloadBarcode: (barcodes: { id: string; name: string }[]) => void;
}

export function AdmissionTable({
  count,
  page,
  rows,
  rowsPerPage,
  onPageChange,
  onEdit,
  onDelete,
  downloadBarcode
}: AdmissionTableProps): React.JSX.Element {
  const [selectedBarcodes, setSelectedBarcodes] = React.useState<{ [id: string]: string }>({});

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.reduce((acc, row) => {
        acc[row.barcode_id!] = row.first_name + ' ' + row.last_name;
        return acc;
      }, {} as { [id: string]: string });
      setSelectedBarcodes((prev) => ({ ...prev, ...newSelecteds }));
    } else {
      const newSelecteds = { ...selectedBarcodes };
      rows.forEach((row) => delete newSelecteds[row.barcode_id!]);
      setSelectedBarcodes(newSelecteds);
    }
  };

  const handleCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>, id: string, name: string) => {
    setSelectedBarcodes((prev) => {
      const newSelecteds = { ...prev };
      if (event.target.checked) {
        newSelecteds[id] = name;
      } else {
        delete newSelecteds[id];
      }
      return newSelecteds;
    });
  };

  const isSelected = (id: string) => !!selectedBarcodes[id];

  const handleDownloadBarcode = () => {
    const barcodesToDownload = Object.entries(selectedBarcodes).map(([id, name]) => ({ id, name }));
    downloadBarcode(barcodesToDownload);
    setSelectedBarcodes({}); // Clear selection after download
  };

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
      <Button style={{margin:'10px', float: 'right'}} type="button" variant="contained" color="primary" onClick={handleDownloadBarcode}>
            <span>Download</span><BARCODE style={{marginLeft:'5px'}} size={20}></BARCODE>
      </Button>
        <Table sx={{ minWidth: '1000px' }}>
          <TableHead>
            <TableRow>
            <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={Object.keys(selectedBarcodes).length > 0 && Object.keys(selectedBarcodes).length < rows.length}
                  checked={rows.length > 0 && rows.every((row) => isSelected(row.barcode_id!))}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>Action</TableCell>
              {/* <TableCell>Profile</TableCell> */}
              <TableCell>Roll No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Student Mobile</TableCell>
              <TableCell>Parent Mobile</TableCell>
              <TableCell>Batch</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Barcode ID</TableCell>
              <TableCell>Admission Fee</TableCell>
              <TableCell>Enquiry User</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Installment Date</TableCell>
              <TableCell>Remark</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any) => {
              const isItemSelected = isSelected(row.barcode_id!);
              return (
                <TableRow key={row.id} selected={isItemSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isItemSelected}
                      onChange={(event) => handleCheckboxClick(event, row.barcode_id!, `${row.first_name} ${row.last_name || ''}`)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <PencilLineIcon size={20} onClick={() => onEdit(row)} />
                      <TrashIcon size={20} onClick={() => onDelete(row.id!)} />
                    </Box>
                  </TableCell>
                  {/* <TableCell>
                    {row.upload_photo && <img src={`${getApiBaseURL()}assets/${row.upload_photo}`} width={40} />}
                  </TableCell> */}
                  <TableCell>{row.roll_no}</TableCell>
                  <TableCell>{row.first_name} {row.last_name}</TableCell>
                  <TableCell>{row.student_mobile}</TableCell>
                  <TableCell>{row.father_mobile}</TableCell>
                  <TableCell>{row.batch?.batch_name}</TableCell>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>{row.barcode_id}</TableCell>
                  <TableCell>{row.student_fee}</TableCell>
                  <TableCell>{row.enquiry_user}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.course?.course_name}</TableCell>
                  <TableCell>{row.branch?.name}</TableCell>
                  <TableCell>{row.academic_year?.name}</TableCell>
                  <TableCell>{dayjs(row.installment_Date).format('MMM D, YYYY')}</TableCell>
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
