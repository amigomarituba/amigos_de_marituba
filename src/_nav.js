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
    acess: ['adm'],
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Gerenciamento',
  },
  {
    component: CNavItem,
    name: 'LIDERES',
    acess: ['adm'],
    to: '/lideres',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'CIDADÃOS',
    acess: ['adm', 'usu'],
    to: '/cidadoes',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'RELATORIO',
    acess: ['adm'],
    to: '/relatorios',
    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Serviços',
  },
  {
    component: CNavItem,
    name: 'AGENDAMENTOS',
    acess: ['adm', 'usu'],
    to: '/servicos/agendamentos',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Configurações',
  },
  {
    component: CNavItem,
    acess: ['adm'],
    name: 'ÁREAS',
    to: '/areas',
    icon: <CIcon icon={cilTerrain} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Logins',
    acess: ['adm'],
    to: '/settings/usuarios',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'SERVIÇOS',
    acess: ['adm'],
    to: '/settings/servicos',
    icon: <CIcon icon={cilPin} customClassName="nav-icon" />,
  },
]

export default _nav
