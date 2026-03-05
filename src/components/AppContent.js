import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'
import { useSelector } from 'react-redux'

const AppContent = () => {

  const level = useSelector((state) => state.user.user.level)

  return (
    <CContainer>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element/>}
                />
              )
            )
          })}
          
          
          <Route path="*" element={
            level == 'adm' ?
            <Navigate to="/dashboard" replace /> :
            <Navigate to="/servicos/agendamentos" replace />
          } /> 
          
        </Routes>
      </Suspense>
      
    </CContainer>
  )
}

export default React.memo(AppContent)
