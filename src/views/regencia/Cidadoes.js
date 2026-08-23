import { useCallback, useEffect, useRef, useState } from 'react'
import ModalDash from '../../components/Modal/ModalDash'
import HeaderSeach from '../../components/header/HeaderSeach'
import ListView from '../../components/ListView/ListView'
import CardCidadao from './Cards/CardCidadao'
import {
  CAlert,
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
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
  CHeader,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CPagination,
  CPaginationItem,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableFoot,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { Box } from '@mui/material'
import { cilOptions, cilUser } from '@coreui/icons'
import { useForm } from 'react-hook-form'
import { instanceAxios } from '../../config/api'
import AlertRegistre from '../../components/AlertRegistre/AlertRegistre'
import DialogModal from '../../components/DialogModal/DialogModal'
import { formatDate } from '../../utils/Utils'
import { useDispatch, useSelector } from 'react-redux'
import CardBody from 'rsuite/esm/Card/CardBody'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import PersonIcon from '@mui/icons-material/Person'
import { fomartCPF } from './Cards/Utils/FormatInput'
import CIcon from '@coreui/icons-react'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'
import HistoryIcon from '@mui/icons-material/History'
import { useModal, ModalData } from '../../components/Modal/ModalData'

const Cidadoes = () => {
  const [visible, open, close] = useModal()
  const [dataModal, setDataModal] = useState({})

  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const [input, setInput] = useState('')
  const [zoneInput, setZonesInput] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm()

  const [spinnnerState, setSpinnerState] = useState(false)

  const [create, setCreate] = useState(false) //atualizar a pagina

  const modalVisible = useRef() //referencia para abrir o modal

  const [visibleModalHistory, setVisibleModalHistory] = useState(false)
  const [agendamentos, setAgendamentos] = useState([])
  const [titleModal, setTitleModal] = useState('')

  const [services, setServices] = useState([])
  const [cidadao, setCidadao] = useState([])

  const [pages, setPages] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const limit = 50

  const [dialogModalVisible, setDialogModalVisible] = useState(false)
  const [deleteID, setDeleteID] = useState('')
  const [infoLider, setInfoLider] = useState({})

  const [alertOpen, setAlertOpen] = useState(false) //alerte de sucesso
  const [alertErro, setAlertErro] = useState(false) //alert de erro

  //stado de delete
  const [alertDeleteOpen, setAlertDeleteOpen] = useState(false)
  const [alertDeleteError, setAlertDeleteError] = useState(false)

  //ja registrado
  const [alertJaCriado, setAlertJaCriado] = useState(false)

  //metricas
  const [metricasCollapse, setMetricasCollapse] = useState(false)

  //com agendamentos
  const [alertAgendamentosFuturos, setAlertAgendamentosFuturos] = useState(false)

  const [zones, setZones] = useState([]) // lista as areas para cricar o lider

  const [leaders, setLeaders] = useState([])

  const [loadInit, setLoadInit] = useState(true)

  const getCitizenPages = async () => {
    setSpinnerState(true)
    const res = await instanceAxios.get('/citizen', {
      params: {
        pages,
        limit,
        input,
        zone: zoneInput,
      },
    })

    setCidadao(res.data.data)
    setTotalPages(res.data.pagination.totalPages)
    setSpinnerState(false)
  }

  const fillterCallback = async () => {
    setSpinnerState(true)
    if (input.trim() != '') {
      const { data } = await instanceAxios.get('/citizen/show', {
        params: { input: input.trim() },
      })

      if (data.length != 0) {
        setCidadao(data)
      } else {
        setCidadao([])
      }
    } else {
      setCidadao([])
    }

    setSpinnerState(false)
  }

  const handleClose = () => {
    setAlertOpen(false)
    setAlertErro(false)
  }

  const OnChangeArea = (e) => {
    if (e.target.name == 'isCidadao') {
      let codigo_lider_enabled = document.getElementsByName('gtLider')
      codigo_lider_enabled[0].disabled = e.target.value === 'true' ? false : true
    }
  }

  const onSubmit = async (cidadaoData) => {
    cidadaoData.name = cidadaoData.name.trim()

    let status = 0
    if (cidadaoData.edite) {
      delete cidadaoData.edite
      const { status } = await instanceAxios.post('/citizen/update', cidadaoData)

      if (status == 200) {
        dispatch({
          type: 'set',
          alert: {
            title: 'Cidadão',
            color: 'success',
            visible: true,
            message: 'Cidadão Atualizado com Sucesso !!!',
          },
        })
      } else {
        dispatch({
          type: 'set',
          alert: {
            title: 'Cadastrando Cidadão',
            color: 'error',
            visible: true,
            message: 'Error ao Atualizar Cidadão',
          },
        })
      }
    } else {
      const { status, data } = await instanceAxios.post('/citizen/create', cidadaoData)

      if (status == 200) {
        dispatch({
          type: 'set',
          alert: {
            title: 'Cadastrando Cidadão',
            color: 'success',
            visible: true,
            message: 'Cidadão Cadastrado com Sucesso !!!',
          },
        })
        setCidadao(data)
      }

      if (status == 202) {
        dispatch({
          type: 'set',
          alert: {
            title: 'Cadastrando Cidadão',
            color: 'warning',
            visible: true,
            message: 'Cidadão já Cadastrado !!!',
          },
        })
        setCidadao(data)
      }

      if (status == 401) {
        dispatch({
          type: 'set',
          alert: {
            title: 'Cidadão',
            color: 'error',
            visible: true,
            message: 'Error ao Criar Cidadão !!!',
          },
        })
      }
    }

    reset()
    modalVisible.current.visibleModal()
    setCreate(!create)
  }

  const handleDelete = (cidadao) => {
    setDialogModalVisible(true)
    setDeleteID(cidadao.id)
    setInfoLider(`${cidadao.name} de CPF ${cidadao.cpf} `)
  }
  const onCloseModal = () => {
    setDialogModalVisible(false)
  }

  const onConfirme = async () => {
    try {
      const { status, data } = await instanceAxios.delete(`/citizen/${deleteID}`)

      if (status == 200) {
        if (data.type == 'ca') {
          dispatch({
            type: 'set',
            alert: {
              title: 'Deletar Cidadão',
              color: 'warning',
              visible: true,
              message: 'Não é possivel deleta, cidadão ainda possue agendamentos futuros! ',
            },
          })
        } else {
          dispatch({
            type: 'set',
            alert: {
              title: 'Deletar Cidadão',
              color: 'success',
              visible: true,
              message: 'Deletado com Sucesso ',
            },
          })
          setCidadao([])
        }
      }
    } catch {
      dispatch({
        type: 'set',
        alert: {
          title: 'Error ao Deletar Cidadão',
          color: 'error',
          visible: true,
          message: 'Erro ao deletar cidadão ',
        },
      })
    }
    setDialogModalVisible(false)
    setDeleteID('')
    setCreate(!create)
  }

  const handleEditer = (cidadao) => {
    cidadao.edite = true

    modalVisible.current.visibleModal()

    reset(cidadao)
  }

  const handleHistorico = async (cidadao) => {
    const services = await instanceAxios.get(`/service`)
    const { data } = await instanceAxios.get(`/report/history/${cidadao.id}`)

    setMetricasCollapse(false)
    setServices(services.data)
    setVisibleModalHistory(true)
    setTitleModal(cidadao.name)
    setAgendamentos(data)
  }

  const handleButtonSalveModal = () => {
    document.getElementById('submitbtn').click()
  }

  const CloseAdd = () => {
    reset({})
  }

  const Leaders = useCallback(async () => {
    const { data } = await instanceAxios.get('/leader')

    setLeaders(data)
  }, [])

  const getZones = async () => {
    const zones = await instanceAxios.get('/zone')
    if (zones.status == 200) {
      setZones(zones.data)
    }
  }

  const handleSeach = (input) => {
    setInput(input)
    setPages(1)
  }

  useEffect(() => {
    if (loadInit) {
      Leaders()
      getZones()
      setLoadInit(false)
    }
    getCitizenPages()
  }, [pages, input, zoneInput])

  return (
    <CContainer fluid>
      <CRow>
        <CCol>
          <CCard className="w-100 p-3">
            <CardBody>
              <CRow>
                <CCol>
                  <div>
                    <h4>Cidadão</h4>
                    <span>Gerenciamento de Cidadãos no Sistema</span>
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
                    <span className="d-md-block d-none">Criar Novo Cidadão</span>
                  </CButton>
                </CCol>
              </CRow>
            </CardBody>
          </CCard>
        </CCol>
      </CRow>
      {/* <CRow className="mt-3">
        <CCol>
          <CCard>
            <CCardHeader>
              <CRow>
                <CCol>
                  <CInputGroup>
                    <CFormInput
                      type="text"
                      onChange={(e) => setInput(e.target.value)}
                      // label="Cidadão"
                      placeholder="Buscar por Nome/CPF/titulo"
                      // value={filterValue.type == 'text' ? filterValue.input : ''}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          fillterCallback()
                        }
                      }}
                    />

                    <CButton color="primary" variant="outline" onClick={fillterCallback}>
                      <SearchIcon />
                      Buscar
                    </CButton>
                  </CInputGroup>
                </CCol>
              </CRow>
            </CCardHeader>
          </CCard>
        </CCol>
      </CRow> */}

      <CRow className="mt-2">
        <CCol>
          <CCard>
            <CCardHeader>
              <CRow>
                <CCol>
                  <CInputGroup>
                    <CInputGroupText>cidadão</CInputGroupText>
                    <CFormInput
                      type="text"
                      input={input}
                      onChange={(e) => handleSeach(e.target.value)}
                      placeholder="Buscar por Nome/CPF/titulo"
                    />
                  </CInputGroup>
                </CCol>
                <CCol md={3}>
                  <CInputGroup>
                    <CInputGroupText>Área</CInputGroupText>
                    <CFormSelect
                      value={zoneInput}
                      onChange={(e) => {
                        setZonesInput(e.target.value)
                        setPages(1)
                      }}
                    >
                      <option value={''}>Todos</option>
                      {zones.map((zone) => (
                        <option value={zone.id}>{zone.name}</option>
                      ))}
                    </CFormSelect>
                  </CInputGroup>
                </CCol>
                <CCol>
                  <CInputGroup>
                    <CButton
                      color="primary"
                      variant="outline"
                      onClick={() => {
                        setInput('')
                        setZonesInput('')
                      }}
                    >
                      limpar filtro
                    </CButton>
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow className="mt-2">
                <CCol md={2}>
                  <div className="d-flex">
                    
                    <CBadge color="primary" style={{fontSize:17}}>Total: {cidadao.length}</CBadge>
                  </div>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <CTable className="mb-0">
                <CTableHead className="text-uppercase">
                  <CTableHeaderCell>nome</CTableHeaderCell>
                  <CTableHeaderCell>CPF</CTableHeaderCell>
                  <CTableHeaderCell>titulo</CTableHeaderCell>
                  <CTableHeaderCell>nascimento</CTableHeaderCell>
                  <CTableHeaderCell>área</CTableHeaderCell>
                  <CTableHeaderCell>contato</CTableHeaderCell>
                  <CTableHeaderCell>ações</CTableHeaderCell>
                </CTableHead>
                <CTableBody>
                  {!spinnnerState ? (
                    cidadao.map((cid) => (
                      <CTableRow>
                        <CTableDataCell>
                          <div className="d-flex align-items-center gap-2 text-uppercase">
                            <PersonIcon style={{ fontSize: 30 }} />
                            <span>{cid.name}</span>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>{fomartCPF(cid.cpf)}</CTableDataCell>
                        <CTableDataCell>{cid.titulo == '' ? '---' : cid.titulo}</CTableDataCell>
                        <CTableDataCell>{formatDate(cid.birth)}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color="info">{cid.zones?.name}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge
                            color={cid.citizens_contact.mode == 'lw' ? 'success' : 'primary'}
                            as={cid.citizens_contact.mode == 'lw' ? 'a' : 'span'}
                            href={`https://wa.me/55${cid.citizens_contact.ddd}${cid.citizens_contact.phone}`}
                            target="_blank"
                          >
                            <span>
                              {cid.citizens_contact.mode == 'lw' ? (
                                <WhatsAppIcon className="me-1" />
                              ) : (
                                <LocalPhoneIcon className="me-1" />
                              )}
                              ({cid.citizens_contact.ddd}){cid.citizens_contact.phone}
                            </span>
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CDropdown className="d-block">
                            <CDropdownToggle>
                              <CIcon icon={cilOptions} size="lg" aria-haspopup="true" />
                            </CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem
                                className="d-flex flex-row align-item-center gap-2"
                                onClick={() => {
                                  open()
                                  setDataModal(cid)
                                }}
                              >
                                <RemoveRedEyeIcon />
                                Infomações
                              </CDropdownItem>
                              <CDropdownItem
                                className="d-flex flex-row align-item-center gap-2"
                                onClick={() => {
                                  handleEditer(cid)
                                }}
                              >
                                <EditIcon className="me-2" />
                                Editar
                              </CDropdownItem>
                              <CDropdownItem
                                className="d-flex flex-row align-item-center gap-2"
                                onClick={() => {
                                  handleDelete(cid)
                                }}
                              >
                                <DeleteIcon className="me-2" />
                                Deletar
                              </CDropdownItem>

                              <CDropdownItem
                                className="d-flex flex-row align-item-center gap-2"
                                onClick={() => {
                                  handleHistorico(cid)
                                }}
                              >
                                <HistoryIcon className="me-2" />
                                Historico
                              </CDropdownItem>
                            </CDropdownMenu>
                          </CDropdown>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={7}>
                        <div className="d-flex justify-content-center">
                          <CSpinner />
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
                <CTableFoot>
                  <CTableRow>
                    <CTableDataCell colSpan={7} className="p-0 border-bottom-0">
                      <div className="d-flex justify-content-center">
                        <CPagination className="mt-4 mb-0">
                          {Array.from({ length: totalPages }, (_, index) => (
                            <CPaginationItem
                              key={index}
                              active={pages === index + 1}
                              onClick={() => setPages(index + 1)}
                            >
                              {index + 1}
                            </CPaginationItem>
                          ))}
                        </CPagination>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                </CTableFoot>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <ModalData
        visible={visible}
        close={close}
        data={dataModal}
        fields={{
          address: 'citizens_address',
          contact: 'citizens_contact',
        }}
      />

      <ModalDash
        title="Registra/Atualizar Cidadão"
        icon={cilUser}
        CloseAdd={CloseAdd}
        handleButtonSalveModal={handleButtonSalveModal}
        ref={modalVisible}
        isSpinner={isSubmitting}
        lider={false}
      >
        <ListView>
          <CContainer className="p-0">
            <CForm onSubmit={handleSubmit(onSubmit)}>
              <CFormInput
                type="text"
                floatingClassName="mb-3"
                floatingLabel="Nome"
                placeholder="nome"
                className="text-uppercase"
                {...register('name', { required: true })}
              />

              <CFormInput
                type="text"
                floatingLabel="CPF"
                maxLength={11}
                placeholder="cpf"
                {...register('cpf', {
                  required: 'Campo obrigatorio',
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'digite apenas numeros',
                  },
                })}
                className={!errors.cpf ? 'mb-3' : ''}
              />

              {errors.cpf && <span className="text-danger mb-3">{errors.cpf.message}</span>}

              <CFormInput
                type="text"
                floatingClassName="mb-3"
                floatingLabel="Titulo"
                placeholder="titulo"
                {...register('titulo')}
              />

              <CFormInput
                type="date"
                floatingClassName="mb-3"
                floatingLabel="Data de Nascimneto"
                placeholder="Data de Nascimneto"
                {...register('birth', { required: true })}
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
                    {...register('citizens_contact.ddd', { required: true })}
                  />
                </CCol>

                <CCol md={10} xs={8}>
                  <CFormInput
                    type="text"
                    id="nameArea"
                    maxLength={9}
                    floatingLabel="Telefone"
                    placeholder="991xxxxxxxx"
                    {...register('citizens_contact.phone')}
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
                    {...register('citizens_contact.mode', { required: true })}
                  />
                  <CFormCheck
                    type="radio"
                    button={{ color: 'primary', variant: 'outline' }}
                    name="btnradio"
                    id="btnradio2"
                    autoComplete="off"
                    label="Possui Whatsapp"
                    value={'lw'}
                    {...register('citizens_contact.mode', { required: true })}
                  />
                </CButtonGroup>
              </Box>

              <Box className="mt-2">
                <CFormLabel style={{ padding: 3 }}>Endereço</CFormLabel>

                <CRow xs={{ cols: 1 }} md={{ cols: 2 }}>
                  <CCol>
                    <CFormInput
                      type="text"
                      floatingClassName="mb-3"
                      floatingLabel="lougradoro"
                      className="text-uppercase"
                      placeholder="lougradoro"
                      {...register('citizens_address.street', { required: true })}
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
                          {...register('citizens_address.home', { required: true })}
                        />
                      </CCol>

                      <CCol>
                        <CFormInput
                          type="text"
                          id="nameArea"
                          floatingClassName="mb-3"
                          floatingLabel="Quadra"
                          placeholder="Quadra"
                          {...register('citizens_address.quatrain')}
                        />
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>

                <Box display={'flex'} gap={2}></Box>

                <CFormInput
                  type="text"
                  floatingClassName="mb-3"
                  floatingLabel="Complemento"
                  className="text-uppercase"
                  placeholder="Complento"
                  {...register('citizens_address.complement')}
                />

                <CFormInput
                  type="text"
                  floatingClassName="mb-3"
                  floatingLabel="Bairro"
                  className="text-uppercase"
                  placeholder="lougadoro"
                  {...register('citizens_address.district', { required: true })}
                />

                <CFormInput
                  type="text"
                  floatingClassName="mb-3"
                  floatingLabel="Cidade"
                  className="text-uppercase"
                  placeholder="lougadoro"
                  {...register('citizens_address.city')}
                />
              </Box>

              <Box>
                <CFormLabel style={{ padding: 3, fontWeight: 'bold' }}>
                  Lider Responsavel
                </CFormLabel>

                <CFormSelect
                  style={{ marginBottom: 3 }}
                  floatingLabel="Lider Responsáve"
                  aria-label="Floating label select example"
                  {...register('leader.id', { required: true })}
                >
                  <option value={''}>Sem Lider</option>
                  {leaders.map((leader) => {
                    return <option value={leader.id}> {leader.name}</option>
                  })}
                </CFormSelect>
              </Box>

              <Box>
                <CFormLabel style={{ padding: 3, fontWeight: 'bold' }}>Área Vinculada</CFormLabel>

                <CFormSelect
                  style={{ marginBottom: 3 }}
                  floatingLabel="Áreas"
                  aria-label="Floating label select example"
                  {...register('zone_id')}
                >
                  <option value={''}>Escolha a Área</option>
                  {zones.map((zone) => (
                    <option value={zone.id}> {zone.name}</option>
                  ))}
                </CFormSelect>
              </Box>

              <input type="submit" hidden id="submitbtn" />
            </CForm>
          </CContainer>
        </ListView>
      </ModalDash>

      <DialogModal
        visible={dialogModalVisible}
        messagem={`Você deseja apagar o cidadao ${infoLider} ?`}
        title={'Deleta Cidadao?'}
        onCloseModal={onCloseModal}
        onConfime={onConfirme}
      />

      <CModal
        size="xl"
        visible={visibleModalHistory}
        onClose={() => {
          setVisibleModalHistory(false)
          setTitleModal('')
        }}
        aria-labelledby="OptionalSizesExample1"
      >
        <CModalHeader>
          <CModalTitle id="OptionalSizesExample1">Histórico do Cidadão</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CModalTitle style={{ textAlign: 'center' }}>Serviços Agendados</CModalTitle>
          <CTable responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Data</CTableHeaderCell>
                <CTableHeaderCell scope="col">Servico</CTableHeaderCell>
                <CTableHeaderCell scope="col">Comparecimento</CTableHeaderCell>
                <CTableHeaderCell scope="col">Lider Vinculado</CTableHeaderCell>
                <CTableHeaderCell scope="col">Criado</CTableHeaderCell>
                <CTableHeaderCell scope="col">Registrador</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {agendamentos.map((agendamento, index) => {
                return (
                  <CTableRow key={index}>
                    <CTableDataCell>{agendamento.date_string}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={'secondary'}>{agendamento.service}</CBadge>
                    </CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center' }}>
                      {agendamento.presence ? (
                        <CBadge color={'primary'}>Presente</CBadge>
                      ) : (
                        <CBadge color={'danger'}>Ausente</CBadge>
                      )}
                    </CTableDataCell>

                    <CTableDataCell>{agendamento.leader}</CTableDataCell>
                    <CTableDataCell>{formatDate(agendamento.createdAt)}</CTableDataCell>
                    <CTableDataCell>{agendamento.registry_name}</CTableDataCell>
                  </CTableRow>
                )
              })}
            </CTableBody>
          </CTable>
        </CModalBody>
      </CModal>
    </CContainer>
  )
}

export default Cidadoes
