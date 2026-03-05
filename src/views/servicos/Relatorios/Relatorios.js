import { CBadge, CButton, CCol, CFormInput, CFormSelect, CTable, CTableBody, CTableDataCell, CTableFoot, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { instanceAxios } from '../../../config/api'
import { useForm } from 'react-hook-form'
import moment from 'moment'
import { fomartCPF } from '../../regencia/Cards/Utils/FormatInput'
import { formatDate } from '../../../utils/Utils'

const Relatorios = () => {

  const { register, handleSubmit, reset} = useForm()
  const [lideres, setLideres] = useState([])
  const [agendamentos, setAgendamentos] = useState([])
  const [servicos, setServicos] = useState([])
  const [solicitado, setSolicitado] = useState(false)

  const onsubmit = async (data) => {
    
    const { date_start, date_end, service_id,presence,leader_id} = data
    
    let repot_scheduling ;

    if (date_end == '' && date_start == "" && service_id == '' && presence == '' && leader_id == ''){
      repot_scheduling = await instanceAxios.get(`/report`)
      setAgendamentos(repot_scheduling.data)
    }else {
      repot_scheduling = await instanceAxios.get(`/report/show`,
        {
          params: {data}
        }
      )

      setAgendamentos(repot_scheduling.data)
      
    }
    setSolicitado(true)
    reset({})
  }

  const api = async () => {
    const leaders = await instanceAxios.get(`/leader`)
    const services = await instanceAxios.get(`/service`)
    setLideres(leaders.data)
    setServicos(services.data)
  }

  useEffect(() => {
    api()
  }, [])


  return (
    <CCol>
      <h4>Relatório Dinâmico</h4>
      <form style={{
        width:'100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 15
      }} onSubmit={handleSubmit(onsubmit)} >

        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 3,
          alignItems:'flex-start'
        }}>

          <Box >

            <CFormSelect
              style={{ marginTop: 3 }}
              floatingLabel="Lideres"
              aria-label="Floating label select example"
              {...register('leader_id')}
            >
              <option value={''}>Todos</option>
              {
                lideres.map((lider, index) =>
                  <option key={index} value={lider.id}> {lider.name} </option>
                )
              }
            </CFormSelect>

          </Box>

          <Box >

            <CFormSelect
              style={{ marginTop: 3 }}
              floatingLabel="Serviços"
              aria-label="Floating label select example"
            {...register('service_id')}
            >
              <option value={''}>Todos</option>
              {
                servicos.map((servico, index) =>
                  <option  key={index} value={servico.id}> {servico.service} </option>
                )
              }
            </CFormSelect>

          </Box>

          <Box >

            <CFormSelect
              style={{ marginTop: 3 }}
              floatingLabel="Presença"
              aria-label="Floating label select example"
            {...register('presence')}
            >
              <option value=''>Todos</option>
              <option value='0'>Ausente</option>
              <option value='1'>Presente</option>


            </CFormSelect>

          </Box>

          <Box sx={{marginTop:'2px'}} >
            <CFormInput
              type="date"
              floatingClassName="mb-3"
              floatingLabel="Data Inicial"
              placeholder="INICIAL"
              {...register('date_start')}
            />

          </Box>
          <Box sx={{marginTop:'2px'}} >

            <CFormInput
              type="date"
              floatingClassName="mb-3"
              floatingLabel="Data Final"
              placeholder="FINAL"
              {...register('date_end')}
            />

          </Box>
        </Box>

        <Box sx={{marginBottom:2}}>
          <CButton type='submit' color='primary' style={{ width: '150px' }} >
            Buscar
          </CButton>
        </Box>
      </form>

      <Box>

        {
          solicitado ? (

            <CTable hover style={{
              overflowX:'auto'
            }}>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Data</CTableHeaderCell>
                <CTableHeaderCell scope="col">Cidadão</CTableHeaderCell>
                <CTableHeaderCell scope="col">CPF</CTableHeaderCell>
                <CTableHeaderCell scope="col">RG</CTableHeaderCell>
                <CTableHeaderCell scope="col">D.N</CTableHeaderCell>
                <CTableHeaderCell scope="col">Servico</CTableHeaderCell>
                <CTableHeaderCell scope="col">Comparecimento</CTableHeaderCell>
                <CTableHeaderCell scope="col">Lider Vinculado</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
  
            <CTableBody >
              
  
                {
                  agendamentos.map((agendamento, index) => {
                    
  
                    return (
                      
                      <CTableRow key={index}>
                        <CTableDataCell >{agendamento.date_string}</CTableDataCell>
                        <CTableDataCell >{agendamento.name}</CTableDataCell>
                        <CTableDataCell >{fomartCPF(agendamento.cpf)}</CTableDataCell>
                        <CTableDataCell >{agendamento.rg}</CTableDataCell>
                        <CTableDataCell >{formatDate(agendamento.birth)}</CTableDataCell>
                        <CTableDataCell >{agendamento.service}</CTableDataCell>
                        <CTableDataCell style={{textAlign:'center'}}>
                          {
                            agendamento.presence ?
                              (<CBadge color={'primary'}>Presente</CBadge>) :
                              (<CBadge color={'danger'}>Ausente</CBadge>)
                          }
                        </CTableDataCell>
  
                        <CTableDataCell>{agendamento.leader}</CTableDataCell>
                        {/* <CTableDataCell>
                         
                        </CTableDataCell> */}

                        {/* <CTableDataCell>{agendamento.registry_name}</CTableDataCell>
                        <CTableDataCell>{formatDate(agendamento.createdAt)}</CTableDataCell> */}
  
                      </CTableRow>
                    )
                  })
                }
              
  
            </CTableBody>
  
            <CTableFoot>
              <CTableRow>
                <CTableDataCell colSpan={3}>Total de Agendamentos: {agendamentos.length}</CTableDataCell>
                <CTableDataCell colSpan={3}>Total de Presente: {agendamentos.filter(d => d.presence == 1).length}</CTableDataCell>
                <CTableDataCell colSpan={3}>Total de Ausentes: {agendamentos.filter(d => d.presence == 0).length}</CTableDataCell>
              </CTableRow>
  
  
            </CTableFoot>
          </CTable>
  
            
          ) :
          (
            <h3 style={{textAlign:'center', opacity:'0.5'}} > Sem Dados Solcitados </h3>
          )
        }
      </Box>

      <Box sx={{
        width:'100%',
        textAlign:'end',
        marginBottom:3
      }} >
        <CButton color='primary' disabled>
          Baixar Relatorio
        </CButton>
      </Box>


    </CCol>

  )
}

export default Relatorios
