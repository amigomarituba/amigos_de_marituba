import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCloseButton,
  CCol,
  CContainer,
  CFormInput,
  CInputGroup,
  CPopover,
  CRow,
} from '@coreui/react'
import { Box } from '@mui/material'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { instanceAxios } from '../../../config/api'
import { useSelector } from 'react-redux'
import { Col } from 'rsuite'
import CardBody from 'rsuite/esm/Card/CardBody'
import CIcon from '@coreui/icons-react'
import { cilAddressBook, cilPin, cilPlus } from '@coreui/icons'

const Service = () => {
  const user = useSelector((state) => state.user)

  const { register, handleSubmit } = useForm()
  const [createService, setCreateService] = useState(false)
  const [services, setServices] = useState([])

  const onsubmit = async (data) => {
    const { status } = await instanceAxios.post('/service/create', data)
    setCreateService(!createService)
  }

  const handleRemoveService = async (id) => {
    const { status } = await instanceAxios.delete(`/service/${id}`)
    if (status == 200) {
      setCreateService(!createService)
    }
  }

  const api = async () => {
    const { status, data } = await instanceAxios.get('/service')

    if (status == 200) {
      setServices(data)
    }
  }

  useEffect(() => {
    api()
  }, [createService])

  return (
    <CContainer fluid>
      <CRow className="mt-4">
        <h3 className="mb-3">Gerenciamento de Serviços</h3>
        <CCol lg={12} className="mb-3">
          <CCard>
            <CCardHeader>
              <strong>Novo Serviço</strong>
            </CCardHeader>
            <CCardBody>
              <form onSubmit={handleSubmit(onsubmit)}>
                <CRow>
                  <CCol md="auto" xs="auto">
                    <CFormInput
                      type="color"
                      label="Color"
                      {...register('color', { required: true })}
                    />
                  </CCol>

                  <CCol>
                    <CFormInput
                      type="text"
                      label="Novo Serviço"
                      placeholder="serviço"
                      {...register('service', { required: true })}
                    />
                  </CCol>

                  <CCol xs={12} md="auto">
                    <div className="d-flex h-100 align-items-end">
                      <CButton
                        color="primary"
                        className="w-100 w-md-auto m-md-0 mt-3 d-flex align-items-center "
                        type="submit"
                      >
                        <CIcon icon={cilPlus} size="xl" className="me-2" />
                        <strong>Adicionar</strong>
                      </CButton>
                    </div>
                  </CCol>
                </CRow>
              </form>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={12}>
          <CCard>
            <CCardHeader>
              <strong>Serviços Criados</strong>
            </CCardHeader>
            <CCardBody>
              <CRow xs={{ cols: 2 }} md={{ cols: 4 }}>
                {services.map((service) => (
                  <Col key={service.id} className="mt-2">
                    <CCard className="h-100 p-3">
                      <CardBody>
                        <div className="d-flex justify-content-between align-item-center">
                          <CIcon icon={cilPin} size="xl" />
                        
                            <CCloseButton onClick={() => handleRemoveService(service.id)} />
                          
                        </div>
                        <h6 className="mt-3">{service.service}</h6>

                        <div
                          style={{
                            width: '25%',
                            height: '20%',
                            backgroundColor: service.color,
                            borderRadius: 10,
                            marginBottom: 18,
                          }}
                        ></div>
                      </CardBody>
                    </CCard>
                  </Col>
                ))}
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Service
