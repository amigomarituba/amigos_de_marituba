import { CFormInput, CFormLabel, CListGroup, CListGroupItem } from '@coreui/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { instanceAxios } from '../config/api'
import { formatDate } from '../utils/Utils'
import { fomartCPF } from '../views/regencia/Cards/Utils/FormatInput'
import CIcon from '@coreui/icons-react'
import { cilUser } from '@coreui/icons'

function SelectChange({ value, onChange }) {
  const [search, setSearch] = useState('')
  const [result, setResult] = useState([])
  const [show, setShow] = useState(false)

  const handleSearch = async (e) => {
    const value = e.target.value

    setSearch(value)

    if (!value) {
      setResult([])
      setShow(false)
      return
    }

    const { data } = await instanceAxios.get('/citizen/show', {
      params: { input: value },
    })

    setResult(data)
    setShow(true)
  }

  return (
    <>
      <CFormInput
        placeholder="Buscar..."
        floatingLabel="Buscar Cidadão"
        onChange={handleSearch}
        onFocus={() => search && setShow(true)}
        onBlur={() =>
          setTimeout(() => {
            setShow(false)
          }, 200)
        }
        className='text-uppercase'
        value={search}
      />

      {show &&
        (result.length == 0 ? (
          <CListGroup>
            <CListGroupItem>Nenhum Resultado Encontrado</CListGroupItem>
          </CListGroup>
        ) : (
          <CListGroup>
            {result.map((item) => (
              <CListGroupItem
                key={item.id}
                as="a"
                href="#"
                onClick={() => {
                  setSearch(item.name)
                  setShow(false)
                  onChange(item.id)
                }}
              >
                <span>
                  <div className="text-uppercase fw-bold">
                    <CIcon icon={cilUser} size="lg" className="me-1" />
                    {item.name}
                  </div>
                  <div style={{ fontSize: 15 }}>CPF: {fomartCPF(item.cpf)}</div>
                  <div style={{ fontSize: 15 }}>D.N: {formatDate(item.birth)}</div>
                  <div style={{ fontSize: 15 }}>Lider: {item.leader.name}</div>
                </span>
              </CListGroupItem>
            ))}
          </CListGroup>
        ))}
    </>
  )
}

export default SelectChange
