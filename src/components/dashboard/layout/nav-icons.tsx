import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { CirclesFour } from '@phosphor-icons/react/dist/ssr/CirclesFour';
import { Exam } from '@phosphor-icons/react/dist/ssr/Exam';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { Numpad } from '@phosphor-icons/react/dist/ssr/Numpad';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { QrCode } from '@phosphor-icons/react/dist/ssr/QrCode';
import { Student } from '@phosphor-icons/react/dist/ssr/Student';
import { TextIndent } from '@phosphor-icons/react/dist/ssr/TextIndent';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'circles-four':CirclesFour,
  'text-indent':TextIndent,
  'gear-six': GearSixIcon,
  'numpad':Numpad,
  'qr-code':QrCode,
  'exam': Exam,
  'student':Student,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  user: UserIcon,
  users: UsersIcon,
} as Record<string, Icon>;
