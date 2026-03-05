import { useEffect } from 'react'
import {
  CCol,
  CContainer,
  CRow,
} from '@coreui/react'

import { useNavigate } from 'react-router-dom'

const Page404 = () => {

  const nav = useNavigate()

  useEffect(()=>{
    setTimeout(()=>{
      nav('/')
    },3000)
  },[])

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <div className="clearfix">
              <h1 className="float-start display-3 me-4">404</h1>
              <h4 className="pt-3">Ops! Você está perdido.</h4>
              <p className="text-body-secondary float-start">
                A página que você procura não foi encontrada.
              </p>

              <p className="text-body-secondary float-start">
                Em 3 minutos você será redirecionado a página de login!
              </p>
            </div>
            
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page404
