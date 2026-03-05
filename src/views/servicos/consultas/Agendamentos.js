import {CButton, CCol, CContainer, CFormInput, CFormLabel, CFormSelect, CFormTextarea } from "@coreui/react"
import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react"
import { Calendar, Col } from "rsuite"
import 'rsuite/Calendar/styles/index.css';
import ModalDash from "../../../components/Modal/ModalDash";
import { cilCalendar } from "@coreui/icons";
import CardAgendamento from "./Cards/CardAgendamento";
import ListView from "../../../components/ListView/ListView";
import { useForm } from "react-hook-form";
import { instanceAxios } from "../../../config/api";
import DialogModal from "../../../components/DialogModal/DialogModal";
import AlertRegistre from "../../../components/AlertRegistre/AlertRegistre";
import { formatDate, formatDateN } from "../../../utils/Utils";
import { fomartCPF } from "../../regencia/Cards/Utils/FormatInput";

const Agendamentos = () => {
  const { reset, register, handleSubmit } = useForm() //fomulario

  const [create, setCreate] = useState(false)
  const [dayNow, setDayNow] = useState('')

  const [inputCidadao, setInputCidadao] = useState('')

  const [listaCidadoes, setListaCidadoes] = useState([])

  const [day, setDay] = useState([])
  const [marcadoDia, setMarcadoDia] = useState([])

  const modalVisible = useRef()//referencia para abrir o modal

  const [lideres, setLideres] = useState([])
  const [servicos, setServicos] = useState([])

  const [dialogModalVisible, setDialogModalVisible] = useState(false)
  const [deleteID, setDeleteID] = useState('')
  const [info, setInfo] = useState({})

  const [alertOpen, setAlertOpen] = useState(false);//alerte de sucesso
  const [alertErro, setAlertErro] = useState(false);//alert de erro

  //stado de delete
  const [alertDeleteOpen, setAlertDeleteOpen] = useState(false)
  const [alertDeleteError, setAlertDeleteError] = useState(false)

  const handleClose = () => {
    setAlertOpen(false)
    setAlertErro(false)
  };

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
    const { data } = await instanceAxios.get('/scheduling/show', {
      params: { date: date }
    })
    return data
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

  }

  const handleButtonSalveModal = () => { document.getElementById('submitbtn').click() }

  const sendCidadoes = async () => {
    const { data } = await instanceAxios.get('/citizen/show', {
      params: { input: inputCidadao }
    })
    setListaCidadoes(data)
  }

  const handleCidadao = (e) => { setInputCidadao(e.target.value) }

  const renderCellDay = (date) => {

    let dataF = formatDate(date)

    const d = marcadoDia.map(day => {
      let show = day.date_string == formatDate(date) ? true : false
      if (show) {
        return (<div color="primary" style={{ borderRadius: 50, width: 30, height: 30, backgroundColor: "rgba(128, 155, 255, 0.41)", position: 'absolute', zIndex: -1 }}></div>)
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
        return <CardAgendamento key={index} data={day} confimeAgendamento={handleConfimeAgendamento} deleteAgendamento={handleDeleteAgendamento} regulacao={handleRegulacao} />
      })
    } else {
      return (
        <h5 style={{ textAlign: 'center' }}>
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
    try{

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
    }
  }

  useEffect(() => {
    
    api()
  }, [create])


  return (
    <CContainer style={{ display: 'flex', marginLeft: 0, marginRight: 0 }}>
      <Col style={{ height: 'auto', width: "50%", marginRight: 5 }}>
        <Calendar
          isoWeek={false}
          compact
          style={{ width: '100%' }}
          onSelect={handleSelectDay}
          renderCell={renderCellDay}
        />
      </Col>
      <Col style={{ height: '', width: '70%', padding: 2 }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: 1 }} >
          <h4>Serviços Agendados</h4>
          <h6>Total: {day.length} | presentes: {day.filter(d => d.presence == 1).length} | ausentes: {day.filter(d => d.presence == 0).length}</h6>
        </Box>
        
        <Box sx={{ width: '100%', overflow: "auto", height: '62vh' }}>

          <ListCardAgenda data={day} />

        </Box>

      </Col>

      <DialogModal
        visible={dialogModalVisible}
        messagem={`Você deseja apagar o agendamento ${info} ?`}
        title={'Deleta Agendamento?'}
        onCloseModal={onCloseModal}
        onConfime={onConfirme}
      />

      <AlertRegistre open={alertOpen} handleClose={handleClose}
        severity={'success'} message={'Registrado com Sucesso!'} />

      <AlertRegistre open={alertErro} handleClose={handleClose}
        severity={'error'} message={'Erro no Salvento do Registro'} />

      <AlertRegistre open={alertDeleteOpen} handleClose={handleClose}
        severity={'success'} message={'Excluido com sucesso'} />

      <AlertRegistre open={alertDeleteError} handleClose={handleClose}
        severity={'error'} message={'Erro na Exclusão'} />

      <ModalDash
        title={"Agendar"}
        icon={cilCalendar}
        handleButtonSalveModal={handleButtonSalveModal}
        CloseAdd={CloseAdd}
        ref={modalVisible}
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
                <CFormLabel style={{ padding: 2, fontWeight: 'bold' }}>
                  Buscar Cidadão
                </CFormLabel>

                <Box display={'flex'} gap={1}>
                  <Box sx={{
                    width: '100%'
                  }} >

                    <CFormInput
                      id='input'
                      type="text"
                      floatingClassName="mb-3"
                      floatingLabel="CPF/RG/NOME"
                      placeholder="CPF/RG/NOME"

                      onChange={handleCidadao}
                    />
                  </Box>



                  <Box>

                    <CButton
                      color='primary'
                      variant='outline'
                      style={{
                        height: '80%'
                      }}
                      onClick={sendCidadoes}
                    >
                      Buscar
                    </CButton>

                  </Box>

                </Box>

                <Box>

                  <CFormSelect
                    style={{ marginBottom: 3 }}
                    floatingLabel="Selecionar Cidadão"
                    aria-label="Floating label select example"
                    {...register('citizen_id', { required: true })}
                  >
                    <option value={''}>{
                      listaCidadoes.length != 0 ?
                        "Selecione o Cidadão" : "Nenhum cidadão encontrado"
                    }
                    </option>

                    {

                      listaCidadoes.map((cidadao) =>
                        <option value={cidadao.id}>
                          {cidadao.name} - {formatDate(cidadao.birth)} - {fomartCPF(cidadao.cpf)}
                        </option>
                      )
                    }
                  </CFormSelect>

                </Box>

                <Box sx={{ marginTop: 2 }}>

                  <CFormSelect
                    style={{ marginTop: 3 }}
                    floatingLabel="Serviço"
                    aria-label="Floating label select example"
                    {...register('service_id', { required: true })}
                  >
                    <option value={''}>Serviço à ser Agendado</option>
                    {
                      servicos.map((servico) =>
                        <option value={servico.id}> {servico.service} </option>
                      )
                    }
                  </CFormSelect>

                </Box>

                {/* <Box sx={{marginTop:2}}>
                  <CFormInput
                      type="time"
                      floatingClassName="mb-3"
                      floatingLabel="Horário"
                      placeholder="Horário"
                      // {...register('time', { required: true })}
                    />
                </Box> */}

                <Box sx={{ marginTop: 2 }}>
                  <CFormSelect
                    style={{ marginBottom: 3 }}
                    floatingLabel="Lider Responsavel"
                    aria-label="Floating label select example"
                    {...register('leader_id', { required: true })}
                  >
                    <option value={''}>Selecionar Lider</option>
                    {
                      lideres.map((lider) =>
                        <option value={lider.id}>
                          {lider.uid}  / {lider.name}
                        </option>
                      )
                    }
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
              <input type='submit' hidden id='submitbtn' />
            </form>

          </CCol>
        </ListView>
      </ModalDash>
    </CContainer>


  )
}

export default Agendamentos
