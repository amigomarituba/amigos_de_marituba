import CIcon from '@coreui/icons-react'
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react'
import { Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

const ModalDash = forwardRef(
  ({ title, icon, children, handleButtonSalveModal, CloseAdd, isSpinner, lider }, ref) => {
    const [visible, setVisible] = useState(false)

    useImperativeHandle(ref, () => ({
      visibleModal: () => handleModalVisible(),
    }))

    const handleModalVisible = () => {
      setVisible(!visible)
      CloseAdd()
    }

    return (
      <>
        <CModal
          visible={visible}
          size="lg"
          onClose={() => {
            setVisible(false)
            CloseAdd()
          }}
        >
          <CModalHeader>
            <CIcon
              icon={icon}
              customClassName="nav-icon"
              style={{ width: '7%', marginRight: 10 }}
            />
            <CModalTitle>{title}</CModalTitle>
          </CModalHeader>
          <CModalBody>{children}</CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={handleModalVisible}>
              Cancelar
            </CButton>
            <CButton color="primary" onClick={handleButtonSalveModal} disabled={isSpinner}>
              {isSpinner ? <CSpinner size="sm" className="me-2" /> : ''} Salvar
            </CButton>
          </CModalFooter>
        </CModal>
      </>
    )
  },
)

export default React.memo(ModalDash)
