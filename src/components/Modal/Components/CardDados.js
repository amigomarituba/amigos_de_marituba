import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

function CardDados({ title, icon, dados }) {
  return (
    <CCard className="mt-3">
      <CCardHeader className="bg-transparent d-flex align-items-center gap-2">
        {icon}
        <strong>{title}</strong>
      </CCardHeader>
      <CCardBody>
        {dados.map((dado, key) => (
          <CRow className="border-bottom border-bottom p-2 mb-2">
            <CCol>{dado.title}</CCol>

            <CCol md={8} xs={6} className="d-flex align-items-center justify-content-end">
              {dado.value}
            </CCol>
          </CRow>
        ))}
      </CCardBody>
    </CCard>
  )
}

export default CardDados
