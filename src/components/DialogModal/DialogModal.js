import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from "@coreui/react";
import React, { useState } from "react";

const DialogModal = ({visible, onCloseModal,onConfime,title, messagem}) =>{

    return(
        <CModal
            visible={visible}
            onClose={onCloseModal}
            aria-labelledby="LiveDemoExampleLabel"
        >
        <CModalHeader>
            <CModalTitle>{title}</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <p>{messagem}</p>
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary"
            onClick={onCloseModal}
            >Cancelar</CButton>
            <CButton color="primary"
             onClick={onConfime}
            >Confirmar</CButton>
        </CModalFooter>
        </CModal>
    )
}
export default React.memo(DialogModal)