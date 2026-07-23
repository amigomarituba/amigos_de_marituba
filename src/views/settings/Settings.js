import { CButton, CCol, CContainer, CRow } from '@coreui/react'
import Service from './components/Services'
import Acess from './components/Acess'
import { useEffect } from 'react'
import { instanceAxios } from '../../config/api'

const Settings = () => {
  return (
    <CContainer fluid>
      
          <Service />

      <CRow className="mt-4">
        <CCol lg={12}>
          <Acess />
        </CCol>
      </CRow>
      
    </CContainer>
  )
}

export default Settings
