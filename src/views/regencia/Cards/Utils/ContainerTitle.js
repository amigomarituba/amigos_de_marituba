import { CContainer, CRow } from "@coreui/react";
import { Box } from "@mui/material";
import React from "react";

const ContainerTitle = ({ title, info }) => {
    return (
        <Box sx={{display:'flex', marginLeft:5, marginRight:5, flexDirection:'column'}}> 
            <Box style={{ fontSize: 15 }}> {title} </Box>
            <Box style={{ fontSize: 20, fontWeight: 'bold' }}>{info}</Box>
        </Box>
    );
}

export default React.memo(ContainerTitle)
