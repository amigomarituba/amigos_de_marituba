import React from 'react'
import Service from './views/settings/components/Services'
import Acess from './views/settings/components/Acess'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Lideres = React.lazy(() => import('./views/regencia/Lideres'))
const Cidadoes = React.lazy(() => import('./views/regencia/Cidadoes'))
const Relatorios = React.lazy(() => import('./views/servicos/Relatorios/Relatorios'))
const Agendamentos = React.lazy(() => import('./views/servicos/consultas/Agendamentos'))

const routes = [
  { path: '/dashboard', name: 'Home', element: Dashboard },
  { path: '/relatorios', name: 'Relatorios', element: Relatorios },
  { path: '/lideres/:fill', name: 'Lideres', element: Lideres },
  { path: '/cidadoes/:fill', name: 'Cidadões', element: Cidadoes },
  { path: '/servicos/agendamentos', name: 'Agendamentos', element: Agendamentos },
  { path: '/settings/servicos', name: 'Servicos', element: Service },
  { path: '/settings/usuarios', name: 'Usuarios', element: Acess },
]

export default routes
