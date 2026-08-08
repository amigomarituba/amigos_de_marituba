import {
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CCollapse,
  CContainer,
  CFooter,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'
import { Box, Card, CardHeader, Collapse } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { Calendar, Col } from 'rsuite'
import 'rsuite/Calendar/styles/index.css'
import ModalDash from '../../../components/Modal/ModalDash'
import { cilCalendar, cilPin, cilSearch } from '@coreui/icons'
import CardAgendamento from './Cards/CardAgendamento'
import ListView from '../../../components/ListView/ListView'
import { useForm, Controller } from 'react-hook-form'
import { instanceAxios } from '../../../config/api'
import DialogModal from '../../../components/DialogModal/DialogModal'
import AlertRegistre from '../../../components/AlertRegistre/AlertRegistre'
import { formatDate, formatDateN } from '../../../utils/Utils'
import { fomartCPF } from '../../regencia/Cards/Utils/FormatInput'
import SelectChange from '../../../components/SelectChange'
import { object } from 'prop-types'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import AddIcon from '@mui/icons-material/Add'
import CardBody from 'rsuite/esm/Card/CardBody'
import CardFooter from 'rsuite/esm/Card/CardFooter'
import CardInfo from './Cards/CardInfo'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'
import ArticleIcon from '@mui/icons-material/Article'
import CancelIcon from '@mui/icons-material/Cancel'
import CIcon from '@coreui/icons-react'
import { dataExtenso } from '../../regencia/Cards/Utils/DataExplit'
import { useDispatch } from 'react-redux'

import AccountBoxIcon from '@mui/icons-material/AccountBox'
import BarChartIcon from '@mui/icons-material/BarChart'

const Agendamentos = () => {
  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm() //fomulario

  const dispatch = useDispatch()

  const [create, setCreate] = useState(false)
  const [dayNow, setDayNow] = useState('')

  const [spinnnerState, setSpinnerState] = useState(false)

  const [inputCidadao, setInputCidadao] = useState('')

  const [listaCidadoes, setListaCidadoes] = useState([])

  const [day, setDay] = useState([])
  const [marcadoDia, setMarcadoDia] = useState([])

  const modalVisible = useRef() //referencia para abrir o modal

  const [lideres, setLideres] = useState([])
  const [servicos, setServicos] = useState([])

  const [dialogModalVisible, setDialogModalVisible] = useState(false)
  const [deleteID, setDeleteID] = useState({})
  const [info, setInfo] = useState({})

  const [alertOpen, setAlertOpen] = useState(false) //alerte de sucesso
  const [alertErro, setAlertErro] = useState(false) //alert de erro

  //stado de delete
  const [alertDeleteOpen, setAlertDeleteOpen] = useState(false)
  const [alertDeleteError, setAlertDeleteError] = useState(false)

  const [alertNotSheduller, setAlertNotSheduller] = useState(false)

  const [filterServices, setFilterServices] = useState([])

  const [valueBuscarAgendado, setBuscarAgendado] = useState('')
  const [visibleCollapse, setVisibleCollapse] = useState(false)

  const handleClose = () => {
    setAlertOpen(false)
    setAlertErro(false)
  }

  const onCloseModal = () => {
    setDialogModalVisible(false)
  }

  const onConfirme = async () => {
    const { status } = await instanceAxios.delete(`/scheduling/${deleteID.id}`)

    if (status == 200) {
      dispatch({
        type: 'set',
        alert: {
          title: 'Agendamento',
          visible: true,
          color: 'success',
          message: 'Agendamento deletado com sucesso!!',
        },
      })

      console.log(deleteID)

      const data = await apiDayShow(formatDateN(deleteID.date_string))

      console.log(data)

      setDialogModalVisible(false)
      setDeleteID({})
      setBuscarAgendado('')
      setDay(data)
    } else {
      dispatch({
        type: 'set',
        alert: {
          title: 'Agendamento',
          visible: true,
          color: 'error',
          message: 'Erro ao deletar serviço',
        },
      })
      setDeleteID('')
      setDialogModalVisible(false)
    }
  }

  const apiDayShow = async (date) => {
    setSpinnerState(true)

    try {
      const { data } = await instanceAxios.get('/scheduling/show', {
        params: { date: date },
      })

      const filter_count_service = data.reduce((count, item) => {
        const key = item?.service
        if (!count[key]) {
          count[key] = 0
        }
        count[key] += 1

        return count
      }, {})

      setFilterServices(filter_count_service)

      return data
    } catch {
      throw Error()
    } finally {
      setSpinnerState(false)
    }
  }

  const handleSelectDay = async (date) => {
    const dateF = formatDateN(date)
    const data = await apiDayShow(dateF)
    setDayNow(dateF)
    try {
      setDay(data)
    } catch {
      setDay([])
    }
  }

  const onsubmit = async (agendamento) => {
    if (dayNow == '') {
      agendamento.date = formatDateN(new Date())
    } else {
      agendamento.date = formatDateN(dayNow)
    }

    const date_after = new Date(agendamento.date).setHours(0, 0, 0, 0)

    const date_now = new Date().setHours(0, 0, 0, 0)

    agendamento.presence = false
    agendamento.regulation = false

    const res = await instanceAxios.post('/scheduling/create', agendamento)

    if (res.status == 200) {
      modalVisible.current.visibleModal()

      dispatch({
        type: 'set',
        alert: {
          title: 'Agendamento',
          visible: true,
          color: 'success',
          message: 'Agendado com Sucesso',
        },
      })

      const data = await apiDayShow(agendamento.date)
      setDay(data)
    } else {
      dispatch({
        type: 'set',
        alert: {
          title: 'Agendamento',
          visible: true,
          color: 'error',
          message: 'Erro ao agendar cidadão',
        },
      })
      modalVisible.current.visibleModal()
    }
  }

  const handleButtonSalveModal = () => {
    document.getElementById('submitbtn').click()
  }

  const filterAgendados = day.filter((day) => {
    const texto = valueBuscarAgendado.toLowerCase()

    return day.name.toLowerCase().includes(texto) || day.cpf.toLowerCase().includes(texto)
  })

  const sendCidadoes = async () => {
    const { data } = await instanceAxios.get('/citizen/show', {
      params: { input: inputCidadao },
    })
    setListaCidadoes(data)
  }

  const handleCidadao = (e) => {
    setInputCidadao(e.target.value)
  }

  const renderCellDay = (date) => {
    let dataF = formatDate(date)

    const d = marcadoDia.map((day) => {
      let show = day.date_string == formatDate(date) ? true : false

      if (show) {
        return (
          <div
            color="primary"
            style={{
              marginTop: 27,
              borderRadius: 50,
              width: 24,
              height: 5,
              backgroundColor: 'rgba(128, 155, 255, 0.41)',
              position: 'absolute',
            }}
          ></div>
        )
      }
    })

    return d
  }

  const handleRegulacao = async (dataR) => {
    const { data, status } = await instanceAxios.post(`/scheduling/update`, dataR)
    if (status == 200) {
      dispatch({
        type: 'set',
        alert: {
          title: 'Agendamento',
          visible: true,
          color: 'info',
          message: 'Atualizado com sucesso!!!',
        },
      })
      const data = await apiDayShow(formatDateN(dataR.date_string))
      setDay(data)
    }
  }

  const handleConfimeAgendamento = async (dataC) => {
    const { data, status } = await instanceAxios.post(`/scheduling/update`, dataC)
    if (status == 200) {
      dispatch({
        type: 'set',
        alert: {
          title: 'Agendamento',
          visible: true,
          color: 'info',
          message: 'Atualizado com sucesso!!!',
        },
      })
      const data = await apiDayShow(formatDateN(dataC.date_string))
      setDay(data)
    }
  }

  const handleDeleteAgendamento = async (data) => {
    setDialogModalVisible(true)
    setDeleteID(data)
    setInfo(`${data.name} da data ${data.date_string}`)
  }

  const ListCardAgenda = ({ data }) => {
    if (data.length != 0) {
      return data.map((day, index) => {
        return (
          <CardAgendamento
            key={index}
            data={day}
            confimeAgendamento={handleConfimeAgendamento}
            deleteAgendamento={handleDeleteAgendamento}
            regulacao={handleRegulacao}
          />
        )
      })
    } else {
      return (
        <h5
          className="mt-3"
          style={{ textAlign: 'center', color: 'rgba(244,244,244,.3)', textTransform: 'uppercase' }}
        >
          Sem Agendamento
        </h5>
      )
    }
  }

  const CloseAdd = () => {
    reset({})
    setInputCidadao('')
    setListaCidadoes([])
  }

  const api = async () => {
    setSpinnerState(true)

    try {
      const scheduling = await instanceAxios.get(`/scheduling`)

      setMarcadoDia(scheduling.data)

      const leaders = await instanceAxios.get(`/leader`)
      const services = await instanceAxios.get(`/service`)

      setLideres(leaders.data)
      setServicos(services.data)

      if (dayNow != '') {
        const data = await apiDayShow(formatDateN(dayNow))
        setDay(data)
      } else {
        const data = await apiDayShow(formatDateN(new Date()))
        setDayNow(formatDateN(new Date()))
        setDay(data)
      }
    } catch {
      localStorage.clear()
    } finally {
      setSpinnerState(false)
    }
  }

  useEffect(() => {
    api()
  }, [create])

  return (
    <CContainer fluid>
      <DialogModal
        visible={dialogModalVisible}
        messagem={`Você deseja apagar o agendamento ${info} ?`}
        title={'Deleta Agendamento?'}
        onCloseModal={onCloseModal}
        onConfime={onConfirme}
      />

      <CRow>
        <CCol xs={12} md={7}>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol>
                  <div>
                    <h4>
                      <CalendarMonthIcon className="me-2" style={{ fontSize: 30 }} />
                      Agendamentos
                    </h4>
                    <span>Agendamento de Serviços</span>
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
                    <span className="d-md-block d-none">Novo Agendamento</span>
                  </CButton>
                </CCol>
              </CRow>

              <Calendar
                isoWeek={false}
                compact
                bordered
                onSelect={handleSelectDay}
                renderCell={renderCellDay}
              />
            </CCardBody>
            <CFooter>
              <CCol className="d-flex align-items-center justify-content-center gap-2">
                <div
                  style={{
                    width: 13,
                    height: 13,
                    backgroundColor: '#6C82D3',
                    borderRadius: 13,
                  }}
                ></div>

                <strong>c/Agendamentos</strong>
              </CCol>
              <CCol className="d-flex align-items-center justify-content-center gap-2">
                <div
                  style={{
                    width: 13,
                    height: 13,
                    backgroundColor: '#169DE0',
                    borderRadius: 13,
                  }}
                ></div>

                <strong>Hoje</strong>
              </CCol>
              <CCol className="d-flex align-items-center justify-content-center gap-2">
                <div
                  style={{
                    width: 13,
                    height: 13,
                    backgroundColor: '#353e5f',
                    borderRadius: 13,
                  }}
                ></div>

                <strong>Fora do Mês</strong>
              </CCol>
            </CFooter>
          </CCard>
        </CCol>

        <CCol xs={12} md={5}>
          <CRow>
            <CCol>
              <CCard className="mt-2">
                <CCardBody>
                  <CRow>
                    <CCol>
                      <div className="d-md-flex align-items-start justify-content-between d-block">
                        <div className="d-flex">
                          <div>
                            <CalendarMonthIcon className="me-2" style={{ fontSize: 35 }} />
                          </div>

                          <div>
                            <h4>Agendamentos do dia</h4>
                            <h5 style={{ fontSize: 17 }}>{dataExtenso(dayNow)}</h5>
                          </div>
                        </div>

                        <div className="mt-2 mt-md-0">
                          <CButton
                            color="primary"
                            onClick={() => setVisibleCollapse(!visibleCollapse)}
                            onBlur={() => {
                              setVisibleCollapse(false)
                            }}
                          >
                            <BarChartIcon />
                            Estatística
                          </CButton>
                        </div>
                      </div>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          <CCollapse visible={visibleCollapse}>
            <CRow className="mt-2">
              <CCol>
                <CCard>
                  <CCardBody>
                    <h5>Quantidade de Agendados</h5>
                    <CRow className="mt-2">
                      <CCol xs={12} md={4}>
                        <CardInfo
                          icon={<CancelIcon style={{ fontSize: 30 }} className="text-danger" />}
                          day={day.filter((d) => d.presence == 0).length}
                          title={'Ausentes'}
                        />
                      </CCol>

                      <CCol xs={12} md={4}>
                        <CardInfo
                          icon={
                            <ExpandCircleDownIcon
                              style={{ fontSize: 30 }}
                              className="text-success"
                            />
                          }
                          day={day.filter((d) => d.presence != 0).length}
                          title={'Presentes'}
                        />
                      </CCol>

                      <CCol md={4}>
                        <CardInfo
                          icon={<ArticleIcon style={{ fontSize: 30 }} className="text-info" />}
                          day={day.filter((d) => d.regulation == 1).length}
                          title={'Regulação'}
                        />
                      </CCol>

                      <CCol md={4}>
                        <CardInfo
                          icon={
                            <AccountBoxIcon style={{ fontSize: 30 }} className="text-primary" />
                          }
                          day={day.length}
                          title={'Total'}
                        />
                      </CCol>
                    </CRow>

                    <h5>Quantidade de Serviços do Dia</h5>

                    <CRow className="mt-2" md={{ cols: 3 }} xs={{ cols: 2 }}>
                      {Object.entries(filterServices).map(([key, value]) => {
                        return (
                          <CCol>
                            <CardInfo icon={<CIcon icon={cilPin} />} day={value} title={key} />
                          </CCol>
                        )
                      })}
                    </CRow>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CCollapse>

          <CRow className="mt-2">
            <CCol>
              <CCard>
                <CardBody>
                  <div className="p-3">
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilSearch} />
                      </CInputGroupText>

                      <CFormInput
                        value={valueBuscarAgendado}
                        type="text"
                        placeholder="Buscar por nome/CPF"
                        onChange={({ target }) => {
                          setBuscarAgendado(target.value)
                        }}
                      />
                      <CButton
                        color="primary"
                        onClick={() => {
                          setBuscarAgendado('')
                        }}
                      >
                        Limpar
                      </CButton>
                    </CInputGroup>
                  </div>
                </CardBody>
              </CCard>
            </CCol>
          </CRow>

          <CRow>
            <CCol>
              {spinnnerState ? (
                <div className="d-flex justify-content-center mt-5">
                  <CSpinner />
                </div>
              ) : (
                <ListCardAgenda data={filterAgendados} />
              )}
            </CCol>
          </CRow>
        </CCol>
      </CRow>

      <ModalDash
        title={'Agendar'}
        icon={cilCalendar}
        handleButtonSalveModal={handleButtonSalveModal}
        CloseAdd={CloseAdd}
        ref={modalVisible}
        isSpinner={isSubmitting}
      >
        <ListView>
          <CCol>
            <form onSubmit={handleSubmit(onsubmit)}>
              <Box>
                <CFormLabel style={{ padding: 3, fontWeight: 'bold', fontSize: 20 }}>
                  Data: {formatDate(dayNow)}
                </CFormLabel>
              </Box>
              <Box>
                <Controller
                  name="citizen_id"
                  control={control}
                  render={({ field }) => <SelectChange {...field} />}
                />

                <Box sx={{ marginTop: 2 }}>
                  <CFormSelect
                    style={{ marginTop: 3 }}
                    floatingLabel="Serviço"
                    aria-label="Floating label select example"
                    {...register('service_id', { required: true })}
                  >
                    <option value={''}>Serviço à ser Agendado</option>
                    {servicos.map((servico) => (
                      <option value={servico.id}> {servico.service} </option>
                    ))}
                  </CFormSelect>
                </Box>

                <Box sx={{ marginTop: 2 }}>
                  <CFormSelect
                    style={{ marginBottom: 3 }}
                    floatingLabel="Lider Responsavel"
                    aria-label="Floating label select example"
                    {...register('leader_id')}
                  >
                    <option value={''}>Selecionar Lider</option>
                    {lideres.map((lider) => (
                      <option value={lider.id}>
                        {lider.uid} / {lider.name}
                      </option>
                    ))}
                  </CFormSelect>
                </Box>

                <Box sx={{ marginTop: 1 }}>
                  <CFormTextarea
                    id="exampleFormControlTextarea1"
                    label="Observaçôes"
                    rows={3}
                    {...register('observation')}
                  ></CFormTextarea>
                </Box>
              </Box>
              <input type="submit" hidden id="submitbtn" />
            </form>
          </CCol>
        </ListView>
      </ModalDash>
    </CContainer>
  )
}

export default Agendamentos
