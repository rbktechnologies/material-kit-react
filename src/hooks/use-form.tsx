import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';

const FormContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const methods = useForm<any>();

  return (
    <FormProvider {...methods}>
      {children}
    </FormProvider>
  );
};

export default FormContext;
