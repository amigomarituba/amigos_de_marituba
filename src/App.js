import { Suspense, useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, CToaster, useColorModes } from '@coreui/react'
import './scss/style.scss'

import './scss/examples.scss'
import { AppRoute } from './routes/app.routes'
import { AuthRoute } from './routes/auth.routes'
import { useNetworkMonitor } from './hook/useNetwork'

const App = () => {
  const user = useSelector((state) => state.user)

  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  // const [toast, setToast] = useState(0)

  // useNetworkMonitor(setToast)

  useEffect(() => {

    localStorage.setItem('coreui-free-react-admin-template-theme','dark')
    
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter>
      {/* <CToaster push={toast} placement="top-center"  className='mt-3'/> */}
      {user ? <AppRoute /> : <AuthRoute />}
    </BrowserRouter>
  )
}

export default App
