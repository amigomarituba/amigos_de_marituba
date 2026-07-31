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
  CCol,
  CCollapse,
  CContainer,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { Box } from '@mui/material'
import { cilUser } from '@coreui/icons'
import { useForm } from 'react-hook-form'
import { instanceAxios } from '../../config/api'
import AlertRegistre from '../../components/AlertRegistre/AlertRegistre'
import DialogModal from '../../components/DialogModal/DialogModal'
import { formatDate } from '../../utils/Utils'
import { useSelector } from 'react-redux'

const Cidadoes = () => {
  const user = useSelector((state) => state.user)

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

  const [leaders, setLeaders] = useState([])

  const fillterCallback = async (filter) => {
    setSpinnerState(true)
    if (filter.input != '') {
      const { data } = await instanceAxios.get('/citizen/show', {
        params: filter,
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

  useEffect(() => {
    Leaders()
  }, [])

  return (
    <>
      <DialogModal
        visible={dialogModalVisible}
        messagem={`Você deseja apagar o cidadao ${infoLider} ?`}
        title={'Deleta Cidadao?'}
        onCloseModal={onCloseModal}
        onConfime={onConfirme}
      />

      <AlertRegistre
        open={alertAgendamentosFuturos}
        handleClose={handleClose}
        severity={'warning'}
        message={'Não é possivel deleta, cidadão ainda possue agendamentos futuros!'}
      />

      <AlertRegistre
        open={alertJaCriado}
        handleClose={handleClose}
        severity={'warning'}
        message={'Cidadão já possue um Cadastrado'}
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
        open={alertOpen}
        handleClose={handleClose}
        severity={'success'}
        message={'Registrado com Sucesso'}
      />

      <AlertRegistre
        open={alertErro}
        handleClose={handleClose}
        severity={'error'}
        message={'Erro no Salvento do Registro'}
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
          <CModalTitle id="OptionalSizesExample1">
            Histórico de Serviços de {titleModal}
          </CModalTitle>
          <CButton
            color="primary"
            style={{
              width: '10%',
              marginLeft: 10,
            }}
            onClick={() => {
              setMetricasCollapse(!metricasCollapse)
            }}
          >
            Métricas
          </CButton>
        </CModalHeader>

        <CModalBody>
          <CCollapse visible={metricasCollapse}>
            <Box
              sx={{
                display: 'flex',
                gap: 5,
              }}
            >
              <Box
                sx={{
                  width: '50%',
                }}
              >
                <CModalTitle>Métrica por Serviço</CModalTitle>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Serviços</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {services.map((service, index) => {
                      return (
                        <CTableRow key={index}>
                          <CTableDataCell>
                            <CBadge color={'secondary'}>{service.service}</CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            {
                              agendamentos.filter(
                                (agendamento) => agendamento.service == service.service,
                              ).length
                            }
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })}
                  </CTableBody>
                </CTable>
              </Box>

              <Box
                sx={{
                  width: '50%',
                }}
              >
                <CModalTitle>Métrica Geral</CModalTitle>

                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Condição</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell>
                        <CBadge color={'primary'}>Presente</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        {agendamentos.filter((a) => a.presence == 1).length}
                      </CTableDataCell>
                    </CTableRow>

                    <CTableRow>
                      <CTableDataCell>
                        <CBadge color={'danger'}>Ausente</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        {agendamentos.filter((a) => a.presence == 0).length}
                      </CTableDataCell>
                    </CTableRow>

                    <CTableRow>
                      <CTableDataCell>
                        <CBadge color={'success'}>Total</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>{agendamentos.length}</CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </Box>
            </Box>
          </CCollapse>

          <CModalTitle style={{ textAlign: 'center' }}>Serviços Agendados</CModalTitle>

          <CTable
            hover
            style={{
              overflowX: 'auto',
            }}
          >
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

      <ModalDash
        title="Registra/Atualizar Cidadão"
        icon={cilUser}
        CloseAdd={CloseAdd}
        handleButtonSalveModal={handleButtonSalveModal}
        ref={modalVisible}
        isSpinner={isSubmitting}
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

              <input type="submit" hidden id="submitbtn" />
            </CForm>
          </CContainer>
        </ListView>
      </ModalDash>

      <HeaderSeach
        placeholder={'Nome / CPF / RG / Código de Lider'}
        fillterCallback={fillterCallback}
        OnChangeArea={OnChangeArea}
        nameFiltro={''}
        select={[]}
      />

      <ListView>
        {spinnnerState ? (
          <div className="d-flex justify-content-center mt-5">
            <CSpinner />
          </div>
        ) : cidadao.length != 0 ? (
          cidadao.map((data) => {
            return (
              <CardCidadao
                key={data.id}
                data={data}
                editerCidadao={handleEditer}
                deleteCidadao={handleDelete}
                historico={handleHistorico}
              />
            )
          })
        ) : (
          <h3 style={{ textAlign: 'center' }}>Nenhum Cidadão Encontrado</h3>
        )}
      </ListView>
    </>
  )
}

export default Cidadoes
