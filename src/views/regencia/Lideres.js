import React, { useEffect, useRef, useState } from 'react'
import { cilClipboard, cilOptions } from '@coreui/icons'
import ModalDash from '../../components/Modal/ModalDash'
import HeaderSeach from '../../components/header/HeaderSeach'
import ListView from '../../components/ListView/ListView'
import { useParams } from 'react-router-dom'
import {
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardHeader,
  CCol,
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CRow,
  CSpinner,
  CTab,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTooltip,
} from '@coreui/react'
import CardLider from './Cards/CardLider'
import { Box, Drawer } from '@mui/material'
import { instanceAxios } from '../../config/api'
import { useForm } from 'react-hook-form'
import AlertRegistre from '../../components/AlertRegistre/AlertRegistre'
import DialogModal from '../../components/DialogModal/DialogModal'
import { useDispatch, useSelector } from 'react-redux'
import CardBody from 'rsuite/esm/Card/CardBody'
import AddIcon from '@mui/icons-material/Add'
import BadgeIcon from '@mui/icons-material/Badge'
import { Col } from 'rsuite'
import { fomartCPF } from './Cards/Utils/FormatInput'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import CIcon from '@coreui/icons-react'
import { formatDate } from '../../utils/Utils'
import { ModalData, useModal } from '../../components/Modal/ModalData'

