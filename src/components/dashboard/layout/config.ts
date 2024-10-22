import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems: any[] = [
  { 
    key: 'overview', 
    title: 'Overview', 
    href: paths.dashboard.overview, 
    icon: 'chart-pie' 
  },
  { 
    key: 'institute', 
    title: 'Institute', 
    href: '#', 
    icon: 'circles-four',
    items: [
      { key: 'branches', title: 'Branch', href: paths.dashboard.branches,   icon: 'text-indent'  },
      { key: 'courses', title: 'Courses', href: paths.dashboard.courses,   icon: 'text-indent'  },
      { key: 'batches', title: 'Batch', href: paths.dashboard.batches,   icon: 'text-indent'  },
    ],
  },
  { 
    key: 'enquiry', 
    title: 'Enquiry', 
    href: '#', 
    icon: 'numpad',
    items: [
      { key: 'enquiry', title: 'Add Enquiry', href: paths.dashboard.addUpdateEnquiry,   icon: 'text-indent'  },
      { key: 'enquiry-list', title: 'Enquiry List', href: paths.dashboard.enquiry,   icon: 'text-indent'  }
    ],
  },
  { 
    key: 'admission', 
    title: 'Admission', 
    href: '#', 
    icon: 'student',
    items: [
      { key: 'admission', title: 'Admission List', href: paths.dashboard.admission,   icon: 'text-indent'  },
      // { key: 'enquiry-list', title: 'Enquiry List', href: paths.dashboard.enquiry,   icon: 'text-indent'  }
    ],
  },
  { 
    key: 'attendance', 
    title: 'Attendance', 
    href: '#', 
    icon: 'qr-code',
    items: [
      { key: 'attendance', title: 'Show Attendance', href: paths.dashboard.attendance,   icon: 'text-indent'  },
      { key: 'student-attendance', title: 'Student Attendance', href: paths.dashboard.attendance_student,   icon: 'text-indent'  }
    ],
  },
  { 
    key: 'result', 
    title: 'Result', 
    href: '#', 
    icon: 'exam',
    items: [
      { key: 'result', title: 'Show Result', href: paths.dashboard.result,   icon: 'text-indent'  },
      { key: 'upload-result', title: 'Upload Result', href: paths.dashboard.upload_result,   icon: 'text-indent'  }
    ],
  }
];
