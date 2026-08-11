import React, { useEffect, useState } from 'react'
import { cilOptions } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { Box, Menu, MenuItem, Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import ContentPasteOffIcon from '@mui/icons-material/ContentPasteOff'
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt'
import ArticleIcon from '@mui/icons-material/Article'
import NotesIcon from '@mui/icons-material/Notes'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormLabel,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CPopover,
  CRow,
  CTooltip,
} from '@coreui/react'
import { formatDate } from '../../../../utils/Utils'
import { fomartCPF, handleFomartPhone } from '../../../regencia/Cards/Utils/FormatInput'

import PersonIcon from '@mui/icons-material/Person'
import PhoneIcon from '@mui/icons-material/Phone'
import BadgeIcon from '@mui/icons-material/Badge'
import CakeIcon from '@mui/icons-material/Cake'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import WorkIcon from '@mui/icons-material/Work'
import { Dropdown } from 'rsuite'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

const CardAgendamento = ({ data, deleteAgendamento, confimeAgendamento, regulacao }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [colorBorderService, setBorderService] = useState()
  const [confim, setConfim] = useState(false)
  const [colorBadge, setColorBadge] = useState('')
  const [colorRegulacao, setColorRegulacao] = useState('primary')
  const [colorMenuRender, setColorMenuRender] = useState('danger')
  const [visibleCollapse, setvisibleColapse] = useState(false)

  const [visible, setVisible] = useState(false)
  const [textArea, setTextArea] = useState('')

  const [openNotaRegulacao, setCloseModalNotaRegulacao] = useState({
    visible: false,
    note: '',
  })

  const [menuDateResender, setMenuDateResender] = useState(true)

  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(false)
  }

  const handleCollapse = () => {
    setvisibleColapse(!visibleCollapse)
  }

  const handleMenuConfim = () => {
    confimeAgendamento({ id: data.id, type: 'pres', value: true, obs: '', data: data })
    handleClose()
  }

  const handleMenuRegulacao = () => {
    setVisible(true)
    handleClose()
  }

  const handleMenuRegulacaoRemover = () => {
    regulacao({ id: data.id, type: 'regu', value: false, obs: '', data: data })
    handleClose()
  }

  const handleMenuDelete = (data) => {
    deleteAgendamento(data)
    handleClose()
  }

  const validacaoDiaAgendamento = (data) => {
    const data_atual = formatDate(new Date())

    const [diaAtual, mesAtual, anoAtual] = data_atual.split('/')

    const [diaAgend, mesAgend, anoAgend] = data.date_string.split('/')

    if (Number(anoAgend) < Number(anoAtual)) setMenuDateResender(false)
    else {
      if (Number(mesAgend) < Number(mesAtual)) {
        setMenuDateResender(false)
      } else {
        if (Number(diaAgend) < Number(diaAtual)) {
          setMenuDateResender(false)
        }
      }
    }
  }

  useEffect(() => {
    validacaoDiaAgendamento(data)

    if (data.presence) {
      setBorderService('border-start-success ')
      setColorBadge('success')
    } else {
      setBorderService('border-start-secondary')
      setColorBadge('secondary')
    }
  }, [confim])

  const textAreaObservacao = (e) => {
    setTextArea(e.target.value)
  }

  const handleCloseModal = () => {
    setVisible(false)
  }

  const handleSaveModal = () => {
    regulacao({ id: data.id, type: 'regu', value: true, obs: textArea, data: data })
    handleCloseModal()
  }

  return (
    <CCard className={`mt-2 pe-3 pe-md-0 border rounded border-start-5 ${colorBorderService}`}>
      <CCardBody>
        <CRow>
          <CCol>
            <CRow>
              <CCol md={8} xs={12}>
                <span
                  className="text-uppercase fw-bold mb-2"
                  style={{
                    fontSize: 17,
                  }}
                >
                  {data.name}
                </span>
              </CCol>

              <CCol md={4} xs={12} className="d-flex mt-md-0 mt-2 justify-content-start">
                <div>
                  <CBadge
                    color={data.regulation ? 'info' : 'primary'}
                    style={{
                      fontSize: 15,
                    }}
                  >
                    {data.regulation ? (
                      <CPopover
                        content="Serviço com regulação"
                        placement="top"
                        trigger={['hover', 'focus']}
                      >
                        <ArticleIcon sx={{ fontSize: 20 }} className="me-2" />
                      </CPopover>
                    ) : (
                      ''
                    )}
                    {data.service}
                  </CBadge>
                </div>
              </CCol>
            </CRow>
          </CCol>

          <CCol md={2} xs={2}>
            <CDropdown className="d-block">
              <CDropdownToggle>
                <CIcon icon={cilOptions} size="lg" aria-haspopup="true" />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem
                  className="d-flex flex-row align-item-center gap-2"
                  onClick={handleMenuConfim}
                  // onClick={() => {
                  //   open()
                  //   setDataModal(lider)
                  // }}
                >
                  <CheckCircleIcon sx={{ marginRight: 1 }} />
                  Presente
                </CDropdownItem>

                {data.regulation ? (
                  <CDropdownItem onClick={handleMenuRegulacaoRemover}>
                    <ContentPasteOffIcon sx={{ marginRight: 1 }} />
                    Sem Regulação
                  </CDropdownItem>
                ) : (
                  <CDropdownItem onClick={() => handleMenuRegulacao()}>
                    <ContentPasteIcon sx={{ marginRight: 1 }} />
                    Regulação
                  </CDropdownItem>
                )}

                <CDropdownItem
                  className="d-flex flex-row align-item-center gap-2"
                  onClick={() => handleMenuDelete(data)}
                >
                  <DeleteIcon sx={{ marginRight: 1 }} />
                  Deletar
                </CDropdownItem>

                {data.regulation && (
                  <CDropdownItem
                    onClick={() =>
                      setCloseModalNotaRegulacao({
                        visible: true,
                        note: data.observation_regulation,
                      })
                    }
                  >
                    <ArticleIcon sx={{ fontSize: 20 }} className="me-2" />
                    Nota Regulação
                  </CDropdownItem>
                )}
              </CDropdownMenu>
            </CDropdown>
          </CCol>
        </CRow>

        <CRow
          md={{ cols: 3 }}
          xs={{ cols: 1 }}
          className="g-2 mt-md-0 mt-2"
          style={{
            fontSize: 14,
          }}
        >
          <CCol>
            <CTooltip content="Contato" placement="top">
              <div
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => {
                  data.contact_mode == 'lw'
                    ? window.open(`https://wa.me/55${data.contact}`, '_blank')
                    : (window.location.href = `tel:+55${data.contact}`)
                }}
                className={`d-flex align-items-center gap-2 ${
                  data.contact_mode == 'lw'
                    ? 'bg-success rounded-2 p-1'
                    : 'bg-primary rounded-2 p-1'
                }`}
              >
                {data.contact_mode == 'lw' ? <WhatsAppIcon /> : <PhoneIcon />}

                <span>{handleFomartPhone(data.contact)}</span>
              </div>
            </CTooltip>
          </CCol>
          <CCol>
            <CTooltip content="CPF" placement="top">
              <div className="d-flex align-items-center gap-2">
                <PersonIcon />

                {fomartCPF(data.cpf)}
              </div>
            </CTooltip>
          </CCol>

          <CCol className="d-md-flex d-none">
            <CTooltip content="Data de Nascimento" placement="top">
              <div className="d-flex align-items-center gap-2">
                <CalendarMonthIcon />
                {formatDate(data.birth)}
              </div>
            </CTooltip>
          </CCol>
        </CRow>

        <CRow
          className="mt-2"
          style={{
            fontSize: 14,
          }}
        >
          <CCol>
            <span className="fst-italic">
              <AccountCircleIcon className="me-2" />
              Lider: {data.leader}
            </span>
          </CCol>
        </CRow>

        {data.observation && (
          <CRow
            className="mt-2"
            style={{
              fontSize: 14,
            }}
          >
            <CCol>
              <span className="fst-italic fw-bolder text-info">
                <NotesIcon className="me-2" />
                {data.observation}
              </span>
            </CCol>
          </CRow>
        )}

        <CRow className="mt-2">
          <CCol>
            <div className="border p-2 rounded-2">
              <CalendarMonthIcon className="me-2" />
              <small style={{ fontSize: 13, fontStyle: 'italic' }}>
                Registrado por {data.registry_name} | {formatDate(data.createdAt)}
              </small>
            </div>
          </CCol>
        </CRow>
      </CCardBody>

      <CModal
        visible={visible}
        onClose={() => {
          setVisible(false)
        }}
      >
        <CModalHeader>
          <ContentPasteIcon style={{ width: '7%', marginRight: 10 }} />

          <CModalTitle>Regulação</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form>
            <Box>
              <CFormLabel style={{ padding: 2, fontWeight: 'bold' }}>Observaçôes</CFormLabel>

              <Box display={'flex'} gap={1}>
                <Box
                  sx={{
                    width: '100%',
                  }}
                >
                  <CFormTextarea
                    id="exampleFormControlTextarea1"
                    rows={3}
                    onChangeCapture={textAreaObservacao}
                  ></CFormTextarea>
                </Box>
              </Box>
            </Box>
          </form>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleSaveModal}>
            {' '}
            Salvar{' '}
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        visible={openNotaRegulacao.visible}
        size="md"
        onClose={() => {
          setCloseModalNotaRegulacao({ visible: false, note: '' })
        }}
        alignment="center"
      >
        <CModalHeader>
          <ArticleIcon sx={{ fontSize: 20 }} className="me-2" />
          <CModalTitle>Nota da Regulação</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <h6 className="text-center">{openNotaRegulacao.note}</h6>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="danger"
            className="text-white"
            onClick={() => setCloseModalNotaRegulacao({ visible: false, note: '' })}
          >
            Fechar
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>

    // <Box>
    //

    //   <Menu
    //     id="basic-menu"
    //     anchorEl={anchorEl}
    //     open={open}
    //     onClose={handleClose}
    //     MenuListProps={{
    //       'aria-labelledby': 'basic-button',
    //     }}
    //   >
    //     <MenuItem onClick={handleMenuDelete}>
    //       <DeleteIcon sx={{ marginRight: 1 }} />
    //       Deletar
    //     </MenuItem>

    //     <MenuItem onClick={handleMenuConfim}>
    //       <CheckCircleIcon sx={{ marginRight: 1 }} />
    //       Presente
    //     </MenuItem>

    //     {data.regulation ? (
    //       <MenuItem onClick={handleMenuRegulacaoRemover}>
    //         <ContentPasteOffIcon sx={{ marginRight: 1 }} />
    //         Sem Regulação
    //       </MenuItem>
    //     ) : (
    //       <MenuItem onClick={handleMenuRegulacao}>
    //         <ContentPasteIcon sx={{ marginRight: 1 }} />
    //         Regulação
    //       </MenuItem>
    //     )}
    //   </Menu>

    //   <Box
    //     className={`w-100 mb-3 border rounded p-3 border-start border-start-5 ${colorBorderService}`}
    //   >
    //     <Box sx={{ display: 'flex', width: '100%', height: 'auto' }}>
    //       <Box
    //         onClick={handleCollapse}
    //         sx={{
    //           cursor: 'pointer',
    //           display: 'flex',
    //           width: '100%',
    //           flexDirection: 'column',
    //           alignItems: 'start',
    //           justifyContent: 'center',
    //         }}
    //       >
    //         <Box
    //           sx={{
    //             display: 'flex',
    //             fontWeight: 900,
    //             justifyContent: 'space-between',
    //             width: '100%',
    //           }}
    //         >
    //           <Box>
    //             <span style={{ fontSize: 20, textTransform:'uppercase' }}>{data.name}</span>
    //           </Box>

    //           <Box sx={{ gap: 1, display: 'flex' }}>
    //             <span>
    //               <CBadge color={colorBadge} style={{ fontSize: 16 }}>
    //                 {data.service}
    //               </CBadge>
    //             </span>
    //

    //             {/* {!menuDateResender ? (
    //               <span>
    //                 <CPopover
    //                   content="Não e possível delete ou marca presença em agendamentos passados"
    //                   placement="top"
    //                   trigger={['hover', 'focus']}
    //                 >
    //                   <CBadge color={colorMenuRender} sx={{ marginLeft: 1 }}>
    //                     <DoNotDisturbAltIcon sx={{ fontSize: 20 }} />
    //                   </CBadge>
    //                 </CPopover>
    //               </span>
    //             ) : (
    //               ''
    //             )} */}
    //           </Box>
    //         </Box>

    //         <Box>
    //           <span style={{ fontSize: 14 }}>{handleFomartPhone(data.contact)}</span>
    //         </Box>

    //         {/* <Box sx={{display:'flex', gap:5,fontWeight:500, justifyContent:'space-between', width:'100%', marginBottom:1, fontSize:18}}>
    //                         <span>Serviço</span>
    //                         <span></span>
    //                     </Box> */}

    //         <CCollapse visible={visibleCollapse}>
    //           <Box
    //             sx={{
    //               display: 'flex',
    //               flexDirection: 'row',
    //               gap: 3,
    //               marginTop: 2,
    //             }}
    //           >
    //             <TitleInfo
    //               title={'CPF: '}
    //               value={fomartCPF(data.cpf)}
    //               sx={{
    //                 fontWeight: 500,
    //               }}
    //             />

    //             <TitleInfo
    //               title={'D.N: '}
    //               value={formatDate(data.birth)}
    //               sx={{
    //                 fontWeight: 500,
    //               }}
    //             />
    //           </Box>

    //           <TitleInfo
    //             title={'Lider: '}
    //             value={data.leader}
    //             sx={{
    //               fontWeight: 500,
    //             }}
    //           />

    //           {data.observation_regulation != '' ? (
    //             <TitleInfo
    //               title={'Regulação: '}
    //               value={data.observation_regulation}
    //               sx={{
    //                 fontWeight: 500,
    //               }}
    //             />
    //           ) : (
    //             ''
    //           )}

    //           {data.observation != '' ? (
    //             <TitleInfo
    //               title={'Observação: '}
    //               value={data.observation}
    //               sx={{
    //                 fontWeight: 500,
    //               }}
    //             />
    //           ) : (
    //             ''
    //           )}

    //           <TitleInfo
    //             title={'Agendado por:'}
    //             value={`${data.registry_name} em ${formatDate(data.createdAt)}`}
    //             sx={{
    //               color: '#fff8',
    //             }}
    //           />
    //         </CCollapse>
    //       </Box>

    //       <Box sx={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
    //         <Button
    //           id="basic-button"
    //           aria-controls={open ? 'basic-menu' : undefined}
    //           aria-haspopup="true"
    //           aria-expanded={open ? 'true' : undefined}
    //           onClick={handleClick}
    //         >
    //           <CIcon icon={cilOptions} size="lg" aria-haspopup="true" />
    //         </Button>
    //       </Box>
    //     </Box>
    //   </Box>
    // </Box>
  )
}

export default React.memo(CardAgendamento)
