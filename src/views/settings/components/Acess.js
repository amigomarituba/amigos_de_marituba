import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCloseButton,
  CCol,
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
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
  CSpinner,
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
import { useDispatch, useSelector } from 'react-redux'
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
  const dispatch = useDispatch()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const [visibleModal, setVisibleModal] = useState({ visible: false })

  const [valuePassWord, SetValuePassWord] = useState(null)

  const [textVisible, setTextVisible] = useState(false)
  const [textVisibleCreate, setTextVisibleCreate] = useState(false)

  const [check, setCheck] = useState(true)

  const [confirmeModal, setConfirmeModal] = useState({ visible: false })

  const [load, setLoad] = useState(false)

  const handleClose = () => {
    setAnchorEl(false)
  }

  const handleClick = (event, user) => {
    setAnchorEl(event.currentTarget)
  }

  const { register, handleSubmit, reset, setValue } = useForm()
  const [createAcess, setCreateAcess] = useState(false)
  const [lideres, setLideres] = useState([])
  const [acess, setAcess] = useState([])

  const [valueBuscarUser, setBuscarUser] = useState('')

  const onsubmit = async (data) => {
    try {
      const res = await instanceAxios.post('/login/create', data)
      setCreateAcess(!createAcess)
      if (res.status == 200) {
        dispatch({
          type: 'set',
          alert: {
            title: 'Usuarios',

            visible: true,
            color: 'success',
            message: 'Usuario adicionado com sucesso!!',
          },
        })
      }
    } catch {
      dispatch({
        type: 'set',
        alert: {
          title: 'Usuarios',

          visible: true,
          color: 'error',
          message: 'Erro ao criar usuario',
        },
      })
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
        setVisibleModal({ visible: false })
        dispatch({
          type: 'set',
          alert: {
            visible: true,
            color: 'success',
            title: 'Usuarios',
            message: 'Senha atualizada com sucesso',
          },
        })
      }
    }
  }

  const filterUsers = acess.filter((user) => {
    const text = valueBuscarUser?.toUpperCase()

    if (text == 'to'.toUpperCase()) {
      return user
    }

    return user.leader_name?.toUpperCase().includes(text) || user.level.toUpperCase().includes(text)
  })

  const handleRemoveUser = async (user_obj) => {
    if (!user_obj.delete) {
      setConfirmeModal({ visible: true, ...user_obj })
    } else {
      const res = await instanceAxios.delete(`/login/${user_obj.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      setCreateAcess(!createAcess)
      if (res.status == 200) {
        setConfirmeModal({ visible: false })
        dispatch({
          type: 'set',
          alert: {
            title: 'Usuarios',

            visible: true,
            color: 'success',
            message: 'Login removido com sucesso',
          },
        })
      }
    }
  }

  const api = async () => {
    const leader = await instanceAxios.get('/leader')

    if (leader.status == 200) {
      setLideres(leader.data)
    }

    setLoad(true)
    const { status, data } = await instanceAxios.get('/login')
    console.log(data)

    if (status == 200) {
      setAcess(data)
      setLoad(false)
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
                <CRow className="g-3 align-items-start">
                  <CCol lg={3} md={6} xs={12}>
                    <CInputGroup>
                      <CInputGroupText>Acesso</CInputGroupText>
                      <CFormSelect
                        aria-label="Floating label select example"
                        {...register('level', { required: true })}
                      >
                        <option value={'adm'}>Administrativo</option>
                        <option value={'usu'}>Usuário</option>
                      </CFormSelect>
                    </CInputGroup>
                  </CCol>

                  <CCol lg={5} md={6} xs={12}>
                    <CInputGroup className="m-md-0">
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

                  <CCol lg={'auto'} md={6} xs={12}>
                    <div>
                      <CInputGroup className="m-md-0">
                        <CFormInput
                          disabled={check}
                          type={textVisibleCreate ? 'text' : 'password'}
                          placeholder="Senha"
                          {...register('password')}
                        />

                        <CButton
                          disabled={check}
                          color="primary"
                          onClick={() => setTextVisibleCreate(!textVisibleCreate)}
                        >
                          {textVisibleCreate ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </CButton>
                      </CInputGroup>
                      <CFormCheck
                        id="passwdDefault"
                        label="Padrão"
                        {...register('defaults', { value: true })}
                        onClick={() => {
                          setCheck(!check)
                          setValue('password', '')
                        }}
                      />
                    </div>
                  </CCol>

                  <CCol lg="auto" md={'auto'} xs={12}>
                    {/* <div className="d-flex justify-content-center justify-content-md-end"> */}
                    <CButton
                      color="primary"
                      className="m-md-0 d-flex justify-content-center align-items-center "
                      type="submit"
                    >
                      <CIcon icon={cilPlus} size="xl" className="me-2" />
                      <strong>Adicionar</strong>
                    </CButton>
                    {/* </div> */}
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
                      <CFormInput
                        type="text"
                        label="Lider"
                        placeholder="buscar lider"
                        onChange={({ target }) => {
                          setBuscarUser(target.value)
                        }}
                      />
                    </CCol>

                    <CCol md={6}>
                      <CFormSelect
                        style={{ marginBottom: 3 }}
                        aria-label="Floating label select example"
                        label="Nivel de Acesso"
                        onChange={({ target }) => {
                          setBuscarUser(target.value)
                        }}
                      >
                        <option value={'to'}>Todos</option>
                        <option value={'adm'}>Administrativo</option>
                        <option value={'usu'}>Usuário</option>
                      </CFormSelect>
                    </CCol>
                  </CRow>
                  <CRow className="mt-2">
                    <CCol>
                      <CButton
                        variant="outline"
                        color="primary"
                        onClick={() => {
                          setBuscarUser('')
                        }}
                      >
                        Limpar Filtro
                      </CButton>
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
                  {load ? (
                    <CTableRow>
                      <CTableDataCell colSpan={5} className="text-center">
                        <CSpinner />
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    filterUsers.map((ac) => (
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
                              className="d-flex justify-content-center"
                              onClick={() => {
                                handleUpdatePassword(ac)
                              }}
                            >
                              <KeyIcon />
                            </CButton>

                            <CButton
                              color="primary"
                              variant="outline"
                              className="d-flex justify-content-center"
                            >
                              <EditIcon />
                            </CButton>

                            <CButton
                              color="danger"
                              variant="outline"
                              className="d-flex justify-content-center align-items-center"
                              onClick={() => handleRemoveUser(ac)}
                            >
                              <CIcon icon={cilTrash} size="lg" />
                            </CButton>
                          </div>

                          <CDropdown className="d-block d-md-none">
                            <CDropdownToggle>
                              <CIcon icon={cilOptions} size="lg" aria-haspopup="true" />
                            </CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem
                                onClick={() => {
                                  handleUpdatePassword(ac)
                                }}
                              >
                                <KeyIcon sx={{ marginRight: 1 }} />
                                Mudar Senha
                              </CDropdownItem>
                              <CDropdownItem>
                                <EditIcon sx={{ marginRight: 1 }} />
                                Editar
                              </CDropdownItem>
                              <CDropdownItem onClick={() => handleRemoveUser(ac)}>
                                <DeleteIcon sx={{ marginRight: 1 }} />
                                Deletar
                              </CDropdownItem>
                            </CDropdownMenu>
                          </CDropdown>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  )}
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

      <CModal
        visible={confirmeModal.visible}
        onClose={() => {
          setConfirmeModal({ visible: false })
        }}
      >
        <CModalHeader>
          <CModalTitle>Excluir Usuario</CModalTitle>
        </CModalHeader>

        <CModalBody>
          {`Tem certeza que deseja excluir o usuario ${confirmeModal?.leader_name?.toUpperCase()}?`}
          <br />
          <strong>Esta ação não poderá ser desfeita.</strong>
        </CModalBody>

        <CModalFooter>
          <CButton
            className="text-white"
            color="danger"
            onClick={() => {
              handleRemoveUser({ visible: false })
            }}
          >
            Cancelar
          </CButton>
          <CButton
            className="text-white"
            color="success"
            onClick={() => {
              handleRemoveUser({ ...confirmeModal, delete: true })
            }}
          >
            Confirmar
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default Acess
