import { CContainer, CCol, CRow } from "@coreui/react";
import React from "react";

const ListView = ({children})=>{
    return (
        <CContainer style={{ overflow:'auto', width:'100%', height:'60vh'}}>
            {children}
        </CContainer>
    )
}

export default React.memo(ListView)
