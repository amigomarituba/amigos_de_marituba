import { CButton, CCol, CRow } from '@coreui/react'
import Service from './components/Services'
import Acess from './components/Acess'
import { useEffect } from 'react'
import { instanceAxios } from '../../config/api'

const Settings = () => {


  return (
    <CCol>
      <CRow className='mb-5'>
        <Service/>
      </CRow>
      <CRow className='mb-5'>
        <Acess/>
      </CRow>
    </CCol>

  )
}

export default Settings
