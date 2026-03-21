import React, { useEffect, useRef, useState } from 'react'
import { cilClipboard } from '@coreui/icons'
import ModalDash from '../../components/Modal/ModalDash'
import HeaderSeach from '../../components/header/HeaderSeach'
import ListView from '../../components/ListView/ListView'
import { useParams } from 'react-router-dom'
import {
  CButtonGroup,
  CCol,
  CContainer,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CRow,
} from '@coreui/react'
import CardLider from './Cards/CardLider'
import { Box } from '@mui/material'
import { instanceAxios } from '../../config/api'
import { useForm } from 'react-hook-form'
import AlertRegistre from '../../components/AlertRegistre/AlertRegistre'
import DialogModal from '../../components/DialogModal/DialogModal'
import { useSelector } from 'react-redux'

const Lideres = () => {
  const user = useSelector((state) => state.user)
  const { fill } = useParams() // parametro de busca da url
  const { reset, register, handleSubmit } = useForm() //fomulario

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

  // const [address, setAddress] = useState({})

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
    const { data } = await instanceAxios.get(`/leader`)
    setLideres(data)
  }

  const handleEditer = (LiderID) => {
    LiderID.edite = true
    reset(LiderID)
    modalVisible.current.visibleModal()
  }

  const handleDelete = async (lider) => {
    setDialogModalVisible(true)
    setDeleteID(lider.id)
    setInfoLider(`${lider.name} de codigo ${lider.uid}`)
  }

  const OnChangeArea = async (e) => {
    // if (e.target.name == 'iszone') {
    //   let codigo_area_enabled = document.getElementsByName('zone_uid')
    //   codigo_area_enabled[0].disabled = e.target.value === 'true' ? false : true
    // }
  }

  const fillterCallback = async (filter) => {
    const { data } = await instanceAxios.get('/leader/show/all', {
      params: filter,
    })

    setLideres(data)
  }

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
        setAlertOpen(true)
      } else {
        setAlertErro(true)
      }

      setTimeout(() => {
        setAlertOpen(false)
        setAlertErro(false)
      }, 3000)
    } else {
      const { status } = await instanceAxios.post('/leader/create', liderData)

      if (status == 202) {
        setAlertJaCriado(true)
      }

      if (status == 200) {
        setAlertOpen(true)
      }

      if (status == 401) {
        setAlertErro(true)
      }

      setTimeout(() => {
        setAlertJaCriado(false)
        setAlertOpen(false)
        setAlertErro(false)
      }, 3000)
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
    <>
      <DialogModal
        visible={dialogModalVisible}
        messagem={`Você deseja apagar o lider ${infoLider} ?`}
        title={'Deleta Lider?'}
        onCloseModal={onCloseModal}
        onConfime={onConfirme}
      />

      <AlertRegistre
        open={alertJaCriado}
        handleClose={handleClose}
        severity={'warning'}
        message={'Lider já possue um Cadastrado'}
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
        message={'Registrado com Sucesso!'}
      />

      <AlertRegistre
        open={alertErro}
        handleClose={handleClose}
        severity={'error'}
        message={'Erro no Salvento do Registro'}
      />

      <ModalDash
        title={`Registra/Atualizar Líder`}
        icon={cilClipboard}
        CloseAdd={CloseAdd}
        handleButtonSalveModal={handleButtonSalveModal}
        ref={modalVisible}
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
                floatingClassName="mb-3"
                floatingLabel="CPF"
                placeholder="Nome do Lider"
                {...register('cpf', { required: true, maxLength: 11 })}
              />

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

              {/* <CFormInput
                  type="text"
                  id="nameArea"
                  floatingClassName="mb-3"
                  floatingLabel="Telefone"
                  placeholder="919xxxxxxxx"
                  maxLength={15}
                  value={phoneOne}
                  onChangeCapture={(e) => { handleFomartPhone(e, handleSetPhoneOne) }}
                  {...register('leaders_contact_one.phone')}
                />
                <input type='text' value={'ligacao'} hidden {...register('leaders_contact_one.mode', { required: true })} /> */}

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

      <HeaderSeach
        placeholder={'Nome / CPF / Codigo do Lider'}
        fillterCallback={fillterCallback}
        OnChangeArea={OnChangeArea}
        nameFiltro={''}
        select={
          [
            // {
            //   name:'iszone',
            //   labels: [
            //     { label: 'Com Area', uid: 'true' },
            //     { label: 'Sem Area', uid: 'false' }
            //   ]
            // },
            // {
            //   name:'zone_uid',
            //   nameLabel:'Todas as Áreas',
            //   labels: areas
            // }
          ]
        }
      />

      <ListView>
        {lideres.map((data, index) => {
          return (
            <CardLider
              key={index}
              data={data}
              editerLider={handleEditer}
              deleteLider={handleDelete}
            />
          )
        })}
      </ListView>
    </>
  )
}

export default Lideres
