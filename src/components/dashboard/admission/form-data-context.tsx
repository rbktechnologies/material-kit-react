import { getApiBaseURL } from '@/lib/get-api-base-url';
import React, { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react';
import { Branch } from '../branches/branches-details';
import { Course } from '../courses/course-list';
import { AcadamicYear, Batch } from '../batches/batches-list';
import { catchError, forkJoin, from, map, of } from 'rxjs';
import fetchWithAuth from '@/lib/auth/api';
import { FormProvider, useForm } from 'react-hook-form';

interface FormDataContextType {
  allAcadamicYear: Array<AcadamicYear>;
  allBranches: Array<Branch>;
  allCourses: Array<Course>;
  allBatches: Array<Batch>;
  isFetched: boolean;
}

const FormDataContext = createContext<FormDataContextType | undefined>(undefined);

export const useFormData = () => {
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error('useFormData must be used within a FormDataProvider');
  }
  return context;
};

interface FormDataProviderProps {
  children: ReactNode;
}

export const FormDataProvider: React.FC<FormDataProviderProps> = ({ children }) => {  
  const [allBranches, setAllBranches] = useState<Branch[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [allAcadamicYear, setAllAcadamicYear] = useState<AcadamicYear[]>([]);
  const [allBatches, setAllBatches] = useState<Batch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFetched, setIsFetched] = useState(false);
  const didMountRef = useRef(false);
  const [loading, setLoading] = useState<boolean>(true);
  const methods = useForm();

  const fetchBranchesAndCourses = () => {
    forkJoin({
      branches: from(fetchWithAuth(`items/branchs`)).pipe(
        map(async (response) => {
          if (!response.ok) throw new Error('Failed to fetch branches');
          return response.json(); // Returns a Promise
        }),
        catchError(err => {
          console.error('Failed to Fetch Branches', err);
          return of({ data: [] }); // Return an empty data object
        })
      ),
      courses: from(fetchWithAuth(`items/courses`)).pipe(
        map(async (response) => {
          if (!response.ok) throw new Error('Failed to fetch courses');
          return response.json(); // Returns a Promise
        }),
        catchError(err => {
          console.error('Failed to Fetch Courses', err);
          return of({ data: [] }); // Return an empty data object
        })
      ),
      batches: from(fetchWithAuth(`items/batches`)).pipe(
        map(async (response) => {
          if (!response.ok) throw new Error('Failed to fetch batches');
          return response.json(); // Returns a Promise
        }),
        catchError(err => {
          console.error('Failed to Fetch batches', err);
          return of({ data: [] }); // Return an empty data object
        })
      ),
      acadamicYear: from(fetchWithAuth(`items/academic_year`)).pipe(
        map(async (response) => {
          if (!response.ok) throw new Error('Failed to fetch academic years');
          return response.json(); // Returns a Promise
        }),
        catchError(err => {
          console.error('Failed to Fetch Academic Years', err);
          return of({ data: [] }); // Return an empty data object
        })
      )
    }).subscribe({
      next: async (response) => {
        try {
          const branches = await response.branches;
          const courses = await response.courses;
          const batches = await response.batches;
          const acadamicYear = await response.acadamicYear;
          setAllBranches(branches.data);
          setAllCourses(courses.data);
          setAllBatches(batches.data);
          setAllAcadamicYear(acadamicYear.data);
        } catch (err) {
          console.error('Error occurred while processing response:', err);
        }
      },
      error: (err) => {
        console.error('Error occurred during fetch:', err);
        setLoading(false);
      },
      complete: () => {
        setLoading(false);
      }
    });
  };


  useEffect(() => {
    fetchBranchesAndCourses();
  }, []);


  return (
    <FormDataContext.Provider value={{ allBranches, allCourses, allAcadamicYear, allBatches, isFetched }}>
          {children}
    </FormDataContext.Provider>
  );
};

export default FormDataProvider;
