import {
  CBadge,
  CButton,
  CCard,
  CCardHeader,
  CCloseButton,
  CCol,
  CContainer,
  CFormSelect,
  CPopover,
  CRow,
} from '@coreui/react'
import { Box } from '@mui/material'
import { useForm } from 'react-hook-form'
import { instanceAxios } from '../../../config/api'
import { useEffect, useState } from 'react'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import PersonIcon from '@mui/icons-material/Person'
import { useSelector } from 'react-redux'

const Acess = () => {
  const user = useSelector((state) => state.user)

  const { register, handleSubmit, reset } = useForm()
  const [createAcess, setCreateAcess] = useState(false)
  const [lideres, setLideres] = useState([])
  const [acess, setAcess] = useState([])
  const [over, setOver] = useState(false)

  const onsubmit = async (data) => {
    try {
      const { status } = await instanceAxios.post('/login/create', data)
      setCreateAcess(!createAcess)
    } catch {
      setOver(true)
      setTimeout(() => {
        setOver(false)
      }, 2000)
    }
  }

  const handleRemoveService = async (id) => {
    const { status } = await instanceAxios.delete(`/login/${id}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
    if (status == 200) {
      setCreateAcess(!createAcess)
    }
  }

  const api = async () => {
    const { status, data } = await instanceAxios.get('/login')
    const leader = await instanceAxios.get('/leader')

    if (status == 200) {
      setAcess(data)
    }

    if (leader.status == 200) {
      setLideres(leader.data)
    }

    reset({})
  }

  useEffect(() => {
    api()
  }, [createAcess])

  return (
    <>
      <h4 className="mb-3">Acesso</h4>
      <CCol>
        <CRow>
          <CPopover
            title={`Acesso Duplicado !!!`}
            trigger={[]}
            visible={over}
            content="Uma lider não pode ter mais de um acesso"
            placement="top"
          >
            <h5>Lideres</h5>
          </CPopover>
        </CRow>

        <form onSubmit={handleSubmit(onsubmit)}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 3,
            }}
          >
            <Box
              sx={{
                width: '100%',
              }}
            >
              <CFormSelect
                style={{ marginBottom: 3 }}
                floatingLabel="Lideres"
                aria-label="Floating label select example"
                {...register('leader_id', { required: true })}
              >
                <option value={''}>Selecionar Lider</option>
                {lideres.map((lider) => (
                  <option value={lider.id}>
                    {lider.uid} - {lider.name}
                  </option>
                ))}
              </CFormSelect>
            </Box>

            <Box
              sx={{
                width: '40%',
              }}
            >
              <CFormSelect
                style={{ marginBottom: 3 }}
                floatingLabel="Nivel"
                aria-label="Floating label select example"
                {...register('level', { required: true })}
              >
                <option value={'adm'}>Administrativo</option>
                <option value={'usu'}>Usuário</option>

                {/* {
                                    lideres.map((lider) =>
                                        <option value={lider.id}>
                                            {lider.uid}  / {lider.name}
                                        </option>
                                    )
                                } */}
              </CFormSelect>
            </Box>
          </Box>

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              marginTop: 2,
            }}
          >
            <Box
              sx={{
                width: '50%',
              }}
            >
              <CButton type="submit" color="success" style={{ color: '#fff', width: '100%' }}>
                Registrar
              </CButton>
            </Box>
          </Box>
        </form>
      </CCol>

      <CCol>
        <h5>Acesso ao Sistema</h5>

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: 'auto auto',
          }}
        >
          {acess.map((acess, index) => {
            if (acess.id != user.user.id) {
              return (
                <CBadge
                  key={index}
                  color="secondary"
                  style={{
                    fontSize: 13,
                    textTransform: 'uppercase',
                    justifyItems: 'center',
                  }}
                >
                  {acess.level == 'adm' ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                  {acess.level == 'adm' ? 'adm ' : 'usuário '}

                  {acess.leader_name}
                  <CCloseButton
                    style={{ marginLeft: 15, color: '#fff' }}
                    onClick={() => handleRemoveService(acess.id)}
                  />
                </CBadge>
              )
            }
          })}
        </Box>
      </CCol>
    </>
  )
}

export default Acess
