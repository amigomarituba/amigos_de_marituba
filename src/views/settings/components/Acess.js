import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCloseButton,
  CCol,
  CContainer,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CFormText,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CPopover,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { Box, Button, Menu, MenuItem } from '@mui/material'
import { useForm } from 'react-hook-form'
import { instanceAxios } from '../../../config/api'
import { useEffect, useState } from 'react'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import PersonIcon from '@mui/icons-material/Person'
import EditIcon from '@mui/icons-material/Edit'
import KeyIcon from '@mui/icons-material/Key'
import { useSelector } from 'react-redux'
import CIcon from '@coreui/icons-react'
import { cilCreditCard, cilOptions, cilPlus, cilSearch, cilTrash, cilUser } from '@coreui/icons'
import DeleteIcon from '@mui/icons-material/Delete'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import FingerprintIcon from '@mui/icons-material/Fingerprint'
import { fomartCPF } from '../../regencia/Cards/Utils/FormatInput'

import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

const Acess = () => {
  const user = useSelector((state) => state.user)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const [visibleModal, setVisibleModal] = useState({ visible: false })
  const [updatePassWord, setUpdatePassWord] = useState({})
  const [valuePassWord, SetValuePassWord] = useState(null)

  const [textVisible, setTextVisible] = useState(false)
  const [textVisibleCreate, setTextVisibleCreate] = useState(false)

  const handleClose = () => {
    setAnchorEl(false)
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

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

  const handleUpdatePassword = async (user_obj) => {
    if (!user_obj.update) {
      setVisibleModal({ visible: true, ...user_obj })
    } else {
      const res = await instanceAxios.post(
        `/login/update`,
        { id: user_obj.id, newpassword: valuePassWord },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      if (res.status == 200) {
        console.log(res.data.msg)

        setVisibleModal({ visible: false })
      }
    }
  }

  const handleRemoveUser = async (id) => {
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
    <CContainer fluid>
      <CRow className="mt-4">
        <h3 className="mb-3">Gerenciamento de Usuarios </h3>

        <CCol lg={12} className="mb-3">
          <CCard>
            <CCardHeader>
              <strong>Adicionar novo usuario ao sistema</strong>
            </CCardHeader>
            <CCardBody>
              <form onSubmit={handleSubmit(onsubmit)}>
                <CRow>
                  <CCol xs={12} md={3}>
                    <CInputGroup>
                      <CInputGroupText>Acesso</CInputGroupText>
                      <CFormSelect
                        style={{ marginBottom: 3 }}
                        aria-label="Floating label select example"
                        {...register('level', { required: true })}
                      >
                        <option value={'adm'}>Administrativo</option>
                        <option value={'usu'}>Usuário</option>
                      </CFormSelect>
                    </CInputGroup>
                  </CCol>
                  <CCol xs={12} md={5}>
                    <CInputGroup className="m-md-0 mt-3">
                      <CInputGroupText>Lider</CInputGroupText>
                      <CFormSelect
                        style={{ marginBottom: 3 }}
                        aria-label="Floating label select example"
                        {...register('leader_id', { required: true })}
                      >
                        <option value={''}>Selecionar Lider</option>
                        {lideres.map((lider) => (
                          <option value={lider.id}>{lider.name}</option>
                        ))}
                      </CFormSelect>
                    </CInputGroup>
                  </CCol>

                  <CCol xs={12} md={'auto'}>
                    <div>
                      <CInputGroup className="m-md-0 mb-3 mt-3">
                        <CFormInput
                          type={textVisibleCreate ? 'text' : 'password'}
                          placeholder="Senha"
                          {...register('password', { required: true })}
                          disabled
                        />

                        <CButton
                          color="primary"
                          onClick={() => setTextVisibleCreate(!textVisibleCreate)}
                          disabled
                        >
                          {textVisibleCreate ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </CButton>
                      </CInputGroup>
                      <CFormCheck
                        
                        id="passwdDefault"
                        label="Deixar senha padrão(data de nascimento)"
                        {...register('defaults', { value: true })}
                        disabled
                      />
                    </div>
                  </CCol>
                </CRow>

                <CRow className="d-flex justify-content-end h-100 mt-3">
                  <CCol xs={12} md={2}>
                    <div className="d-flex h-100">
                      <CButton
                        color="primary"
                        className="w-100 w-md-auto m-md-0 d-flex align-items-center "
                        type="submit"
                      >
                        <CIcon icon={cilPlus} size="xl" className="me-2" />
                        <strong>Adicionar</strong>
                      </CButton>
                    </div>
                  </CCol>
                </CRow>
              </form>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={12}>
          <CCard>
            <CCardHeader>
              <CRow className="d-flex align-items-center">
                <CCol xs={12} lg={5}>
                  <h5>Usuarios com Acessos</h5>
                  <small>lista de lideres com acesso ao sistema</small>
                </CCol>
                <CCol>
                  <CRow>
                    <CCol md={6}>
                      <CFormInput type="text" label="Lider" placeholder="buscar lider" disabled/>
                    </CCol>

                    <CCol md={6}>
                      <CFormSelect
                        style={{ marginBottom: 3 }}
                        aria-label="Floating label select example"
                        label="Nivel de Acesso"
                        disabled
                        {...register('level', { required: true })}
                      >
                        <option value={'to'} defaultValue={'todos'}>
                          Todos
                        </option>

                        <option value={'adm'}>Administrativo</option>
                        <option value={'usu'}>Usuário</option>
                      </CFormSelect>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <CTable responsive>
                <CTableHead>
                  <CTableHeaderCell>Lider</CTableHeaderCell>
                  <CTableHeaderCell>CPF</CTableHeaderCell>
                  <CTableHeaderCell>Nivel</CTableHeaderCell>
                  <CTableHeaderCell>Tag</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Ações</CTableHeaderCell>
                </CTableHead>
                <CTableBody>
                  {acess.map((ac) => (
                    <CTableRow>
                      <CTableDataCell>{ac.leader_name.toUpperCase()}</CTableDataCell>
                      <CTableDataCell>{fomartCPF(ac.cpf)}</CTableDataCell>

                      <CTableDataCell>
                        <CBadge color={ac.level == 'adm' ? 'primary' : 'info'}>
                          {ac.level == 'adm' ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                          {ac.level == 'adm' ? 'Administrador' : 'Usuario'}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>Tag</CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex justify-content-center gap-2 d-none d-md-flex">
                          <CButton
                            color="primary"
                            variant="outline"
                            className="d-flex justify-content-center w-25"
                            onClick={() => handleUpdatePassword(ac)}
                          >
                            <KeyIcon />
                          </CButton>
                          {/* <CButton
                            color="info"
                            variant="outline"
                            className="w-25"
                            className="d-flex justify-content-center"
                          >
                            <EditIcon />
                          </CButton> */}
                          <CButton
                            color="danger"
                            variant="outline"
                            className="d-flex justify-content-center w-25"
                            onClick={() => handleRemoveUser(ac.id)}
                          >
                            <CIcon icon={cilTrash} size="lg" />
                          </CButton>
                        </div>

                        <Button
                          id="basic-button"
                          aria-controls={open ? 'basic-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? 'true' : undefined}
                          onClick={handleClick}
                          className="d-block d-md-none"
                        >
                          <CIcon icon={cilOptions} size="lg" aria-haspopup="true" />
                        </Button>

                        <Menu
                          id="basic-menu"
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                          MenuListProps={{
                            'aria-labelledby': 'basic-button',
                          }}
                        >
                          <MenuItem onClick={() => handleUpdatePassword(ac)}>
                            <EditIcon sx={{ marginRight: 1 }} />
                            Mudar Senha
                          </MenuItem>

                          <MenuItem onClick={() => handleRemoveUser(ac.id)}>
                            <DeleteIcon sx={{ marginRight: 1 }} />
                            Deletar
                          </MenuItem>
                        </Menu>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal
        visible={visibleModal.visible}
        onClose={() => {
          setVisibleModal({ visible: false })
        }}
      >
        <CModalHeader>
          <CModalTitle>Mudar Senha</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <h5>
            <CIcon icon={cilUser} className="me-3" size="xl" />
            {visibleModal?.leader_name?.toUpperCase()}
          </h5>

          <div className="d-flex align-item-center gap-3">
            <FingerprintIcon />
            <p className="mb-3"> CPF: {fomartCPF(String(visibleModal?.cpf))}</p>
          </div>

          <CInputGroup>
            <CFormInput
              type={textVisible ? 'text' : 'password'}
              placeholder="Nova Senha"
              onChangeCapture={(e) => {
                SetValuePassWord(e.target.value)
              }}
            />
            <CButton color="primary" onClick={() => setTextVisible(!textVisible)}>
              {textVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </CButton>
          </CInputGroup>

          <p className="mt-2 text-warning">
            Para maior segurança, recomenda-se criar uma senha com pelo menos 8 caracteres, contendo
            letras maiúsculas, letras minúsculas, números e símbolos (como @, !, %, #, etc.).
          </p>
        </CModalBody>
        <CModalFooter>
          <CButton
            className="text-white"
            color="danger"
            onClick={() => {
              setVisibleModal({ visible: false })
            }}
          >
            Cancelar
          </CButton>
          <CButton
            className="text-white"
            color="success"
            onClick={() => {
              handleUpdatePassword({ ...visibleModal, update: true })
            }}
          >
            Salvar
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default Acess
