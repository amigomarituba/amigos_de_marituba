import {
  CButton,
  CCol,
  CContainer,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
  CSpinner,
} from '@coreui/react'
import { Box } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { Calendar, Col } from 'rsuite'
import 'rsuite/Calendar/styles/index.css'
import ModalDash from '../../../components/Modal/ModalDash'
import { cilCalendar } from '@coreui/icons'
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

const Agendamentos = () => {
  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm() //fomulario

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
  const [deleteID, setDeleteID] = useState('')
  const [info, setInfo] = useState({})

  const [alertOpen, setAlertOpen] = useState(false) //alerte de sucesso
  const [alertErro, setAlertErro] = useState(false) //alert de erro

  //stado de delete
  const [alertDeleteOpen, setAlertDeleteOpen] = useState(false)
  const [alertDeleteError, setAlertDeleteError] = useState(false)

  const [alertNotSheduller, setAlertNotSheduller] = useState(false)

  const [filterServices, setFilterServices] = useState([])

  const handleClose = () => {
    setAlertOpen(false)
    setAlertErro(false)
  }

  const onCloseModal = () => {
    setDialogModalVisible(false)
  }

  const onConfirme = async () => {
    const { status } = await instanceAxios.delete(`/scheduling/${deleteID}`)

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
      console.log(filter_count_service)

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

    const { status } = await instanceAxios.post('/scheduling/create', agendamento)

    if (status == 200) {
      setAlertOpen(true)
    } else {
      setAlertErro(true)
    }

    setTimeout(() => {
      setAlertOpen(false)
      setAlertOpen(false)
    }, 3000)

    setCreate(!create)
    modalVisible.current.visibleModal()

    // setAlertNotSheduller(true)

    // setTimeout(() => {
    //   setAlertNotSheduller(false)
    // }, 3000)
  }

  const handleButtonSalveModal = () => {
    document.getElementById('submitbtn').click()
  }

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
              borderRadius: 50,
              width: 30,
              height: 30,
              backgroundColor: 'rgba(128, 155, 255, 0.41)',
              position: 'absolute',
              zIndex: -1,
            }}
          ></div>
        )
      }
    })

    return d
  }

  const handleRegulacao = async (dataR) => {
    const { data } = await instanceAxios.post(`/scheduling/update`, dataR)
    setCreate(!create)
  }

  const handleConfimeAgendamento = async (dataC) => {
    const { data } = await instanceAxios.post(`/scheduling/update`, dataC)
    setCreate(!create)
  }

  const handleDeleteAgendamento = async (data) => {
    setDialogModalVisible(true)
    setDeleteID(data.id)
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
          style={{ textAlign: 'center', color: 'rgba(244,244,244,.3)', textTransform: 'uppercase' }}
        >
          Sem Agendamento no dia
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
      const leaders = await instanceAxios.get(`/leader`)
      const services = await instanceAxios.get(`/service`)
      const scheduling = await instanceAxios.get(`/scheduling`)

      setMarcadoDia(scheduling.data)
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

      <AlertRegistre
        open={alertOpen}
        handleClose={handleClose}
        severity={'success'}
        message={'Registrado com Sucesso!'}
      />

      <AlertRegistre
        open={alertErro}
        handleClose={handleClose}
        severity={'error'}
        message={'Erro no Salvento do Registro'}
      />

      <AlertRegistre
        open={alertDeleteOpen}
        handleClose={handleClose}
        severity={'success'}
        message={'Excluido com sucesso'}
      />

      <AlertRegistre
        open={alertDeleteError}
        handleClose={handleClose}
        severity={'error'}
        message={'Erro na Exclusão'}
      />

      <AlertRegistre
        open={alertNotSheduller}
        handleClose={handleClose}
        severity={'warning'}
        message={'Não é Possivel agendar em datas passadas'}
      />

      <CRow className="g-7">
        <CCol xs={12} md={6}>
          <Calendar
            isoWeek={false}
            compact
            bordered
            className="w-100 mb-3"
            onSelect={handleSelectDay}
            renderCell={renderCellDay}
          />
        </CCol>
        <CCol xs={12} md={6}>
          <h4 className="text-center">CIDADÃOS</h4>
          <h6 className="text-center mb-3 text-uppercase">
            Total: {day.length} | presentes: {day.filter((d) => d.presence == 1).length} | ausentes:{' '}
            {day.filter((d) => d.presence == 0).length}
          </h6>
          <div className="d-flex justify-content-center flex-row gap-3 mt-3 mb-3">
            {Object.entries(filterServices).map(([key, value]) => {
              return (
                <small key={key} className='fw-bold fs-6 text-uppercase'>
                  {key} : {value}
                </small>
              )
            })}
          </div>
          {spinnnerState ? (
            <div className="d-flex justify-content-center mt-5">
              <CSpinner />
            </div>
          ) : (
            <ListCardAgenda data={day} />
          )}
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
