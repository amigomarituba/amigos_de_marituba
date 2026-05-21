import { useEffect, useRef, useState } from 'react'
import { instanceAxios } from '../config/api'
import { CToast, CToastBody, CToastClose } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilWifiSignal1, cilWifiSignal2, cilWifiSignal4, cilWifiSignalOff } from '@coreui/icons'

export function useNetworkMonitor(addToast) {
  const [quality, setQuality] = useState('boa')
  const history = useRef([])
  const lastStatus = useRef('Boa')

  const notify = (message) => {
    addToast(
      <CToast autohide delay={4000} visible color={message.color}>
        <CToastBody>
          <div className="d-flex">
            <CIcon icon={message.icon} className="me-3" size="xl" />
            <h6 className="text-white align-items-center">{message.msg}</h6>
            <CToastClose className="me-2 m-auto" />
          </div>
        </CToastBody>
      </CToast>,
    )
  }

  const check = async () => {
    const start = performance.now()

    try {
      const { data } = await instanceAxios.get('/ping')

      const time = performance.now() - start

      history.current.push(time)

      if (history.current.length > 5) {
        history.current.shift()
      }

      const avg = history.current.reduce((a, b) => a + b, 0) / history.current.length

      const jitter = Math.max(...history.current) - Math.min(...history.current)

      let status = 'Boa'

      if (avg < 150 && jitter < 80) status = 'Boa'
      else if (avg < 400) status = 'Média'
      else status = 'Ruim'

      if (status !== lastStatus.current) {
        if (status === 'Ruim') {
          notify({
            color: 'secondary',
            icon: cilWifiSignal1,
            msg: 'Conexão Instavel !!',
          })
        }

        if (status === 'Boa' && lastStatus.current === 'Ruim') {
          notify({
            color: 'primary',
            icon: cilWifiSignal4,
            msg: 'Conexão Normal !!',
          })
        }

        lastStatus.current = status
      }

      setQuality(status)
    } catch (e) {
      if (lastStatus.current !== 'Ruim') {
        notify({
          color: 'danger',
          icon: cilWifiSignalOff,
          msg: 'Sem Conexão !!',
        })
        lastStatus.current = 'Ruim'
      }

      setQuality('Ruim')
    }
  }

  useEffect(() => {
    check()

    const interval = setInterval(check, 5000)

    return () => clearInterval(interval)
  }, [])

  return quality
}
