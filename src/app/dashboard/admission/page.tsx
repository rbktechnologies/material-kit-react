
"use client";

import React, { useEffect, useRef, useState } from 'react';
import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import { AdmissionTable, StudentAdmission } from '@/components/dashboard/admission/admission-list';
import fetchWithAuth from '@/lib/auth/api';
import { useLoading } from '@/contexts/loading-context';
import jsPDF from 'jspdf';
import JsBarcode from 'jsbarcode';
import FormDataProvider from '@/components/dashboard/admission/form-data-context';
import { FormProvider, useForm } from 'react-hook-form';
import FilterForm from '@/components/dashboard/admission/filter';

const Page: React.FC = () => {
  const [data, setData] = useState<StudentAdmission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [editEnquiry, setEditEnquiry] = useState<StudentAdmission | null>(null);
  const didMountRef = useRef(false);
  const router = useRouter();
  const { setLoading } = useLoading();
  const [filters, setFilters] = useState<any>({});
  const methods = useForm();
  
  const fetchData = async (page: number, rowsPerPage: number, filters: any) => {
    setLoading(true);
    let pagination;
    try {
      const filterParams = new URLSearchParams();
      if (filters.branch) filterParams.append('filter[branch][_eq]', filters.branch);
      if (filters.course) filterParams.append('filter[course][_eq]', filters.course);
      if (filters.batch) filterParams.append('filter[batch][_eq]', filters.batch);
      if (filters.fullName) filterParams.append('filter[first_name][_contains]', filters.fullName);
      if(!filterParams.size){
        pagination = `&limit=${rowsPerPage}&offset=${page * rowsPerPage}`;
      }
      // Building the complete API URL with pagination
      const queryString = `items/student_admission?fields=*,branch.*,course.*,academic_year.*,batch.*${pagination}&meta=total_count&sort=-date_created&${filterParams.toString()}`;
  
      const response = await fetchWithAuth(queryString);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const res = await response.json();
      setData(res.data);
      setTotalCount(res.meta.total_count);
    } catch (error) {
      setError("Failed to Fetch Res");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchData(page, rowsPerPage, filters);
  }, [page, rowsPerPage, filters]);

  const handleEditAdmission= (admissionDetails: StudentAdmission) => {
    router.replace(`${paths.dashboard.admissionform}?id=${admissionDetails.id}`);
  };

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleDeleteAdmission = async (enquiryId: string) => {
    try {
      await await fetchWithAuth(`items/student_enquiry/${enquiryId}`, {
        method: 'DELETE',
      });
      setData(prevData => prevData.filter(enq => enq.id !== enquiryId));
      setTotalCount(prevCount => prevCount - 1);
    } catch (error) {
      console.error("Failed to delete Course:", error);
    }
  };

  const handleAddAdmission = () => {
    router.replace(paths.dashboard.admissionform);
  };

  const handleDownloadBarcode = async (barcodes: any) => {
    const doc = new jsPDF('p', 'mm', 'a4'); // A4 size in portrait mode
    const barcodeWidth = 40; // Adjusted width to fit 4 barcodes per row
    const barcodeHeight = 18; // Adjusted height for better fit
    const margin = 5; // Smaller margin between barcodes
    const startX = 10; // Starting x position
    const startY = 10; // Starting y position
    const fontSize = 7; // Reduced font size for better fit
    const rowHeight = barcodeHeight + 10; // Adjusted row height for more compact layout
    const barcodesPerPage = 40;

    barcodes.forEach((barcode: any, index: any) => {
      // Calculate row and column based on index
      if(barcode.id){
        const col = index % 4; // 4 barcodes per row
        const row = Math.floor(index / 4) % 10; // 10 rows per page
  
        // Calculate x and y positions
        const xPos = startX + col * (barcodeWidth + margin);
        const yPos = startY + row * rowHeight; // Adjusted row height to remove extra space
        // Check if new page is needed after every 40 barcodes
        if (index > 0 && index % barcodesPerPage === 0) {
          doc.addPage(); // Add a new page
        }
        // Create a canvas for each barcode
        const canvas = document.createElement('canvas');
        JsBarcode(canvas, barcode.id, {
          format: 'CODE128',
          width: 1.5, // Slightly narrower to fit the width
          height: 25, // Adjust height for better visibility
          displayValue: false, // Hide default barcode value
        });
  
        // Convert canvas to image
        const barcodeImage = canvas.toDataURL('image/png');
  
        // Add the name above the barcode with minimal spacing
        doc.setFontSize(8); // Font size for the name
        doc.text(barcode.name, xPos + barcodeWidth / 2, yPos - 0.5, { align: 'center', baseline: 'bottom' }); // Adjust yPos by a minimal value to reduce space
  
        // Add the barcode image
        doc.addImage(barcodeImage, 'PNG', xPos, yPos, barcodeWidth, barcodeHeight);
  
        // Add the barcode number below in small font with minimal spacing
        doc.setFontSize(fontSize);
        doc.setCharSpace(6);
        doc.text(barcode.id.toLowerCase(), xPos+3, yPos + barcodeHeight-1).setCharSpace(2);
        doc.setCharSpace(0);  
      }

    });

    doc.save('barcodes.pdf');
  };

  const handleFilter = (filters: any) => {
    fetchData(page, rowsPerPage, filters);
    setFilters(filters);
    setPage(0);
  };

  return (
    <Stack spacing={3}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <Button
          style={{ width: 'auto' }}
          variant="contained"
          color="primary"
          onClick={handleAddAdmission}
        >
          New Student Admission
        </Button>
      </div>
      <FormDataProvider>
        <FormProvider {...methods}>
          <FilterForm onFilter={handleFilter} /> {/* Add the FilterForm component */}
        </FormProvider>
      </FormDataProvider>
      <AdmissionTable
        count={totalCount}
        page={page}
        rows={data}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onEdit={handleEditAdmission}
        onDelete={handleDeleteAdmission}
        downloadBarcode = {handleDownloadBarcode}
      />
    </Stack>
  );
}

export default Page;
