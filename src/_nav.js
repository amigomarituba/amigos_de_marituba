import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilUser,
  cilCreditCard,
  cilFingerprint,
  cilHealing,
  cilTerrain,
  cilClipboard,
  cilCalendar,
  cilBarChart
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    type:'private',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    type:'public',
    name: 'Gerenciamento',
  },
  // {
  //   component: CNavItem,
  //   type:'private',
  //   name: 'Areas',
  //   to: '/areas',
  //   icon: <CIcon icon={cilTerrain} customClassName="nav-icon" />,
  // },
  {
    component: CNavItem,
    name: 'Lideres',
    type:'private',
    to: '/lideres/all',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Cidadões',
    type:'public',
    to: '/cidadoes/all',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Relatorios',
    type:'private',
    to: '/relatorios',
    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    type:'public',
    name: 'Serviço',
  },
  {
    component: CNavItem,
    name: 'Agendamentos',
    type:'public',
    to: '/servicos/agendamentos',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  }
]

export default _nav
