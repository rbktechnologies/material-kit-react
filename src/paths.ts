export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    branches: '/dashboard/branches',
    courses: '/dashboard/courses',
    batches: '/dashboard/batches',
    enquiry: '/dashboard/enquiry',
    customers: '/dashboard/customers',
    addUpdateEnquiry: '/dashboard/enquiry/addupdate',
    admission: '/dashboard/admission',
    admissionform: '/dashboard/admission/form',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
    attendance_student: '/dashboard/attendance/student',
    attendance: '/dashboard/attendance',
    result: '/dashboard/result',
    upload_result: '/dashboard/upload_result'
  },
  errors: { notFound: '/errors/not-found' },
} as const;
