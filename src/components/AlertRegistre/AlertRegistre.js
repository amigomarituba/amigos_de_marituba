import { Alert, Snackbar } from "@mui/material";
import React from "react";

const AlertRegistre = ({open, handleClose, severity, message})=>{
    return(
        <Snackbar
                open={open}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                onClose={handleClose}
                autoHideDuration={3000}
              >
                <Alert
                  onClose={handleClose}
                  severity={severity}
                  variant="filled"
                  sx={{ width: '100%' }}
                >
                  {message}
                </Alert>
              </Snackbar>
    )
}
export default React.memo(AlertRegistre)
