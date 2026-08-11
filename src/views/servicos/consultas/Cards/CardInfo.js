import { CCard } from '@coreui/react'
import CardBody from 'rsuite/esm/Card/CardBody'

export default function CardInfo({ day, title, icon, ...props }) {
  return (
    <CCard className="p-2 mb-2" {...props}>
      <CardBody>
        <div className="d-flex align-items-center justify-content-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: 25,
              height: 25,
              borderRadius: '50%',
              flexShrink: 0,
            }}
          >
            {icon}
          </div>

          <div className="ms-2">
            <h2 className="mb-0 text-white fw-bold" style={{ fontSize: 16 }}>
              {day}
            </h2>
            <div className="text-white-50">{title}</div>
          </div>
        </div>
      </CardBody>
    </CCard>
  )
}
