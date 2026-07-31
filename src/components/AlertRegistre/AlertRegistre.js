import { Alert, AlertTitle, Snackbar } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const AlertRegistre = ({ open, handleClose, severity, message }) => {
  const dispatch = useDispatch()
  const alert = useSelector((state) => state.alert)

  return (
    <Snackbar
      open={alert.visible}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={()=>{
        dispatch({
          type:"set",
          alert:{
            ...alert,
            visible:false
          }
        })
      }}
      autoHideDuration={3000}
    >
      <Alert onClose={()=>{
        dispatch({
          type:"set",
          alert:{
            ...alert,
            visible:false
          }
        })
      }} severity={alert.color} variant="filled" sx={{ width: '100%' }}>
        <AlertTitle>{alert?.title}</AlertTitle>
        {alert.message}
      </Alert>
    </Snackbar>
  )
}
export default React.memo(AlertRegistre)