const Lideres = () => {
  const [visible, open, close] = useModal()

  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const [spinnnerState, setSpinnerState] = useState(false)

  const { fill } = useParams() // parametro de busca da url
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm() //fomulario

  const [lideres, setLideres] = useState([]) // dados do lider
  // const [areas, setAreas] = useState([]) // lista as areas para cricar o lider
  const [create, setCreate] = useState(false) //atualizar a pagina

  const [alertOpen, setAlertOpen] = useState(false) //alerte de sucesso
  const [alertErro, setAlertErro] = useState(false) //alert de erro

  const modalVisible = useRef() //referencia para abrir o modal

  const [dialogModalVisible, setDialogModalVisible] = useState(false)
  const [deleteID, setDeleteID] = useState('')
  const [infoLider, setInfoLider] = useState({})

  const [alertJaCriado, setAlertJaCriado] = useState(false)

  //stado de delete
  const [alertDeleteOpen, setAlertDeleteOpen] = useState(false)
  const [alertDeleteError, setAlertDeleteError] = useState(false)

  const [filterValue, setFilterValue] = useState({ type: '', input: '' })

  const [openDrawer, setOpenDrawer] = useState(false)

  const [dataModal, setDataModal] = useState({})

  const onCloseModal = () => {
    setDialogModalVisible(false)
  }

  const onConfirme = async () => {
    const { status } = await instanceAxios.delete(`/leader/${deleteID}`)

    if (status == 200) {
      setAlertDeleteOpen(true)
    } else {
      setAlertDeleteError(true)
    }

    setTimeout(() => {
      setAlertDeleteError(false)
      setAlertDeleteOpen(false)
    }, 3000)

    setDialogModalVisible(false)
    setDeleteID('')
    setCreate(!create)
  }

  const api = async () => {
    setSpinnerState(true)
    const { data } = await instanceAxios.get(`/leader`)
    setLideres(data)
    setSpinnerState(false)
  }

  const handleEditer = (LiderID) => {
    LiderID.edite = true
    modalVisible.current.visibleModal()
    reset(LiderID)
  }

  const handleDelete = async (lider) => {
    setDialogModalVisible(true)
    setDeleteID(lider.id)
    setInfoLider(`${lider.name} de codigo ${lider.uid}`)
  }

  const liderFiltrados = lideres.filter((item) => {
    const texto = filterValue.input.toLowerCase()

    return (
      item.name.toLowerCase().includes(texto) ||
      item.cpf.toLowerCase().includes(texto) ||
      item.uid.toLowerCase().includes(texto) ||
      item?.tag?.toLowerCase().includes(texto)
    )
  })

  const handleClose = () => {
    setAlertOpen(false)
    setAlertErro(false)
    setAlertJaCriado(false)
  }

  const onSubmit = async (liderData) => {
    liderData.registry_id = user.user.id

    if (liderData.edite) {
      delete liderData.edite
      delete liderData.zone

      const { status } = await instanceAxios.post('/leader/update', liderData)

      if (status == 200) {
        dispatch({
          type: 'set',
          alert: {
            title: 'Lider',
            color: 'success',
            visible: true,
            message: 'Lider Atualizado com Sucesso !!!',
          },
        })
      } else {
        dispatch({
          type: 'set',
          alert: {
            title: 'Lider',
            color: 'error',
            visible: true,
            message: 'Error ao Atualizar Lider',
          },
        })
      }
    } else {
      const { status } = await instanceAxios.post('/leader/create', liderData)

      if (status == 202) {
        dispatch({
          type: 'set',
          alert: {
            title: 'Lider',
            color: 'warning',
            visible: true,
            message: 'Lider já Cadastrado !!!',
          },
        })
      }

      if (status == 200) {
        dispatch({
          type: 'set',
          alert: {
            title: 'Lider',
            color: 'success',
            visible: true,
            message: 'Lider Criador com Sucesso !!!',
          },
        })
      }

      if (status == 401) {
        dispatch({
          type: 'set',
          alert: {
            title: 'Lider',
            color: 'error',
            visible: true,
            message: 'Error ao Criar Lider !!!',
          },
        })
      }
    }
    reset()
    modalVisible.current.visibleModal()
    setCreate(!create)
  }

  const handleButtonSalveModal = () => {
    document.getElementById('submitbtn').click()
  }

  useEffect(() => {
    api()
  }, [fill, create])

  const CloseAdd = () => {
    reset({})
  }

  // const handlerGetCEP = async () => {
  //   const cep = document.getElementById('cep')
  //   const {data} = await axios.get(`https://viacep.com.br/ws/${cep.value}/json/`)
  //   reset({})
  //   setAddress(data)
  // }

  const [phoneOne, setPhoneOne] = useState('')
  const handleSetPhoneOne = (value) => {
    setPhoneOne(value)
  }

  return (
    <CContainer fluid>
      <CRow>
        <CCol>
          <CCard className="w-100 p-3">
            <CardBody>
              <CRow>
                <CCol>
                  <div>
                    <h4>Lideres</h4>
                    <span>Gerenciamento de Lideres do Projeto</span>
                  </div>
                </CCol>

                <CCol className="d-flex align-items-center justify-content-end ">
                  <CButton
                    color="primary"
                    className="d-flex"
                    onClick={() => {
                      modalVisible.current.visibleModal()
                    }}
                  >
                    <AddIcon />
                    <span className="d-md-block d-none">Criar Novo Lider</span>
                  </CButton>
                </CCol>
              </CRow>

              <CRow className="mt-2">
                <CCol className="text-uppercase">
                  <CBadge
                    color="primary"
                    className="me-3"
                    style={{
                      fontSize: 14,
                    }}
                  >
                    Total de Lideres
                  </CBadge>
                  <strong>{lideres.length} registros</strong>
                </CCol>
              </CRow>
            </CardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow className="mt-3">
        <CCol>
          <CCard>
            <CCardHeader>
              <CRow>
                <CCol md={4} sx={'auto'}>
                  <CFormInput
                    type="text"
                    onChange={(e) => setFilterValue({ type: 'text', input: e.target.value })}
                    label="Lider"
                    placeholder="Buscar por Nome/Codigo/CPF"
                    value={filterValue.type == 'text' ? filterValue.input : ''}
                  />
                </CCol>

                <CCol md={3} sx={'auto'}>
                  <CFormSelect
                    disabled
                    label="tag"
                    onChange={(e) => setFilterValue({ type: 'select', input: e.target.value })}
                    value={filterValue.input}
                  >
                    <option value={''}>Todos</option>
                    <option value={'04319456246'}>04319456246</option>
                    <option value={'usu'}>Tag3</option>
                  </CFormSelect>
                </CCol>

                <CCol md={3} sx={'auto'} className="d-flex align-items-center mt-4">
                  <CButton
                    color="primary"
                    variant="outline"
                    onClick={() => setFilterValue({ type: '', input: '' })}
                  >
                    Limpar Filtro
                  </CButton>
                </CCol>
              </CRow>
            </CCardHeader>

            <CardBody className="p-2">
              <CTable responsive>
                <CTableHead className="text-uppercase">
                  <CTableHeaderCell>Lider</CTableHeaderCell>

                  <CTableHeaderCell>CPF</CTableHeaderCell>

                  <CTableHeaderCell className="d-md-block d-none">Codigo</CTableHeaderCell>

                  <CTableHeaderCell>Tag</CTableHeaderCell>
                  <CTableHeaderCell className="d-md-block d-none">Contato</CTableHeaderCell>

                  <CTableHeaderCell className="text-center">Ações</CTableHeaderCell>
                </CTableHead>
                <CTableBody>
                  {spinnnerState ? (
                    <CTableRow>
                      <CTableDataCell colSpan={5} className="text-center">
                        <CSpinner />
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    liderFiltrados.map((lider) => (
                      <CTableRow className="text-uppercase">
                        <CTableDataCell>
                          <div className="d-flex align-items-center gap-2">
                            <AccountCircleIcon
                              style={{
                                fontSize: 35,
                              }}
                            />

                            <span>{lider.name}</span>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>{fomartCPF(lider.cpf)}</CTableDataCell>
                        <CTableDataCell className="d-md-block d-none">{lider.uid}</CTableDataCell>
                        <CTableDataCell>TAG</CTableDataCell>
                        <CTableDataCell className="d-md-block d-none" style={{ fontSize: 19.5 }}>
                          <CBadge
                            color={lider.leaders_contact.mode == 'lw' ? 'success' : 'primary'}
                            as={lider.leaders_contact.mode == 'lw' ? 'a' : 'span'}
                            href={`https://wa.me/55${lider.leaders_contact.ddd}${lider.leaders_contact.phone}`}
                            target="_blank"
                          >
                            {lider.leaders_contact.mode == 'lw' ? (
                              <WhatsAppIcon className="me-1" />
                            ) : (
                              <LocalPhoneIcon className="me-1" />
                            )}
                            ({lider.leaders_contact.ddd}){lider.leaders_contact.phone}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell className="">
                          <CDropdown className="d-block">
                            <CDropdownToggle>
                              <CIcon icon={cilOptions} size="lg" aria-haspopup="true" />
                            </CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem
                                className="d-flex flex-row align-item-center gap-2"
                                onClick={() => {
                                  open()
                                  setDataModal(lider)
                                }}
                              >
                                <RemoveRedEyeIcon />
                                Infomações
                              </CDropdownItem>
                              <CDropdownItem
                                className="d-flex flex-row align-item-center gap-2"
                                onClick={() => handleEditer(lider)}
                              >
                                <EditIcon className="me-2" />
                                Editar
                              </CDropdownItem>
                              <CDropdownItem
                                className="d-flex flex-row align-item-center gap-2"
                                onClick={() =>
                                  handleDelete({ id: lider.id, name: lider.name, uid: lider.uid })
                                }
                              >
                                <DeleteIcon className="me-2" />
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
            </CardBody>
          </CCard>
        </CCol>
      </CRow>

      <DialogModal
        visible={dialogModalVisible}
        messagem={`Você deseja apagar o lider ${infoLider} ?`}
        title={'Deleta Lider?'}
        onCloseModal={onCloseModal}
        onConfime={onConfirme}
      />

      <ModalData visible={visible} close={close} data={dataModal} />

      <ModalDash
        title={`Registra/Atualizar Líder`}
        icon={cilClipboard}
        CloseAdd={CloseAdd}
        handleButtonSalveModal={handleButtonSalveModal}
        ref={modalVisible}
        isSpinner={isSubmitting}
        lider={false}
      >
        <ListView>
          <CContainer className="p-0">
            <CForm onSubmit={handleSubmit(onSubmit)}>
              <h5>Dados</h5>

              <CFormInput
                type="text"
                floatingClassName="mb-3"
                floatingLabel="Nome"
                placeholder="Nome do Lider"
                {...register('name', { required: true })}
              />

              <CFormInput
                type="text"
                maxLength={11}
                floatingLabel="CPF"
                placeholder="Nome do Lider"
                {...register('cpf', {
                  required: 'Campo Obrigatorio',
                  maxLength: 11,
                  pattern: {
                    value: /^[0-9]+$/,
                    message: ' digite apenas numeros',
                  },
                })}
                className={!errors.cpf ? 'mb-3' : ''}
              />

              {errors.cpf && <span className="text-danger mb-3">{errors.cpf.message}</span>}

              <CFormInput
                type="date"
                floatingClassName="mb-3"
                floatingLabel="Data de Nascimneto"
                placeholder="Data de Nascimneto"
                {...register('birth', { required: true })}
              />

              <CFormInput
                type="email"
                id="nameArea"
                floatingClassName="mb-3"
                floatingLabel="Email"
                placeholder="email@gmail.com"
                {...register('email')}
              />

              <h5>Contato</h5>

              <CRow className="g-2 mb-3">
                <CCol xs={4} md={2}>
                  <CFormInput
                    type="text"
                    id="nameArea"
                    maxLength={2}
                    floatingLabel="DDD"
                    placeholder="DDD"
                    {...register('leaders_contact.ddd', { required: true })}
                  />
                </CCol>

                <CCol md={10} xs={8}>
                  <CFormInput
                    type="text"
                    id="nameArea"
                    maxLength={9}
                    floatingLabel="Telefone"
                    placeholder="991xxxxxxxx"
                    {...register('leaders_contact.phone')}
                  />
                </CCol>
              </CRow>

              <Box
                sx={{
                  display: 'flex',
                  gap: 3,
                }}
              >
                <CButtonGroup role="group" aria-label="Basic checkbox toggle button group">
                  <CFormCheck
                    type="radio"
                    button={{ color: 'primary', variant: 'outline' }}
                    name="btnradio"
                    id="btnradio1"
                    autoComplete="off"
                    value={'lg'}
                    label="Apenas Ligacação"
                    {...register('leaders_contact.mode', { required: true })}
                  />
                  <CFormCheck
                    type="radio"
                    button={{ color: 'primary', variant: 'outline' }}
                    name="btnradio"
                    id="btnradio2"
                    autoComplete="off"
                    label="Possui Whatsapp"
                    value={'lw'}
                    {...register('leaders_contact.mode', { required: true })}
                  />
                </CButtonGroup>
              </Box>

              <Box className="mt-3">
                <h5>Endereço</h5>

                <CRow xs={{ cols: 1 }} md={{ cols: 2 }}>
                  <CCol>
                    <CFormInput
                      type="text"
                      floatingClassName="mb-3"
                      floatingLabel="lougradoro"
                      placeholder="lougradoro"
                      {...register('leaders_address.street', { required: true })}
                    />
                  </CCol>

                  <CCol>
                    <CRow>
                      <CCol>
                        <CFormInput
                          type="text"
                          floatingClassName="mb-3"
                          floatingLabel="Casa"
                          placeholder="numero"
                          {...register('leaders_address.home', { required: true })}
                        />
                      </CCol>

                      <CCol>
                        <CFormInput
                          type="text"
                          floatingClassName="mb-3"
                          floatingLabel="Quadra"
                          placeholder="Quadra"
                          {...register('leaders_address.quatrain')}
                        />
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>

                <CFormInput
                  type="text"
                  floatingClassName="mb-3"
                  floatingLabel="Complemento"
                  placeholder="Complento"
                  {...register('leaders_address.complement')}
                />

                <CFormInput
                  type="text"
                  floatingClassName="mb-3"
                  floatingLabel="Bairro"
                  placeholder="bairro"
                  {...register('leaders_address.district', { required: true })}
                />

                <CFormInput
                  type="text"
                  floatingClassName="mb-3"
                  floatingLabel="Cidade"
                  placeholder="Cidade"
                  {...register('leaders_address.city', { required: true })}
                />
              </Box>

              {/* <Box>
                <CFormLabel style={{ padding: 3, fontWeight: 'bold' }}>
                  Área Responsavel
                </CFormLabel>

                <CFormSelect
                  style={{ marginBottom: 3 }}
                  floatingLabel="Área Responsável"
                  aria-label="Floating label select example"
                  {...register('zone_uid',{required:true})}
                >
                  <option value={''}>Escolha a Área</option>
                  {
                    areas.map((area) =>

                      <option value={area.uid}> {area.type} {area.zone} </option>
                    )
                  }
                </CFormSelect>
              </Box> */}
              <input type="submit" hidden id="submitbtn" />
            </CForm>
          </CContainer>
        </ListView>
      </ModalDash>
    </CContainer>
  )
}

export default Lideres
