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
  cilBarChart,
  cilSettings,
  cilPin,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'DASHBOARD',
    type: 'private',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    type: 'public',
    name: 'Gerenciamento',
  },
  {
    component: CNavItem,
    name: 'LIDERES',
    type: 'private',
    to: '/lideres',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'CIDADÃOS',
    type: 'public',
    to: '/cidadoes',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'RELATORIO',
    type: 'private',
    to: '/relatorios',
    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    type: 'public',
    name: 'Serviços',
  },
  {
    component: CNavItem,
    name: 'AGENDAMENTOS',
    type: 'public',
    to: '/servicos/agendamentos',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    type: 'public',
    name: 'Configurações',
  },
  {
    component: CNavItem,
    type: 'private',
    name: 'ÁREAS',
    to: '/areas',
    icon: <CIcon icon={cilTerrain} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Logins',
    type: 'public',
    to: '/settings/usuarios',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'SERVIÇOS',
    type: 'public',
    to: '/settings/servicos',
    icon: <CIcon icon={cilPin} customClassName="nav-icon" />,
  },
]

export default _nav
