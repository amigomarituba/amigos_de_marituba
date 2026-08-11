import { CBadge, CButton, CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react'

export default function Area() {
  return (
    <CContainer fluid>
      <CRow>
        <CCol>
          <CCard className="w-100 p-3">
            <CCardBody>
              <CRow>
                <CCol>
                  <div>
                    <h4>
                      <CBadge color="secondary">Próximo Módulo</CBadge>
                    </h4>
                    <h4>Áreas</h4>
                    <span>Gerenciamento de áreas</span>
                  </div>
                </CCol>

                <CCol className="d-flex align-items-center justify-content-end ">
                  <CButton
                    color="primary"
                    className="d-flex"
                    onClick={() => {
                      modalVisible.current.visibleModal()
                    }}
                  >
                    {/* <AddIcon /> */}
                    <span className="d-md-block d-none">Criar nova área</span>
                  </CButton>
                </CCol>
              </CRow>

              <CRow className="mt-2">
                <CCol className="text-uppercase">
                  <CBadge
                    color="primary"
                    className="me-3"
                    style={{
                      fontSize: 14,
                    }}
                  >
                    Total de Areas
                  </CBadge>
                  <strong>registros</strong>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}
