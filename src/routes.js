import React from 'react'
import Service from './views/settings/components/Services'
import Acess from './views/settings/components/Acess'
import Area from './views/Area/Area'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Lideres = React.lazy(() => import('./views/regencia/Lideres'))
const Cidadoes = React.lazy(() => import('./views/regencia/Cidadoes'))
const Relatorios = React.lazy(() => import('./views/servicos/Relatorios/Relatorios'))
const Agendamentos = React.lazy(() => import('./views/servicos/consultas/Agendamentos'))

const routes = [
  { path: '/dashboard', acess: ['adm'], name: 'Home', element: Dashboard },
  { path: '/relatorios', acess: ['adm'], name: 'Relatorios', element: Relatorios },
  { path: '/lideres/', acess: ['adm'], name: 'Lideres', element: Lideres },
  { path: '/cidadoes/', acess: ['adm', 'usu'], name: 'Cidadões', element: Cidadoes },
  {
    path: '/servicos/agendamentos',
    acess: ['adm', 'usu'],
    name: 'Agendamentos',
    element: Agendamentos,
  },
  { path: '/settings/servicos', acess: ['adm'], name: 'Servicos', element: Service },
  { path: '/settings/usuarios', acess: ['adm'], name: 'Usuarios', element: Acess },
  { path: '/areas', acess: ['adm'], name: 'Area', element: Area },
]

export default routes
