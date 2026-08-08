import {
  CFormInput,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'

import { useEffect, useState } from 'react'
import { instanceAxios } from '../config/api'
import { formatDate } from '../utils/Utils'
import { fomartCPF } from '../views/regencia/Cards/Utils/FormatInput'
import CIcon from '@coreui/icons-react'
import { cilUser } from '@coreui/icons'

function SelectChange({ value, onChange }) {
  const [search, setSearch] = useState('')
  const [result, setResult] = useState([])
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!search) {
      setResult([])
      setShow(false)
      return
    }

    const timer = setTimeout(async () => {
      try {
        const { data } = await instanceAxios.get('/citizen/show', {
          params: {
            input: search,
          },
        })

        setResult(data)
        setShow(true)
      } catch (error) {
        console.error('Erro ao buscar cidadão:', error)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [search])

  const handleSelect = (item) => {
    setSearch(item.name)
    setShow(false)

    // Valor que será salvo pelo React Hook Form
    onChange(item.id)
  }

  return (
    <>
      <CFormInput
        placeholder="Buscar..."
        floatingLabel="Buscar Cidadão"
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => {
          if (search) {
            setShow(true)
          }
        }}
        onBlur={() => {
          setTimeout(() => {
            setShow(false)
          }, 200)
        }}
        className="text-uppercase"
        value={search}
      />

      {show && (
        <CListGroup>
          {result.length === 0 ? (
            <CListGroupItem>
              Nenhum Resultado Encontrado
            </CListGroupItem>
          ) : (
            result.map((item) => (
              <CListGroupItem
                key={item.id}
                as="a"
                href="#"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(item)}
              >
                <div className="text-uppercase fw-bold">
                  <CIcon
                    icon={cilUser}
                    size="lg"
                    className="me-1"
                  />

                  {item.name}
                </div>

                <div style={{ fontSize: 15 }}>
                  CPF: {fomartCPF(item.cpf)}
                </div>

                <div style={{ fontSize: 15 }}>
                  D.N: {formatDate(item.birth)}
                </div>

                <div style={{ fontSize: 15 }}>
                  Lider: {item.leader.name}
                </div>
              </CListGroupItem>
            ))
          )}
        </CListGroup>
      )}
    </>
  )
}

export default SelectChange